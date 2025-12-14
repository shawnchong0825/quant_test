const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = `DATABASE_URL="postgresql://admin:password@localhost:5432/meme_lord_ai"
TWITTER_BEARER_TOKEN="REPLACE_WITH_YOUR_TOKEN"
XAI_API_KEY="REPLACE_WITH_YOUR_KEY"
`;

fs.writeFileSync(envPath, content, { encoding: 'utf8' });
console.log('✅ .env file fixed with UTF-8 encoding at:', envPath);
console.log('Content written:');
console.log(content);
