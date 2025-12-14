import { GrokService } from './services/grok.service';

async function main() {
    console.log('🧪 Testing Grok Integration (Data Ops)...');
    const grok = new GrokService();

    try {
        const digest = await grok.generateMorningDigest();
        console.log('\n--- GROK RESPONSE ---\n');
        console.log(JSON.stringify(digest, null, 2));
        console.log('\n---------------------\n');
    } catch (e: any) {
        console.error('Test Failed:', e.message);
    }
}

main();
