export default interface INetworkProvider {
  /**
   * Returns the current web3bch version.
   * @example
   * const version = await provider.getVersion()
   * console.log(version)
   * > "0.0.1"
   * @returns The current web3bch version
   */
  getVersion(): Promise<string>

  /**
   * Returns the bitcoin protocol version.
   * @example
   * const version = await provider.getProtocolVersion()
   * console.log(version)
   * > 70015
   * @returns The protocol version.
   */
  getProtocolVersion(): Promise<number>

  /**
   * Returns the current network.
   * @example
   * const network = await provider.getNetwork()
   * console.log(network)
   * > 3823236072
   * @returns Network magic bytes
   */
  getNetworkMagic(): Promise<number>

  /**
   * Broadcast a signed transaction.
   * @example
   * const txId = await provider.broadcastRawtx(
   *   "01000000013ba3ed..."
   * )
   * console.log(txId)
   * > "d86c34adaeae19171fd98fe0ffd89bfb92a1e6f0339f5e4f18d837715fd25758"
   * @param rawTx Signed transaction data in hex format.
   * @returns Hex format of txid.
   */
  broadcastRawTx(
    rawTx: string
  ): Promise<string>
}
