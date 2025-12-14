
import { GrokService } from './services/grok.service';

async function main() {
    console.log('🧪 Testing Grok Integration...');
    const grok = new GrokService();

    try {
        const digest = await grok.generateMorningDigest();
        console.log('\n--- GROK RESPONSE ---\n');
        console.log(digest);
        console.log('\n---------------------\n');
    } catch (e: any) {
        console.error('Test Failed:', e.message);
    }
}

main();
