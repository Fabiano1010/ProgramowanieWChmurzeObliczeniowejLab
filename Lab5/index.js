const express = require('express');
const os = require('os');

const app = express();
const PORT = 8080;

const VERSION = process.env.APP_VERSION || 'unknown';

app.get('/', (req, res) => {
  const ipAddresses = Object.values(os.networkInterfaces())
    .flat()
    .filter(details => details.family === 'IPv4' && !details.internal)
    .map(details => details.address);
  
  const hostname = os.hostname();
  
  res.json({
    server_ip: ipAddresses[0],
    hostname: hostname,
    version: VERSION
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Version: ${VERSION}`);
});