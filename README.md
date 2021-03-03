# Authorization Code with PKCE CLI Authentication

## ⚠️ Unofficial, Its not a production flow, Do not use! Check out the [Device Authorization Flow](https://auth0.com/docs/flows/device-authorization-flow) ⚠️

Install deps:
```bash
yarn
```
Run login command

```bash
CLIENT_ID="<AUTH0_CLIENT_ID>" DOMAIN="<AUTH0_DOMAIN>" node index.js mycli login
```

## But why?
Well, I thought the way Google's Firebase CLI handle login was pretty cool.
https://firebase.google.com/docs/cli#sign-in-test-cli

## How does it work?
When you use the command to login, an ephermal http server is created.

Then, the CLI opens the browsers and directs the user the /authorize endpoint for the authorization server. Once you authenticate on the authorization server, the browser is redirected back to the ephermeral server on localhost using the callback url parameter. 

Since the server only exists for this small interaction on the front channel, it quickly exchanges the authorization code and the code verifier for the access token and then kills the http server.

Then you can do whatever you want with the tokens, like store them in a dot file, or persist them to a local db.
