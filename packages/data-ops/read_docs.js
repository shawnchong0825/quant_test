
const fs = require('fs');

try {
    const raw = fs.readFileSync('docs.json');
    const data = JSON.parse(raw);
    const paths = Object.keys(data.paths);
    console.log('Total paths:', paths.length);

    const searches = paths.filter(p => p.toLowerCase().includes('search'));
    console.log('--- Search Paths ---');
    searches.forEach(p => {
        console.log(p);
        console.log(JSON.stringify(data.paths[p].get.parameters, null, 2));
    });

    const tweets = paths.filter(p => p.toLowerCase().includes('tweet') && !p.toLowerCase().includes('create') && !p.toLowerCase().includes('delete'));
    console.log('--- Tweet Paths (Read) ---');
    tweets.forEach(p => console.log(p));

} catch (e) {
    console.error(e);
}
