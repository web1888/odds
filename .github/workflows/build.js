import cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

// 要抓的比赛编号
const gameIds = ['2701808', '2701809'];

const dir = './api';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

for (const gid of gameIds) {
  try {
    const html = await fetch(`https://live.nowscore.com/odds/match/${gid}.htm`).then(r => r.text());
    const $ = cheerio.load(html);
    const t = $('tr[data-companyid="8"]').find('td');
    const data = {
      "1x2": { home: parseFloat(t.eq(2).text()), draw: parseFloat(t.eq(3).text()), away: parseFloat(t.eq(4).text()) },
      "ah":  { line: parseFloat(t.eq(7).text()), home: parseFloat(t.eq(8).text()), away: parseFloat(t.eq(9).text()) },
      "ou":  { line: parseFloat(t.eq(10).text()), over: parseFloat(t.eq(11).text()), under: parseFloat(t.eq(12).text()) }
    };
    fs.writeFileSync(`${dir}/${gid}.json`, JSON.stringify(data, null, 2));
  } catch (e) {
    fs.writeFileSync(`${dir}/${gid}.json`, JSON.stringify({ error: e.message }));
  }
}
