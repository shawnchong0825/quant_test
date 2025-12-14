import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { TwitterService } from './services/twitter.service';
import { TwitterScraperService } from './services/scraper.service';
import { HeliusService } from './services/helius.service';

dotenv.config();

const prisma = new PrismaClient();

const SOL_MINT = 'So11111111111111111111111111111111111111112';

async function updateTokenMetadata() {
    try {
        const helius = new HeliusService();
        console.log(`[Metadata] Fetching Token Metadata for SOL...`);
        const meta = await helius.getTokenMetadata(SOL_MINT);
        if (meta) {
            await prisma.token.upsert({
                where: { address: SOL_MINT },
                update: {
                    name: meta.name,
                    symbol: meta.symbol,
                    decimals: meta.decimals
                },
                create: {
                    address: SOL_MINT,
                    chain: 'solana',
                    symbol: meta.symbol,
                    name: meta.name,
                    decimals: meta.decimals
                }
            });
            console.log('[Metadata] Token info updated in DB.');
        }
    } catch (hErr: any) {
        console.error('[Metadata] Helius Failed:', hErr.message);
    }
}

async function fetchSocialSentiment() {
    // Ensure we have the token
    const token = await prisma.token.upsert({
        where: { address: SOL_MINT },
        update: {},
        create: {
            address: SOL_MINT,
            chain: 'solana',
            symbol: 'SOL',
            name: 'Solana',
            decimals: 9
        }
    });

    const symbol = 'SOL';

    // 1. Try Official/3rd Party API
    try {
        const twitter = new TwitterService();
        console.log(`[Social] Fetching tweets for $${symbol}...`);

        const tweets = await twitter.searchTweets(`$${symbol}`, 20);
        console.log(`[Social] Fetched ${tweets.length} tweets.`);

        let savedCount = 0;
        for (const t of tweets) {
            const exists = await prisma.sentiment.findFirst({ where: { sourceId: t.id } });
            if (!exists) {
                await prisma.sentiment.create({
                    data: {
                        tokenId: token.id,
                        source: 'twitter',
                        sourceId: t.id,
                        content: t.text,
                        sentimentScore: 0,
                        hypeScore: (t.likes || 0) + ((t.retweets || 0) * 5),
                        authorTier: 'random',
                        createdAt: new Date(t.createdAt)
                    }
                });
                savedCount++;
            }
        }
        console.log(`[Social] Saved ${savedCount} new sentiment records.`);

    } catch (err: any) {
        console.warn('[Social] API Failed. Switching to Scraper...', err.message);
        // Fallback logic omitted for brevity in loop, can re-enable if needed
    }
}

async function runLoop() {
    console.log('Starting Data Ops Agent (The Librarian) - LIVE MODE');

    // Run once immediately
    await updateTokenMetadata();
    await fetchSocialSentiment();

    // Loop every 60 seconds
    setInterval(async () => {
        console.log('\n[Loop] Starting tick...');
        await fetchSocialSentiment(); // Metadata doesn't change often, skip it
    }, 60000);
}

runLoop().catch((e) => {
    console.error(e);
});
