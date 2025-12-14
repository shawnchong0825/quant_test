
import { PrismaClient } from '@prisma/client';
import { GrokService } from '../services/grok.service';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Refreshing Narratives from LIVE Intel...');
    const grok = new GrokService();

    try {
        // 1. Fetch Fresh Intel
        console.log('📡 Calling Grok/Twitter Service...');
        const digest = await grok.generateMorningDigest();

        if (!digest || !digest.narratives || !Array.isArray(digest.narratives)) {
            throw new Error('Invalid format returned from Grok');
        }

        console.log(`✅ Received ${digest.narratives.length} narratives.`);

        // 2. Clear old "Hot" narratives (or archive them)
        // For now, we delete active ones to ensure the dashboard shows fresh data only.
        console.log('🧹 Clearing old active narratives...');
        await prisma.narrative.deleteMany({
            where: { status: 'active' }
        });

        // 3. Insert new data
        console.log('📝 Saving new narratives...');
        for (const n of digest.narratives) {
            await prisma.narrative.create({
                data: {
                    title: n.title,
                    description: n.desc || n.description || '',
                    score: n.score || 50, // Default if missing
                    tags: [], // Could extract from title
                    mentions: Math.floor(Math.random() * 500) + 100, // Mock mentions for now as Grok doesn't return count per narrative
                    status: 'active'
                }
            });
        }

        console.log('🚀 Success! Dashboard updated.');

    } catch (e: any) {
        console.error('❌ Failed to refresh narratives:', e.message);
        if (e.response) console.error(e.response.data);
    } finally {
        await prisma.$disconnect();
    }
}

main();
