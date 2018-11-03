export default interface INetwork {
  /**
   * Network magic bytes
   */
  magic: string

  /**
   * Network name
   */
  name: "Mainnet" | "Testnet3" | "Regnet"
}
