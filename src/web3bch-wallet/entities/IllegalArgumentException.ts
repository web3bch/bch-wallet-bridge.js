export default class IllegalArgumentException implements Error {
  public name = "IllegalArgumentException"

  constructor(public message: string) {}
}
