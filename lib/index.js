"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Providers_1 = require("./Providers");
const Wallet_1 = require("./web3bch-wallet/Wallet");
class Web3bch {
    constructor() {
        /**
         * The current providers set.
         */
        this.providers = new Providers_1.default();
        this.wallet = new Wallet_1.default(this.providers);
    }
}
exports.default = Web3bch;
