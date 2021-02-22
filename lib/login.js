const http = require('http');
const open = require('open');
const url = require('url');
const fs = require('fs');
const path = require('path');
const util = require('util');

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
  authUrl,
  verifier,
  state,
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

      // try {
      //   // TODO fetch token using authorization code and code challenge
      //   await respondWithFile(req, res, 200, "../templates/success.html");
      //   resolve(tokens);
      // } catch (err) {
      //   await respondWithFile(req, res, 400, "../templates/loginFailure.html");
      //   reject(err);
      // }
      server.close();
      return;
    });

    server.listen(9000, () => {
      console.log("Visit this URL on this device to log in:");
      console.log(authUrl.href);
      console.log("Waiting for authentication...");

      open(authUrl.href);
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  loginWithLocalhost
}
