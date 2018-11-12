import IWalletProvider from "providers/src/IWalletProvider"
import INetworkProvider from "providers/src/INetworkProvider"

export default class Providers {
  constructor(public networkProvider?: INetworkProvider, public walletProvider?: IWalletProvider) {}
}
