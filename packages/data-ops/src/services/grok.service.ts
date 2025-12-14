
import axios from 'axios';
import dotenv from 'dotenv';
import { TwitterService } from './twitter.service';
dotenv.config();

/**
 * Service to interact with xAI's Grok API.
 * Uses the OpenAI-compatible endpoint.
 */
export class GrokService {
    private apiKey: string;
    private baseUrl = 'https://api.x.ai/v1';

    constructor() {
        this.apiKey = process.env.XAI_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ XAI_API_KEY is missing. Grok features will fail.');
        }
    }

    /**
     * Ask Grok a specific question or request a summary.
     * @param prompt User prompt or system instruction
     * @param system optional system context
     */
    async chat(prompt: string, system: string = 'You are an advanced crypto research agent named Meme Lord.') {
        try {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: 'grok-2-1212', // Updated to latest stable
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error('❌ Grok API Error:', error.response?.data || error.message);
            throw new Error('Failed to communicate with Grok');
        }
    }

    /**
     * Generate the "Morning Digest" specific to crypto sectors.
     */
    async generateMorningDigest(): Promise<any> {
        console.log('🔄 Gathering intel for Morning Digest...');
        const twitter = new TwitterService();

        // Parallel fetch of key sectors
        const [defiTweets, aiTweets, rwaTweets] = await Promise.all([
            twitter.searchTweets('DeFi news yield hack', 15).catch(() => []),
            twitter.searchTweets('crypto AI agents tech', 15).catch(() => []),
            twitter.searchTweets('RWA tokenization assets', 15).catch(() => [])
        ]);

        const formatTweets = (tweets: any[]) => tweets
            .sort((a, b) => b.likes - a.likes) // Sort by engagement
            .slice(0, 8) // Take top 8 per sector
            .map(t => `- @${t.authorId}: ${t.text.replace(/\n/g, ' ')}`).join('\n');

        const context = `
### RECENT DEFI INTEL:
${formatTweets(defiTweets)}

### RECENT AI AGENT INTEL:
${formatTweets(aiTweets)}

### RECENT RWA INTEL:
${formatTweets(rwaTweets)}
        `;

        const systemPrompt = `
You are an elite crypto intelligence analyst. Your job is to scour the extracted X.com data provided below and produce a "Morning Digest".
STRICTLY use the provided context to form your insights. If the context is empty, fall back to your general knowledge but mention it.

You MUST return a valid JSON object. Do not include markdown formatting.
Structure:
{
  "defi": ["bullet 1", "bullet 2"],
  "rwa": ["bullet 1"],
  "ai": ["bullet 1"],
  "narratives": [
     { "title": "Narrative Name", "desc": "Brief description", "score": 85 }
  ],
  "summary": "1-2 sentence overview of the market vibe based on the tweets."
}

CONTEXT FROM X.COM:
${context}
        `;

        const userPrompt = `
Good morning. Please generate today's crypto digest based on the gathered intel.
Summarize the most critical events.
        `;

        console.log('🧠 Asking Grok for Morning Digest (JSON) with RAG Context...');
        const raw = await this.chat(userPrompt, systemPrompt);

        // Clean up if model adds markdown blocks
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    }
}
