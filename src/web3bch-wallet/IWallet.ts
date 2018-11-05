import ChangeType from "../web3bch-providers/entities/ChangeType"
import Destination from "./entities/Destination"
import Network from "./entities/Network"
import Output from "../web3bch-providers/entities/Output"
import Utxo from "../web3bch-providers/entities/Utxo"
import ProviderType from "./entities/ProviderType"

export default interface IWallet {
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
  getAddress(
    changeType: ChangeType,
    index?: number,
    dAppId?: string
  ): Promise<string>

  /**
   * Returns the current wallet address index.
   * @example
   * const addrIdx = await web3bch.wallet.getAddressIndex(
   *   "change",
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(addrIdx)
   * > 3
   * @param changeType The BIP44 change path type.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The current wallet address index.
   */
  getAddressIndex(
    changeType: ChangeType,
    dAppId?: string
  ): Promise<number>

  /**
   * Returns the wallet address list.
   * @example
   * const addresses = await web3bch.wallet.getAddresses(
   *   "receive",
   *   3,
   *   2,
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(addresses)
   * > ["bitcoincash:qrsy0xwugcajsqa...", "bitcoincash:qrsfpepw3egqq4k..."]
   * @param changeType The BIP44 change path type.
   * @param startIndex The BIP44 address_index path.
   * @param size The address amount you want.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The wallet address list.
   */
  getAddresses(
    changeType: ChangeType,
    startIndex?: number,
    size?: number,
    dAppId?: string
  ): Promise<string[]>

  /**
   * Returns the stored redeem script.
   * @example
   * const redeemScript = await web3bch.wallet.getRedeemScript(
   *   "bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg",
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(redeemScript)
   * > "03424f587e06424954424f5887"
   * @param p2shAddress The P2SH Address.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The stored redeem script.
   */
  getRedeemScript(
    p2shAddress: string,
    dAppId?: string
  ): Promise<string>

  /**
   * Returns the stored redeem scripts belong to the DApp ID.
   * @example
   * const redeemScripts = await web3bch.wallet.getRedeemScript(
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(redeemScript)
   * > ["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The stored redeem script list.
   */
  getRedeemScripts(
    dAppId?: string
  ): Promise<string[]>

  /**
   * Add the redeem script into the wallet.
   * @example
   * await web3bch.wallet.addRedeemScript(
   *   "03424f587e064249..."
   * )
   * @param redeemScript The redeem script you want to add.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   */
  addRedeemScript(
    redeemScript: string,
    dAppId?: string
  ): Promise<void>

  /**
   * Returns the unspent transaction outputs.
   * @example
   * const utxos = await web3bch.wallet.getUtxos(
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(utxos)
   * > [
   *     {
   *       'txId' : '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
   *       'outputIndex' : 0,
   *       'address' : 'bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p',
   *       'script' : '76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac',
   *       'satoshis' : 50000
   *     }
   *   ]
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The unspent transaction output object list.
   */
  getUtxos(
    dAppId?: string
  ): Promise<Utxo[]>

  /**
   * Returns the balance of the addresses.
   * @example
   * const balance = await web3bch.wallet.getBalance(
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(balance)
   * > 500000
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns The current balance for the addresses in satoshi.
   */
  getBalance(
    dAppId?: string
  ): Promise<number>

  /**
   * Signs data from a specific account. This account needs to be unlocked.
   * @example
   * const result = await web3bch.wallet.sign(
   *   "bchtest:qq28xgrzkdyeg5vf7tp2s3mvx8u95zes5cf7wpwgux",
   *   "af4c61ddcc5e8a2d..." // second argument is SHA1("hello")
   * )
   * console.log(result)
   * > "30440220227e0973..."
   * @param address Address to sign with.
   * @param dataToSign Data to sign in hex format.
   * @returns The signed data. Bitcoin signatures are serialised in the DER format over the wire.
   */
  sign(
    address: string,
    dataToSign: string
  ): Promise<string>

  /**
   * Create a transaction with specified destination or destinations and send it to the network.
   * The provider will add a change output to the change address.
   * @example
   * const txid = await web3bch.wallet.send(
   *   {
   *     address: "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3"
   *     amount: 2849119
   *   }
   * )
   * console.log(txid)
   * > "9591fdf10b16d4de6f65bcc49aadadc21d7a3a9169a13815e59011b426fe494f"
   * @param destination The destination object.
   * @param data A data or a list of data to put to the transaction’s OP_RETURN output.
   * @returns Hex format of txid.
   */
  send(
    destination: Destination | Destination[],
    data: string | string[]
  ): Promise<string>

  /**
   * Create a transaction with specified outputs and send it to the network.
   * The provider will not add any outputs. The ordering of outputs remains as is.
   * @example
   * const txid = await web3bch.wallet.advancedSend([
   *   {
   *     lockScript: "76a91467b2e55ada06c869547e93288a4cf7377211f1f088ac",
   *     amount: 10000
   *   }
   * ])
   * console.log(txid)
   * > "9591fdf10b16d4de6f65bcc49aadadc21d7a3a9169a13815e59011b426fe494f"
   * @param outputs The Array of TransactionOutput objects.
   * @param dAppId The DApp ID. If no dAppId is set the default DApp ID will be set.
   * @returns Hex format of txid.
   */
  advancedSend(
    outputs: Output[],
    dAppId?: string
  ): Promise<string>

  /**
   * Returns the bitcoin protocol version.
   * @example
   * const version = await web3bch.wallet.getProtocolVersion(NetworkType.Network)
   * console.log(version)
   * > 70015
   * @param providerType The provider name which you want to check the network type from
   * @returns The protocol version. The value is Int32.
   */
  getProtocolVersion(providerType: ProviderType): Promise<number>

  /**
   * Returns the current network.
   * @example
   * const network = await web3bch.wallet.getNetwork(NetworkType.Network)
   * console.log(network)
   * > {
   *     magicBytes: "e3e1f3e8",
   *     name: "Mainnet"
   *   }
   * @param providerType The provider name which you want to check the network type from
   * @returns The network object.
   */
  getNetwork(providerType: ProviderType): Promise<Network>

  /**
   * Broadcast an already signed transaction.
   * @example
   * const txId = await web3bch.wallet.broadcastRawtx(
   *   "01000000013ba3ed..."
   * )
   * console.log(txId)
   * > "d86c34adaeae19171fd98fe0ffd89bfb92a1e6f0339f5e4f18d837715fd25758"
   * @param Signed transaction data in hex format.
   * @returns Hex format of txid.
   */
  broadcastRawTx(
    rawtx: string
  ): Promise<string>

  /**
   * Returns the transaction fee per byte.
   * @example
   * const fee = await web3bch.wallet.getFeePerByte()
   * console.log(fee)
   * > 1
   * @returns Transaction fee per byte in satoshi.
   */
  getFeePerByte(): Promise<number>

  /**
   * Returns the default DApp ID the provider uses.
   * The default value is undefined.
   * @example
   * const dAppId = await web3bch.wallet.defaultDAppId()
   * console.log(dAppId)
   * > "53212266f7994100..."
   * @returns The DApp ID
   */
  getDefaultDAppId(): Promise<string | undefined>

  /**
   * Changes the default DApp ID for the provider.
   * @example
   * const result = await web3bch.wallet.setDefaultDAppId("53212266f7994100...")
   * console.log(result)
   * > true
   * @param The DApp ID.
   */
  setDefaultDAppId(
    dAppId?: string
  ): Promise<void>
}
