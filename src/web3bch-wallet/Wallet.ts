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

export default class Wallet implements IWallet {
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
    return walletProvider.getAddresses(changeType, 1, index, dAppId)
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

  public bloadcastRawtx(
    rawtx: string
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public getFeePerByte(): Promise<number> {
    const walletProvider = this.checkWalletProvider()
    return walletProvider.getFeePerByte()
      .catch((e) => { throw new ProviderException(e) })
  }

  public getDefaultDAppId(): Promise<string | undefined> {
    throw new Error("Method not implemented.")
  }

  public setDefaultDAppId(
    dAppId?: string
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }

  // TODO: TEMP
  public checkWalletProvider = (): IWalletProvider => {
    if (!this.providers.walletProvider) {
      throw new ProviderException("")
    }
    return this.providers.walletProvider
  }
}
