import IWeb3bchProvider from "../web3bch-provider"

export type ChangeType = "receive" | "change"

export default class Wallet {
  constructor(
    readonly provider: IWeb3bchProvider
  ) {}

  /**
   * Returns the current wallet address.
   * @example
   * const address = await web3bch.wallet.getAddress(
   *   "receive",
   *   3,
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(address)
   * > "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"
   * @param changeType The BIP44 change path type.
   * @param index The BIP44 address_index path.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The current wallet address.
   */
  public getAddress = (changeType: ChangeType, index?: number, dAppId?: string): Promise<string> => {
    return Promise.resolve("")
  }
}
