declare module "bitcoincashjs" {
  const Address: Address
  const crypto: Crypto
}

interface Address {
  fromScriptHash(hash: Buffer): Address
}

interface Crypto {
  Hash: Hash
}

interface Hash {
  sha256ripemd160(buf: Buffer): Buffer
}