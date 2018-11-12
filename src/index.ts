import Providers from "./Providers"
import Wallet from "./web3bch-wallet/Wallet"

export default class Web3bch {
  /**
   * The current providers set.
   */
  public providers = new Providers()

  public wallet = new Wallet(this.providers)
}
