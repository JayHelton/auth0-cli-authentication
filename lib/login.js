const http = require('http');
const open = require('open');
const url = require('url');
const fs = require('fs');
const path = require('path');
const util = require('util');
const fetch = require('node-fetch');

async function fetchPost(url = '', data = {}) {
  console.log('sending:', data);
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

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

async function loginWithLocalhost(
  {
    domain,
    authUrl,
    verifier,
    state,
    clientId
  }
) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const query = url.parse(`${req.url}`, true).query || {};
      const queryState = query.state;
      const queryCode = query.code;

      if (queryState !== state) {
        await respondWithFile(req, res, 400, "../templates/failure.html");
        reject(new Error("Unexpected error while logging in"));
        server.close();
        return;
      }
      console.log('received:', { queryCode, queryState })

      try {
        const tokens = await fetchPost(`${domain}/oauth/token`, {
          'grant_type': 'authorization_code',
          'client_id': clientId,
          'code_verifier': verifier,
          'code': queryCode,
          'redirect_uri': 'http://localhost:9000'
        })
        await respondWithFile(req, res, 200, "../templates/success.html");
        resolve(tokens);
      } catch (err) {
        await respondWithFile(req, res, 400, "../templates/failure.html");
        reject(err);
      }
      server.close();
      return;
    });

    server.listen(9000, () => {
      console.log("Visit this URL on this device to log in:");
      console.log(authUrl);
      console.log("Waiting for authentication...");

      open(authUrl);
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  loginWithLocalhost
}
