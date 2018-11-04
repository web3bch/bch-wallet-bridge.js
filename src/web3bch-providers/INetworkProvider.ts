export default interface INetworkProvider {
  getVersion(): Promise<number>

  getProtocolVersion(): Promise<number>

  getNetworkMagic(): Promise<number>

  broadcastRawTx(
    rawTx: string
  ): Promise<string>
}
