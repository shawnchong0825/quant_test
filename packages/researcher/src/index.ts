import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { TokenAnalyzerService } from './services/token-analyzer.service';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Meme Researcher Agent (The Hunter)...');
    // TODO: Initialize Narrative Engine

    // Test Token Analyzer (Helius)
    try {
        const analyzer = new TokenAnalyzerService();
        // Test with BONK Mint Address
        const bonkMint = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';
        console.log('[Main] Testing Token Analyzer on BONK...');

        const result = await analyzer.analyzeToken(bonkMint);
        console.log('[Main] Analysis Result:', JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('[Main] Token Analyzer Failed:', err);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
