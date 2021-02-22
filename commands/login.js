const crypto = require('crypto');
const lib = require('../lib');

module.exports = (program) =>
  program
    .command('login')
    .action(async () => {
      const domain = process.env.DOMAIN;
      const clientId = process.env.CLIENT_ID;

      const { verifier, challenge } = lib.getChallengeAndVerifier();
      const state = lib.base64URLEncode(crypto.randomBytes(32));
      const url = new URL(`${domain}/authorize`);

      url.searchParams.append('client_id', clientId);
      url.searchParams.append('response_type', 'code');
      url.searchParams.append('code_challenge', challenge);
      url.searchParams.append('code_challenge_method', 'S256');
      url.searchParams.append('redirect_uri', 'http://localhost:9000');
      url.searchParams.append('scope', 'openid profile');
      url.searchParams.append('state', state);
      url.searchParams.append('prompt', 'login');

      try {
        const result = await lib.loginWithLocalhost({
          authUrl: url.href, verifier, state, domain, clientId
        });

        console.log(result);
      } catch (e) {
        console.log(e)
      }
    });
