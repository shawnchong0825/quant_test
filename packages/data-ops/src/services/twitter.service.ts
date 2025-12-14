import axios from 'axios';

export class TwitterService {
    private bearerToken: string;
    private baseUrl = 'https://twitter.good6.top/api';

    constructor() {
        const bearer = process.env.TWITTER_BEARER_TOKEN;
        if (!bearer) {
            throw new Error('TWITTER_BEARER_TOKEN is missing');
        }
        this.bearerToken = bearer;
        console.log(`[TwitterService] 3rd Party API initialized with key: ${bearer.substring(0, 5)}...`);
    }

    /**
     * Search for recent tweets about keywords (e.g. "$SOL", "memecoin")
     * Uses 3rd party API: https://twitter.good6.top/api/base/apitools/search
     */
    async searchTweets(query: string, maxResults: number = 20) {
        const path = '/base/apitools/search';
        // Reverting to Top as it seemed more stable in probes.
        const url = `${this.baseUrl}${path}?words=${encodeURIComponent(query)}&product=Top&apiKey=${this.bearerToken}`;

        console.log(`[TwitterService] Searching for: ${query} via ${this.baseUrl}...`);

        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                const res = await axios.get(url, { validateStatus: () => true });

                if (res.status === 200) {
                    // Check for the specific "Not Found" error that asks to retry
                    if (res.data?.code === 0 && res.data?.data === 'Not Found' && res.data?.msg?.includes('retry')) {
                        console.warn(`[TwitterService] Attempt ${attempt}: 3rd Party API asked to retry. Retrying in 2s...`);
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    }

                    // Handle success case where data is a stringified JSON (code: 1)
                    let responseData = res.data?.data;
                    if (typeof responseData === 'string' && responseData.startsWith('{')) {
                        try {
                            responseData = JSON.parse(responseData);
                        } catch (e) {
                            console.warn(`[TwitterService] Failed to parse nested JSON data:`, e);
                        }
                    } else if (res.data?.data?.search_by_raw_query) {
                        // Direct object case (if API behaves differently sometimes)
                        responseData = res.data.data;
                    }

                    if (responseData?.data?.search_by_raw_query || responseData?.search_by_raw_query) {
                        const root = responseData.data?.search_by_raw_query ? responseData.data.search_by_raw_query : responseData.search_by_raw_query;
                        const tweets = this.parseTimeline({ search_timeline: root.search_timeline });
                        console.log(`[TwitterService] Found ${tweets.length} tweets.`);
                        return tweets;
                    }
                }

                console.warn(`[TwitterService] Attempt ${attempt}: Invalid response. Status: ${res.status}`, JSON.stringify(res.data).substring(0, 100));

            } catch (error: any) {
                console.error(`[TwitterService] Attempt ${attempt} failed:`, error.message);
            }
            // Backoff
            await new Promise(r => setTimeout(r, 2000));
        }

        throw new Error('[TwitterService] Failed to fetch tweets after 5 attempts.');
    }

    private parseTimeline(data: any): any[] {
        const tweets: any[] = [];
        try {
            const instructions = data?.search_timeline?.timeline?.instructions || [];

            for (const instr of instructions) {
                if (instr.type === 'TimelineAddEntries' && Array.isArray(instr.entries)) {
                    for (const entry of instr.entries) {
                        const content = entry.content;
                        if (content?.entryType === 'TimelineTimelineItem') {
                            const result = content.itemContent?.tweet_results?.result;
                            if (result && result.legacy) {
                                tweets.push({
                                    id: result.legacy.id_str,
                                    text: result.legacy.full_text,
                                    createdAt: result.legacy.created_at,
                                    likes: result.legacy.favorite_count || 0,
                                    retweets: result.legacy.retweet_count || 0,
                                    authorId: result.core?.user_results?.result?.legacy?.screen_name || 'unknown',
                                    raw: result // Keep raw for debugging if needed
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[TwitterService] Error parsing timeline:', e);
        }
        return tweets;
    }

    async getRecentTweetsFromUser(userId: string) {
        // TODO: Implement using /base/apitools/userTimeline
        console.log('getRecentTweetsFromUser not implemented for 3rd party yet.');
        return [];
    }
}
