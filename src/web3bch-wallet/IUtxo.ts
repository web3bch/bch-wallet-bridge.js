export default interface IUtxo {
  /**
   * Txid of the utxo
   */
  txid: string

  /**
   * Txout index number of the utxo
   */
  outputIndex: number

  /**
   * Address
   */
  address: string

  /**
   * ScriptPubKey
   */
  script: string

  /**
   * Satoshis
   */
  satoshis: number
}
