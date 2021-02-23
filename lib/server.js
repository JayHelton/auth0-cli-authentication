const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const util = require('util');
const client = require('./client');

async function respondWithFile(
  req,
  res,
  statusCode,
  filename
) {
  const response = await util.promisify(fs.readFile)(path.join(__dirname, filename));
  res.writeHead(statusCode, {
    "Content-Length": response.length,
    "Content-Type": "text/html",
  });
  res.end(response);
  req.socket.destroy();
}

module.exports = (
  { clientId, state, verifier, domain },
  onSuccess,
  onFailure,
) => http.createServer(async (req, res) => {
  const query = url.parse(`${req.url}`, true).query || {};
  const queryState = query.state;
  const queryCode = query.code;

  if (queryState !== state) {
    await respondWithFile(req, res, 400, "../templates/failure.html");
    onFailure(new Error("Unexpected error while logging in"));
    return;
  };

  try {
    const resp = await client.post(`${domain}/oauth/token`, {
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'code_verifier': verifier,
      'code': queryCode,
      'redirect_uri': 'http://localhost:9000'
    });

    await respondWithFile(req, res, 200, "../templates/success.html");
    onSuccess(resp.data);
  } catch (err) {
    await respondWithFile(req, res, 400, "../templates/failure.html");
    onFailure(err);
  };
  return;
});
