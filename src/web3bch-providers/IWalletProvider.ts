import ChangeType from "./entities/ChangeType"
import Utxo from "./entities/Utxo"
import Output from "./entities/Output"

export default interface IWalletProvider {
  getVersion(): Promise<number>

  getAddresses(
    changeType: ChangeType,
    size: number,
    startIndex?: number,
    dAppId?: string
  ): Promise<string[]>

  getAddressIndex(
    changeType: ChangeType,
    dAppId?: string
  ): Promise<number>

  getRedeemScripts(
    dAppId?: string
  ): Promise<string>

  addRedeemScript(
    redeemScript: string,
    dAppId?: string
  ): Promise<void>

  getSpendableUtxos(
    dAppId: string
  ): Promise<Utxo[]>

  getUnspendableUtxos(): Promise<Utxo[]>

  sign(
    address: string,
    dataToSign: string
  ): Promise<string>

  createSignedTx(
    outputs: Output[]
  ): Promise<string>

  getProtocolVersion(): Promise<number>

  getNetworkMagic(): Promise<number>

  getFeePerByte(): Promise<number>
}
