
import * as fs from 'fs';
import * as path from 'path';

function _read(_path: string) {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../contexts', _path),
      {encoding: 'utf8'}));
}

const contexts = new Map([
  ['https://veramo.io/contexts/socialmedia/v1', _read('socialmedia-v1.jsonld')],
  ['https://veramo.io/contexts/kyc/v1', _read('kyc-v1.jsonld')],
  ['https://veramo.io/contexts/profile/v1', _read('profile-v1.jsonld')],
  ['https://www.w3.org/ns/did/v1', _read('security_context_v1.jsonld')],
  ['https://w3id.org/did/v0.11', _read('did_v0.11.jsonld')],
  ['https://ns.did.ai/transmute/v1', _read('transmute_v1.jsonld')],
  ['https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld', _read('lds-ecdsa-secp256k1-recovery2020-0.0.jsonld')]
]);

export default contexts;
