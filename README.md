# web3bch.js - Bitcoin Cash JavaScript API
[![Build Status](https://travis-ci.org/web3bch/web3bch.js.svg?branch=master)](https://travis-ci.org/web3bch/web3bch.js)

## Installation
`yarn add web3bch`

## Usage
```ts
import Web3bch from "web3bch"
const injected = window.web3bch
if (!injected || !injected.currentProvider) {
  console.log("Web3bch provider doesn't injected!")
  return
}
const web3bch = new Web3bch(provider)
```

## What is DApp ID?
DApp ID is a unique identifiers for a single DApp, and it's a txid of Bitcoin transaction.
Each DApp writes its protocol specification in the tranasction's OP_RETURN output.

It is defined in [BDID-2](https://github.com/web3bch/BDIPs/blob/master/BDIPs/bdip-2.md).

## Documentation

Documentation can be found at [GitHub Pages][docs].

[docs]: https://web3bch.github.io/web3bch.js/

## Building
### Requirements
- Node.js
- npm
- yarn

### Build (Babel + Rollup)
1. `$ yarn`
2. `$ yarn build`