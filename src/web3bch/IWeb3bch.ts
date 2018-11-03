
import IWeb3bchProvider from "../web3bch-provider"

export default interface IWeb3bch {
  /**
   * The current web3bch provider version.
   * @example
   * const version = web3bch.version
   * console.log(version)
   * > "0.1.0"
   */
  version: string

  /**
   * The current provider set.
   */
  currentProvider: IWeb3bchProvider
}
