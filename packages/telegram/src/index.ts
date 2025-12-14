
import { Bot } from 'grammy';
import dotenv from 'dotenv';
import { prisma } from '@meme-lord/shared';
import { HeliusService, TwitterService, TwitterScraperService } from '@meme-lord/data-ops';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function main() {
    if (!BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN is missing in .env');
        process.exit(1);
    }

    const bot = new Bot(BOT_TOKEN);

    // Middleware: Logging
    bot.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`[Telegram] Processed update ${ctx.update.update_id} in ${ms}ms`);
    });

    // Command: /start
    bot.command('start', async (ctx) => {
        await ctx.reply('Welcome to Meme Lord AI Command Center! 🦍\n\nCommands:\n/status - Check system health\n/scan <ca> - Scan a token address');
    });

    // Command: /status
    bot.command('status', async (ctx) => {
        const tokenCount = await prisma.token.count();
        await ctx.reply(`System Online 🟢\n\nTracked Tokens: ${tokenCount}\nAgents: Active`);
    });

    // Command: /scan <ca>
    bot.command('scan', async (ctx) => {
        const ca = ctx.match;
        if (!ca) return ctx.reply('Usage: /scan <token_address>');

        await ctx.reply(`🔍 Scanning Token: ${ca}...`);

        try {
            // 1. Check On-Chain (Helius)
            const helius = new HeliusService();
            const meta = await helius.getTokenMetadata(ca);

            if (!meta) {
                return ctx.reply('❌ Token not found or invalid CA.');
            }

            let response = `🪙 *${meta.name} ($${meta.symbol})*\n`;
            response += `Supply: ${meta.supply}\n`;
            response += `Mutable: ${meta.mutable ? '⚠️ YES' : '✅ No'}\n`;
            response += `Burnt: ${meta.burnt ? '🔥 YES' : 'No'}\n\n`;

            await ctx.reply(response, { parse_mode: 'Markdown' });

            // 2. Check Socials (Twitter)
            await ctx.reply(`🐦 Checking Twitter Sentiment for $${meta.symbol}...`);

            const twitter = new TwitterService();
            let tweets: any[] = [];
            try {
                // Use default search
                tweets = await twitter.searchTweets(`$${meta.symbol}`, 10);
            } catch (e) {
                console.log('Twitter API failed, trying scraper...');
                try {
                    const scraper = new TwitterScraperService();
                    await scraper.init();
                    tweets = await scraper.searchTweets(`$${meta.symbol}`);
                    await scraper.close();
                } catch (sErr) {
                    console.log('Scraper failed too');
                }
            }

            if (tweets.length > 0) {
                // Escape markdown characters for Telegram
                const sample = tweets[0].text.substring(0, 100).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
                await ctx.reply(`Found ${tweets.length} recent tweets. Top hype:\n\n"${sample}..."`, { parse_mode: 'MarkdownV2' });
                // TODO: Save to DB
            } else {
                await ctx.reply('No recent tweets found.');
            }

        } catch (error: any) {
            console.error(error);
            await ctx.reply(`Analysis Failed: ${error.message}`);
        }
    });

    // Start the bot
    console.log('Starting Telegram Bot...');
    bot.start();
}

main().catch(console.error);
