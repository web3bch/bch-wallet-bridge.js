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
  // getRedeemScript
  //
  describe("getRedeemScript()", () => {
    beforeEach(() => {
      const networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getRedeemScript("bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg")
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScript("bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should throws IllegalArgumentException if the address is invalid", () => {
      expect(() => wallet.getRedeemScript("I am not Address")).toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the address is P2PKHAdress.", () => {
      expect(() => wallet.getRedeemScript("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"))
      .toThrow(IllegalArgumentException)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve([]))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg"))
      .rejects.toThrow(ProviderException)
    })
  })

  //
  // getRedeemScripts
  //
  describe("getRedeemScripts()", () => {
    beforeEach(() => {
      const networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getRedeemScripts()
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScripts()
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
  })

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

  //
  // getDefaultDAppId
  //

  //
  // setDefaultDAppId
  //
})
