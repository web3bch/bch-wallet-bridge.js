import Wallet from "../src/web3bch-wallet/Wallet"
import IWallet from "../src/web3bch-wallet/IWallet"
import ChangeType from "../src/web3bch-providers/entities/ChangeType"
import Providers from "../src/web3bch/Providers"
import INetworkProvider from "../src/web3bch-providers/INetworkProvider"
import IWalletProvider from "../src/web3bch-providers/IWalletProvider"
import IllegalArgumentException from "../src/web3bch-wallet/entities/IllegalArgumentException"
import ProviderException from "../src/web3bch-wallet/entities/ProviderException"
import Network from "../src/web3bch-wallet/entities/Network"

describe("Wallet", () => {
  let wallet: IWallet
  let walletProvider: IWalletProvider
  let networkProvider: INetworkProvider

  describe("getAddress()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>())()
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
    it("should throws ProviderException if the wallet provider provides invalid empty value.", async () => {
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

  describe("getNetwork()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetwork: jest.fn(() => Promise.resolve(
          new Network("e3e1f3e8", "Mainnet")
        ))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getNetwork()
    })
    it("should calls IWalletProvider#getNetworkMagic", async () => {
      await wallet.getNetwork()
      expect(walletProvider.getNetworkMagic).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = new Network("e3e1f3e8", "Mainnet")
      const actual = await wallet.getNetwork()
      expect(actual).toBe(expected)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetwork: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getNetwork()).rejects.toThrow(ProviderException)
    })
  })

  //
  // broadcastRawTx
  //

  describe("broadcastRawTx()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn((rawtx) => Promise.resolve("txid"))
      })))()
      const providers = new Providers(networkProvider, undefined)
      wallet = new Wallet(providers)
    })

    it("should throw an error with invalid hex.", async () => {
      await expect(wallet.broadcastRawTx("hex")).rejects.toThrow(IllegalArgumentException)
    })
    it("should calls INetworkProvider#broadcastRawtx", async () => {
      await wallet.broadcastRawTx("1234567890")
      expect(networkProvider.broadcastRawTx).toBeCalled()
    })
  })

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

  describe("get/setDefaultDAppId()", () => {
    beforeEach(() => {
      const providers = new Providers()
      wallet = new Wallet(providers)
    })

    it("The initial value of defaultDAppId should be undefined.", async () => {
      const actual = await wallet.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })

    it("should throw an error with invalid DAppId.", async () => {
      await expect(wallet.setDefaultDAppId("dappid")).rejects.toThrow(IllegalArgumentException)
      const actual = await wallet.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })

    it("should set defaultDAppId properly.", async () => {
      const dappId = "fa3c13e9283cff80edeea53958e5ad1b9d8942385408c1b3d2f3c67a06a92835"
      await wallet.setDefaultDAppId(dappId)
      const actual = await wallet.getDefaultDAppId()
      expect(actual).toBe(dappId)
    })

    it("should set defaultDAppId as undefined properly.", async () => {
      await wallet.setDefaultDAppId(undefined)
      const actual = await wallet.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })
  })
})
