import IWalletProvider from "providers/src/IWalletProvider";
import INetworkProvider from "providers/src/INetworkProvider";
export default class Providers {
    networkProvider?: INetworkProvider | undefined;
    walletProvider?: IWalletProvider | undefined;
    constructor(networkProvider?: INetworkProvider | undefined, walletProvider?: IWalletProvider | undefined);
}
