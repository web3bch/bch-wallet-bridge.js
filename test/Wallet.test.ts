import Wallet from "../src/web3bch-wallet/Wallet"
import IWallet from "../src/web3bch-wallet/IWallet"
import ChangeType from "../src/web3bch-providers/entities/ChangeType"
import Providers from "../src/web3bch/Providers"
import INetworkProvider from "../src/web3bch-providers/INetworkProvider"
import IWalletProvider from "../src/web3bch-providers/IWalletProvider"
import IllegalArgumentException from "../src/web3bch-wallet/entities/IllegalArgumentException"
import ProviderException from "../src/web3bch-wallet/entities/ProviderException"

describe("Wallet", () => {
  let wallet: IWallet
  let walletProvider: IWalletProvider

  describe("getAddress()", () => {
    beforeEach(() => {
      const networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(["bitcoincash:foo", "bitcoincash:bar"]))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getAddress(ChangeType.RECEIVE)
    })
    it("should calls IWalletProvider#getAddresses", async () => {
      await wallet.getAddress(ChangeType.RECEIVE)
      expect(walletProvider.getAddresses).toBeCalled()
    })
    it("should throws IllegalArgumentException if the index is < 0.", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, -1)).toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the index is > 2147483647", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, 2147483648)).toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the index is not decimal.", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, 0.1)).toThrow(IllegalArgumentException)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve([]))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  //
  // getRedeenScript
  //

  //
  // getRedeemScripts
  //

  //
  // addRedeemScript
  //

  //
  // getUtxos
  //

  //
  // getBalance
  //

  //
  // sign
  //

  //
  // send
  //

  //
  // advancedSend
  //

  //
  // getProtocolVersion
  //

  //
  // getNetwork
  //

  //
  // broadcastRawTx
  //

  //
  // getFeePerByte
  //

  describe("getFeePerByte()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getFeePerByte: jest.fn(() => Promise.resolve(1))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getFeePerByte()
    })
    it("should calls IWalletProvider#getFeePerByte", async () => {
      await wallet.getFeePerByte()
      expect(walletProvider.getFeePerByte).toBeCalled()
    })
    it("should return 1.", async () => {
      const actual = await wallet.getFeePerByte()
      expect(actual).toBe(1)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getFeePerByte: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getFeePerByte()).rejects.toThrow(ProviderException)
    })
  })

  //
  // getDefaultDAppId
  //

  //
  // setDefaultDAppId
  //
})
