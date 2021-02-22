const crypto = require('crypto');
const helpers = require('../lib/helpers');
const login = require('../lib/login');

module.exports = (program) =>
  program
    .command('login')
    .action(async () => {
      const domain = process.env.DOMAIN;
      const clientId = process.env.CLIENT_ID;

      const { verifier, challenge } = helpers.getChallengeAndVerifier();
      const state = helpers.base64URLEncode(crypto.randomBytes(32));
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
        const result = await login.loginWithLocalhost({
          authUrl: url.href, verifier, state, domain, clientId
        });

        console.log('Now you can store the tokens somewhere safe and resilient, until they are expired', { result })
      } catch (e) {
        console.log(e)
      }
    });
