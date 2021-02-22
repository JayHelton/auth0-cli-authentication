### Example of using Auth0 to use the Authorization Code with PKCE to authenticate a user in a CLI

### Work in Progress, Unofficial, Its not a production ready flow

```
yarn

CLIENT_ID="<AUTH0_CLIENT_ID>" DOMAIN="<AUTH0_DOMAIN>" node index.js mycli login

```


### But why?
Well, I thought the way Google's Firebase CLI handle login was pretty cool.
https://firebase.google.com/docs/cli#sign-in-test-cli

### How does it work?
When you use the command to login, an ephermal http server is created. The cli then opens the browsers and directs the user the /authorize endpoint for the authorization server. Once you authenticate on the authorization server, the browser is redirected back to the ephermeral server on localhost. 

Since the server only exists for this small interaction on the front channel,it quickly exchanges the authorization code and the code verifier for the access token and then kills the http server.

Then you can do whatever you want with the tokens, like store them in a dot file, or persist them to a local db. Up to you.
