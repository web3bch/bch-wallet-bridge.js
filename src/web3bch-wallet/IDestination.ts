export default interface IDestination {
  /**
   * The destination address.
   */
  address: string

  /**
   * The value transferred to the destination address in satoshi.
   */
  amount: number
}
