const crypto = require('crypto');

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

function getChallengeAndVerifier() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  return {
    verifier,
    challenge,
  }
}

module.exports = {
  getChallengeAndVerifier,
  base64URLEncode,
  sha256,
  loginWithLocalhost: require('./login').loginWithLocalhost
}
