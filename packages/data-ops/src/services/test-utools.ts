import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.TWITTER_BEARER_TOKEN;

async function test() {
    console.log('Testing UTools API with key:', KEY?.substring(0, 10) + '...');

    const BASE = 'https://twitter.good6.top/api';
    const PATH = '/base/apitools/search';

    // Retry loop
    for (let i = 0; i < 5; i++) {
        console.log(`\nAttempt ${i + 1}...`);
        try {
            // Query for something popular to ensure hits
            const query = 'words=Elon&product=Top&apiKey=' + KEY;
            const res = await axios.get(`${BASE}${PATH}?${query}`, { validateStatus: () => true });

            console.log('Status:', res.status);
            if (res.data && res.data.code === 0 && res.data.msg === 'success') {
                console.log('SUCCESS! Found data.');
                console.log(JSON.stringify(res.data).substring(0, 500));
                // Deep log
                const instructions = res.data?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions;
                if (instructions) {
                    console.log('Timeline Instructions found (Length):', instructions.length);
                    console.log(JSON.stringify(instructions, null, 2).substring(0, 4000));
                }
                break;
            } else {
                console.log('Failed/Empty:', JSON.stringify(res.data).substring(0, 200));
            }
            // Wait 2s
            await new Promise(r => setTimeout(r, 2000));

        } catch (e: any) {
            console.log('Error:', e.message);
        }
    }
}

test();
