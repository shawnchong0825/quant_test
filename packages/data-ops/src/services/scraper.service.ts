import puppeteer, { Browser, Page } from 'puppeteer';

export class TwitterScraperService {
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor() {
        //
    }

    async init() {
        console.log('[Scraper] Launching Headless Browser...');
        this.browser = await puppeteer.launch({
            headless: true, // Use boolean
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1280, height: 800 });
    }

    async login() {
        if (!this.page) await this.init();

        const username = process.env.TWITTER_USERNAME;
        const password = process.env.TWITTER_PASSWORD;

        if (!username || !password) {
            throw new Error('Missing Scraper Credentials');
        }

        try {
            console.log('[Scraper] Logging in...');
            await this.page!.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle2' });

            // Enter Username
            await this.page!.waitForSelector('input[autocomplete="username"]');
            await this.page!.type('input[autocomplete="username"]', username);
            await this.page!.keyboard.press('Enter');

            // Check for "Phone/Email" verification or Password immediately
            // This is brittle, simplistic logic for now.
            try {
                await this.page!.waitForSelector('input[name="password"]', { timeout: 5000 });
            } catch (e) {
                // Sometimes asks for phone/email verification if unusual activity
                console.warn('[Scraper] Password input not found immediately, checking for verification...');
                // For now, assume straightforward flow or throw
            }

            await this.page!.type('input[name="password"]', password);
            await this.page!.keyboard.press('Enter');

            await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('[Scraper] Login successful (assumed).');
        } catch (e: any) {
            console.error('[Scraper] Login failed:', e.message);
            // Capture screenshot for debug
            await this.page!.screenshot({ path: 'login_error.png' });
        }
    }

    async searchTweets(query: string) {
        if (!this.page) await this.login();

        console.log(`[Scraper] Searching for ${query}...`);
        const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
        await this.page!.goto(searchUrl, { waitUntil: 'networkidle2' });

        // Wait for tweets to load
        await this.page!.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });

        // Scrape Data
        const tweets = await this.page!.evaluate(() => {
            const articles = document.querySelectorAll('article[data-testid="tweet"]');
            return Array.from(articles).map((article: any) => { // Cast to any or HTMLElement
                const text = article.querySelector('div[data-testid="tweetText"]')?.textContent || '';
                const time = article.querySelector('time')?.getAttribute('datetime') || '';
                const author = article.querySelector('div[data-testid="User-Name"]')?.textContent || '';
                return { text, time, author };
            });
        });

        console.log(`[Scraper] Found ${tweets.length} tweets.`);
        return tweets;
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}
