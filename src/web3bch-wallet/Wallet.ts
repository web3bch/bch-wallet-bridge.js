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
import INetworkProvider from "../web3bch-providers/INetworkProvider"
import ProviderType from "./entities/ProviderType"
import { findNetwork } from "./networks"

export default class Wallet implements IWallet {
  private defaultDAppId?: string

  constructor(readonly providers: Providers) {}

  public getAddress(
    changeType: ChangeType,
    index?: number,
    dAppId?: string
  ): Promise<string> {
    return this.getAddresses(changeType, index, 1, dAppId)
      .then((addresses) => {
        return addresses[0]
      })
      .catch((e) => { throw new ProviderException(e) })
  }

  public getAddressIndex(
    changeType: ChangeType,
    dAppId?: string
  ): Promise<number> {
    const walletProvider = this.checkWalletProvider()
    return walletProvider.getAddressIndex(changeType, dAppId || this.defaultDAppId)
      .catch((e) => { throw new ProviderException(e) })
  }

  public getAddresses(
    changeType: ChangeType,
    startIndex?: number,
    size?: number,
    dAppId?: string
  ): Promise<string[]> {
    if (startIndex) {
      if (startIndex < 0 || startIndex > 2147483647) {
        throw new IllegalArgumentException("startIndex must be >= 0 and <= 2147483647")
      } else if (!Number.isInteger(startIndex)) {
        throw new IllegalArgumentException("startIndex must be integer.")
      }
    }

    if (size) {
      if (size < 1 || size > 2147483648) {
        throw new IllegalArgumentException("size must be >= 1 and <= 2147483648")
      } else if (!Number.isInteger(size)) {
        throw new IllegalArgumentException("size must be integer.")
      }
    }

    const walletProvider = this.checkWalletProvider()
    return walletProvider.getAddresses(changeType, size || 1, startIndex, dAppId || this.defaultDAppId)
      .then((it) => {
        if (!it || it.length === 0) {
          throw new ProviderException("The return value is invalid.")
        }
        return it
      })
      .catch((e) => { throw new ProviderException(e) })
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

  public async addRedeemScript(
    redeemScript: string,
    dAppId: string
  ): Promise<void> {
    if (redeemScript.length < 1) {
      throw new IllegalArgumentException("The redeemScript cannot be empty.")
    }

    const walletProvider = this.checkWalletProvider()
    const result = await walletProvider.addRedeemScript(redeemScript, dAppId || this.defaultDAppId)
      .catch((e) => { throw new ProviderException(e) })

    if (typeof result !== "undefined") {
      throw new ProviderException("The provider returns illegal value.")
    }
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

  public async getProtocolVersion(providerType: ProviderType): Promise<number> {
    const version = await (() => {
      switch (providerType) {
        case ProviderType.NETWORK:
          const networkProvider = this.checkNetworkProvider()
          return networkProvider.getProtocolVersion()
        case ProviderType.WALLET:
          const walletProvider = this.checkWalletProvider()
          return walletProvider.getProtocolVersion()
      }
    })().catch((e) => { throw new ProviderException(e) })

    if (typeof version !== "number") {
      throw new ProviderException(`${providerType} provides invalid type.`)
    }
    return version
  }

  public async getNetwork(providerType: ProviderType): Promise<Network> {
    const networkProvider = this.checkNetworkProvider()
    const walletProvider = this.checkWalletProvider()

    const magic = await (() => {
      switch (providerType) {
        case ProviderType.NETWORK:
          return networkProvider.getNetworkMagic()
        case ProviderType.WALLET:
          return walletProvider.getNetworkMagic()
      }
    })()

    return findNetwork(magic)
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
