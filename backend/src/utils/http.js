// Parse JSON body from request
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Set JSON response headers
function setJsonHeaders(res, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}

// Send JSON response
function sendJson(res, data, statusCode = 200) {
  setJsonHeaders(res, statusCode);
  res.end(JSON.stringify(data));
}

// Send error response
function sendError(res, error, statusCode = 500) {
  sendJson(res, { error: error.message || error }, statusCode);
}

// Handle CORS preflight
function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return true;
  }
  return false;
}

module.exports = {
  parseBody,
  setJsonHeaders,
  sendJson,
  sendError,
  handleCors
};
