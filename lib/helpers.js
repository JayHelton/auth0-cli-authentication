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

function getOAuthParameters() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  const state = base64URLEncode(crypto.randomBytes(16));
  return {
    verifier,
    challenge,
    state,
  }
}


module.exports = {
  getOAuthParameters,
  base64URLEncode,
  sha256,
}
