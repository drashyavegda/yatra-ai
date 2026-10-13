// Mock OpenAI-compatible server. /control?mode=ok|fail|garbage toggles behaviour.
const http = require('http');
let mode = 'ok';
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/control')) { mode = new URL(req.url, 'http://x').searchParams.get('mode'); res.end('mode=' + mode); return; }
  let body = ''; req.on('data', (c) => body += c); req.on('end', () => {
    if (!req.headers.authorization) { res.writeHead(401); res.end('{}'); return; }
    const payload = JSON.parse(body);
    const reqJson = JSON.parse(payload.messages[1].content);
    const days = reqJson.request.days;
    if (mode === 'fail') { res.writeHead(500, {'Content-Type':'application/json'}); res.end('{"error":"boom"}'); return; }
    let content;
    if (mode === 'garbage') content = 'Sure! Here is your trip: not json';
    else content = JSON.stringify({ summary: 'Mock AI summary', tips: ['Carry water'], days: Array.from({length: days}, (_, i) => ({ day: i+1, title: `Mock day ${i+1}`, destinationName: i % 2 ? 'Mysuru' : 'Hampi', travel: ['Mock travel leg'], activities: [{ title: 'Mock activity', detail: 'detail' }], reason: 'mock reason' })) });
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content } }] }));
  });
});
server.listen(9999, () => console.log('mock AI on 9999'));
