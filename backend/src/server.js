const server = require('./app');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 TaskPilot Backend running on http://localhost:${PORT}`);
  console.log('✅ Using plain Node.js (no Express)');
});