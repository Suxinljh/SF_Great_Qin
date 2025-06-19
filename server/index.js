// 后端入口文件，提供摄像头列表、WebSocket 评论、埋点等接口
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// 摄像头列表接口
app.get('/api/cameras', (req, res) => {
  res.json([
    { id: 1, name: '东区农田', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 2, name: '西区果园', url: 'https://test-streams.mux.dev/test_001/stream.m3u8' }
  ]);
});

// WebSocket 评论区
let comments = [];
wss.on('connection', ws => {
  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.type === 'comment') {
      // 防刷屏逻辑可在此实现
      comments.push({ user: data.user, text: data.text, time: Date.now() });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'comment', user: data.user, text: data.text, time: Date.now() }));
        }
      });
    }
  });
});

// 埋点接口
app.post('/api/track', (req, res) => {
  // 这里可以将埋点数据存储到数据库或日志
  res.json({ status: 'ok' });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
