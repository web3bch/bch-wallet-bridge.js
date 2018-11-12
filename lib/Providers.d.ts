import IWalletProvider from "./web3bch-providers/IWalletProvider";
import INetworkProvider from "./web3bch-providers/INetworkProvider";
export default class Providers {
    networkProvider?: INetworkProvider | undefined;
    walletProvider?: IWalletProvider | undefined;
    constructor(networkProvider?: INetworkProvider | undefined, walletProvider?: IWalletProvider | undefined);
}
