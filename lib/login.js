const open = require('open');
const createServer = require('./server');

async function loginWithLocalhost(options) {
  return new Promise((resolve, reject) => {
    let server;
    const onSuccess = (data) => {
      server.close();
      resolve(data);
    }
    const onError = (err) => {
      server.close();
      reject(err);
    }

    server = createServer(options, onSuccess, onError);

    server.listen(process.env.PORT || 9000, () => {
      console.log("Visit this URL on this device to log in:");
      console.log(options.authUrl);
      console.log("Waiting for authentication...");
      open(options.authUrl);
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  loginWithLocalhost
}
