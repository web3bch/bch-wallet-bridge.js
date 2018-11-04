export type NetworkType = "Mainnet" | "Testnet3" | "Regnet"

export default class Network {
  /**
   * Network magic bytes
   */
  public magic: string

  /**
   * Network name
   */
  public name: NetworkType

  constructor(magic: string, name: NetworkType) {
    this.magic = magic
    this.name = name
  }
}
