import IWalletProvider from "../web3bch-providers/IWalletProvider"
import INetworkProvider from "../web3bch-providers/INetworkProvider"

export default class Providers {
  public networkProvider?: INetworkProvider
  public walletProvider?: IWalletProvider
}
