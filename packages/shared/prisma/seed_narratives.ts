
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Narratives...');

    await prisma.narrative.createMany({
        data: [
            {
                title: 'AI Agents trading memes',
                description: 'Autonomous AI agents like @truth_terminal launching and trading their own coins.',
                score: 95,
                tags: ['AI', 'Utility'],
                mentions: 1240,
                status: 'active'
            },
            {
                title: 'Celebrity Coin Resurgence',
                description: 'A new wave of musicians launching tokens on Solana. High risk/rug potential.',
                score: 65,
                tags: ['Celeb', 'Solana'],
                mentions: 850,
                status: 'active'
            },
            {
                title: 'Cat w/ Hat derivatives',
                description: 'Spike in "animal with accessory" tokens following WIF success.',
                score: 45,
                tags: ['Meme', 'Copycat'],
                mentions: 320,
                status: 'active'
            }
        ]
    });

    console.log('✅ Narratives seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
