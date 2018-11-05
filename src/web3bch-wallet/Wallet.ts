import IWallet from "./IWallet"
import ChangeType from "../web3bch-providers/entities/ChangeType"
import Utxo from "../web3bch-providers/entities/Utxo"
import Network from "./entities/Network"
import Destination from "./entities/Destination"
import Output from "../web3bch-providers/entities/Output"
import Providers from "../web3bch/Providers"
import IWalletProvider from "../web3bch-providers/IWalletProvider"
import IllegalArgumentException from "./entities/IllegalArgumentException"
import ProviderException from "./entities/ProviderException"
import INetworkProvider from "../web3bch-providers/INetworkProvider";

export default class Wallet implements IWallet {
  private defaultDAppId?: string

  constructor(readonly providers: Providers) {}

  public getAddress(
    changeType: ChangeType,
    index?: number,
    dAppId?: string
  ): Promise<string> {
    if (index) {
      if (index < 0 || index > 2147483647) {
        throw new IllegalArgumentException("index must be >= 0 and <= 2147483647")
      } else if (!Number.isInteger(index)) {
        throw new IllegalArgumentException("index must be integer.")
      }
    }

    const walletProvider = this.checkWalletProvider()
    return walletProvider.getAddresses(changeType, 1, index, dAppId || this.defaultDAppId)
      .then((it) => it[0])
      .then((it) => {
        if (!it) {
          throw new ProviderException("The return value is invalid.")
        }
        return it
      })
      .catch((e) => { throw new ProviderException(e) })
  }

  public getAddressIndex(
    changeType: ChangeType,
    dAppId?: string
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }

  public getAddresses(
    changeType: ChangeType,
    startIndex?: number,
    size?: number,
    dAppId?: string
  ): Promise<string[]> {
    throw new Error("Method not implemented.")
  }

  public getRedeemScript(
    p2shAddress: string,
    dAppId?: string
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public getRedeemScripts(
    dAppId?: string
  ): Promise<string[]> {
    throw new Error("Method not implemented.")
  }

  public addRedeemScript(
    redeemScript: string,
    dAppId: string
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }

  public getUtxos(
    dAppId?: string
  ): Promise<Utxo[]> {
    throw new Error("Method not implemented.")
  }

  public getBalance(
    dAppId?: string
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }

  public sign(
    address: string,
    dataToSign: string
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public send(
    destination: Destination | Destination[],
    data: string | string[]
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public advancedSend(
    outputs: Output[],
    dAppId?: string
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public getProtocolVersion(): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public getNetwork(): Promise<Network> {
    throw new Error("Method not implemented.")
  }

  public broadcastRawTx(
    rawTx: string
  ): Promise<string> {
    return new Promise((resolve) => {
      const networkProvider = this.checkNetworkProvider()
      if (!this.isHex(rawTx)) {
        throw new IllegalArgumentException("The rawTx is not hex.")
      }
      resolve(networkProvider.broadcastRawTx(rawTx))
    })
  }

  public getFeePerByte(): Promise<number> {
    const walletProvider = this.checkWalletProvider()
    return walletProvider.getFeePerByte()
      .catch((e) => { throw new ProviderException(e) })
  }

  public getDefaultDAppId(): Promise<string | undefined> {
    return Promise.resolve(this.defaultDAppId)
  }

  public setDefaultDAppId(
    dAppId?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      if (dAppId && !this.isTxHash(dAppId)) {
        throw new IllegalArgumentException("The dAppId is invalid.")
      }
      this.defaultDAppId = dAppId
      resolve()
    })
  }

  private isHex(target: string): boolean {
    const re = /^[0-9A-Ffa-f]+$/g
    return re.test(target)
  }

  private isTxHash(target: string): boolean {
    const re = /[0-9A-Ffa-f]{64}/g
    return re.test(target)
  }

  // TODO: TEMP
  private checkWalletProvider = (): IWalletProvider => {
    if (!this.providers.walletProvider) {
      throw new ProviderException("")
    }
    return this.providers.walletProvider
  }

  // TODO: TEMP
  private checkNetworkProvider = (): INetworkProvider => {
    if (!this.providers.networkProvider) {
      throw new ProviderException("")
    }
    return this.providers.networkProvider
  }
}
