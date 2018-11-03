export default interface IOutput {
  /**
   * The hex format of lock script.
   */
  lockScript: string

  /**
   * The value transferred to the lock script in satoshi.
   */
  amount: string
}
