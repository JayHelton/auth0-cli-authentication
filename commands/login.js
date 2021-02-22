const crypto = require('crypto');
const lib = require('../lib');

module.exports = (program) =>
  program
    .command('login')
    .action(async () => {
      const { verifier, challenge } = lib.getChallengeAndVerifier();
      const state = lib.base64URLEncode(crypto.randomBytes(32));
      const url = new URL(process.env.AUTH_URL);
      url.searchParams.append('client_id', process.env.CLIENT_ID);
      url.searchParams.append('response_type', 'code');
      url.searchParams.append('code_challenge', challenge);
      url.searchParams.append('code_challenge_method', 'S256');
      url.searchParams.append('redirect_uri', 'http://localhost:9000');
      url.searchParams.append('scope', 'openid profile');
      url.searchParams.append('state', state);
      url.searchParams.append('prompt', 'login');
      const result = await lib.loginWithLocalhost(url, verifier, state);
      console.log(result);
    });
