const helpers = require('../lib/helpers');
const login = require('../lib/login');
const jwt_decode = require('jwt-decode');

module.exports = (program) =>
  program
    .command('login')
    .action(async () => {
      const domain = process.env.DOMAIN;
      const clientId = process.env.CLIENT_ID;

      const { verifier, challenge, state } = helpers.getOAuthParameters();
      const url = new URL(`${domain}/authorize`)

      url.searchParams.append('response_type', 'code');

      url.searchParams.append('client_id', clientId);
      url.searchParams.append('code_challenge', challenge);
      url.searchParams.append('state', state);

      url.searchParams.append('code_challenge_method', 'S256');
      url.searchParams.append('redirect_uri', 'http://localhost:9000');
      url.searchParams.append('scope', 'openid profile');
      url.searchParams.append('prompt', 'login');

      try {
        const result = await login.loginWithLocalhost({
          authUrl: url.href, verifier, state, domain, clientId
        });

        console.log({
          accessToken: result.access_token,
          user: jwt_decode(result.id_token),
        });
        
      } catch (e) {
        console.log(e)
      }
    });
