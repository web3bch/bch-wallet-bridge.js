import Wallet from "../src/web3bch-wallet/Wallet"
import IWallet from "../src/web3bch-wallet/IWallet"
import ChangeType from "../src/web3bch-providers/entities/ChangeType"
import Providers from "../src/web3bch/Providers"
import INetworkProvider from "../src/web3bch-providers/INetworkProvider"
import IWalletProvider from "../src/web3bch-providers/IWalletProvider"
import IllegalArgumentException from "../src/web3bch-wallet/entities/IllegalArgumentException"
import ProviderException from "../src/web3bch-wallet/entities/ProviderException"
import Network, { NetworkType } from "../src/web3bch-wallet/entities/Network"
import Utxo from "../src/web3bch-providers/entities/Utxo"
import ProviderType from "../src/web3bch-wallet/entities/ProviderType"
import Destination from "../src/web3bch-wallet/entities/Destination"
import Output from "../src/web3bch-providers/entities/Output"
import each from "jest-each"

describe("Wallet", () => {
  let wallet: IWallet
  let walletProvider: IWalletProvider
  let networkProvider: INetworkProvider

  describe("getAddress()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(["bitcoincash:foo", "bitcoincash:bar"]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it("should be success if there is no problem.", async () => {
      await wallet.getAddress(ChangeType.RECEIVE)
    })
    it("should call IWalletProvider#getAddresses", async () => {
      await wallet.getAddress(ChangeType.RECEIVE)
      expect(walletProvider.getAddresses).toBeCalled()
    })
    it("should throw IllegalArgumentException if the index is < 0.", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, -1)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if the index is > 2147483647", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, 2147483648)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if the index is not decimal.", () => {
      expect(() => wallet.getAddress(ChangeType.RECEIVE, 0.1)).toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a string array", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  describe("getAddressIndex()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.resolve(3))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it("should be success if there is no problem.", async () => {
      await wallet.getAddressIndex(ChangeType.RECEIVE)
    })
    it("should calls IWalletProvider#getAddressIndex", async () => {
      await wallet.getAddressIndex(ChangeType.CHANGE)
      expect(walletProvider.getAddressIndex).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getAddressIndex", async () => {
      const index = await wallet.getAddressIndex(ChangeType.CHANGE)
      expect(index).toBe(3)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddressIndex(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddressIndex(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  describe("getRedeemScript()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() =>
        Promise.resolve(["9c1657fb5142ca85ab2d27ea847f648ec172a012", "51519587"]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it("should be success if there is no problem.", async () => {
      await wallet.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should returns a script corresponding to the address", async () => {
      const script = await wallet.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
      expect(script).toBe("51519587")
    })
    it("should throws IllegalArgumentException if the address is invalid", async () => {
      await expect(wallet.getRedeemScript("I am not Address"))
        .rejects.toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the address is P2PKHAdress.", async () => {
      await expect(wallet.getRedeemScript("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"))
        .rejects.toThrow(IllegalArgumentException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array or an empty array"
    , async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScript: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(""))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("getRedeemScripts()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.getRedeemScripts()
    })
    it.skip("should call IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScripts()
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#getRedeemScripts", async () => {
      const sciprts = await wallet.getRedeemScripts()
      expect(sciprts).toBe(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"])
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array or an empty array",
     async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
  })

  describe("addRedeemScript()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve())
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
    })
    it.skip("should call IWalletProvider#addRedeemScript", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
      expect(walletProvider.addRedeemScript).toBeCalled()
    })
    it.skip("should throw IllegalArgumentException if the script is empty string.", () => {
      expect(() => wallet.addRedeemScript("")).toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider return anything", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
  })

  describe("getUtxos()", () => {
    const utxo = new Utxo("10a879077602483f7e89cae7202c95119fc9ce53db55f33c7efe401703aa7c38",
       2,
       "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3",
       "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
       50000)
    const utxo2 = new Utxo("115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
    0,
    "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p",
    "047c039059b17576a914f9a93ce9b7ebed298597655065a96c2e0846db1788ac",
    20000)
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo, utxo2])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve([utxo]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.getUtxos()
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
    })
    it.skip("should call IWalletProvider#getSpendableUtxos", async () => {
      await wallet.getUtxos()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it.skip("should call IWalletProvider#getUnspendableUtxos", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set.",
     async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo, utxo2])
    })
    it.skip("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo])
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos()).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos())
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("getBalance()", () => {
    const utxo = new Utxo("10a879077602483f7e89cae7202c95119fc9ce53db55f33c7efe401703aa7c38",
       2,
       "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3",
       "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
       50000)
    const utxo2 = new Utxo("115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
    0,
    "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p",
    "047c039059b17576a914f9a93ce9b7ebed298597655065a96c2e0846db1788ac",
    20000)

    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo, utxo2])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve([utxo]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it.skip("should be success if there is no problem.", async () => {
      await wallet.getBalance()
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
    })
    it.skip("should calls IWalletProvider#getSpendableUtxos", async () => {
      await wallet.getUtxos()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it.skip("should calls IWalletProvider#getUnspendableUtxos", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set.",
     async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe(70000)
    })
    it.skip("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe(20000)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getBalance()).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getBalance())
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if IWalletProvider#getUnspendableUtxos returns invalid value.",
     async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("sign()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve("II0XaiKCRsRROS6gIcRpwao74wc55ij\
        ZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E="))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it.skip("should be success if there is no problem.", async () => {
      await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
    })
    it.skip("should calls IWalletProvider#addRedeemScript", async () => {
      await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(walletProvider.sign).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#sign.", async () => {
      const signed = await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(signed).toBe("II0XaiKCRsRROS6gIcRpwao74wc55ijZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E=")
    })
    it.skip("should throws IllegalArgumentException if the address is invalid", () => {
      expect(() => wallet.sign("I'm an invalid address", "Hello web3bch")).toThrow(IllegalArgumentException)
    })
    it.skip("should throws IllegalArgumentException if the message is empty string.", () => {
      expect(() => wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", ""))
      .toThrow(IllegalArgumentException)
    })
    it.skip("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if the wallet provider return invalid signed data.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve("invalid signed data"))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a string value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  //
  // send
  //
  describe("send()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve("txid"))
      })))()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve("rawtx"))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })
    const destination = new Destination("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p", 100000)
    const destination2 = new Destination("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya", 300000)
    it.skip("should be success if there is no problem.", async () => {
      await wallet.send(destination)
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.send(destination, "Hello Bitcoin Cash")
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.send(destination, ["Hello", "Bitcoin", "Cash"])
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.send([destination, destination2])
    })
    it.skip("should calls IWalletProvider#createSignedTx", async () => {
      await wallet.send(destination)
      expect(walletProvider.createSignedTx).toBeCalled()
    })
    it.skip("should calls networkProvider#broadcastRawTx", async () => {
      await wallet.send(destination)
      expect(networkProvider.broadcastRawTx).toBeCalled()
    })
    it.skip("should return the same value as networkProvider#broadcastRawTx", async () => {
      const txid = wallet.send(destination)
      expect(txid).toBe("txid")
    })
    it.skip("should throw an error if the destination is an empty array.", async () => {
      await expect(wallet.send([])).rejects.toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider#createSignedTx does not return a string value",
     async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.send(destination)).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider#broadcastRawTx does not return a string value",
     async (providerReturn) => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.send(destination)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.send(destination)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.send(destination)).rejects.toThrow(ProviderException)
    })
  })

  //
  // advancedSend
  //
  describe("advancedSend()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve("txid"))
      })))()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve("rawtx"))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })
    const output = new Output("76a91467b2e55ada06c869547e93288a4cf7377211f1f088ac", 10000)
    const output2 = new Output("76a914d7e7c4e0b70eaa67ceff9d2823d1bbb9f6df9a5188ac", 30000)
    it.skip("should be success if there is no problem.", async () => {
      await wallet.advancedSend([output, output2])
    })
    it.skip("should calls IWalletProvider#createSignedTx", async () => {
      await wallet.advancedSend([output, output2])
      expect(walletProvider.createSignedTx).toBeCalled()
    })
    it.skip("should calls networkProvider#broadcastRawTx", async () => {
      await wallet.advancedSend([output, output2])
      expect(networkProvider.broadcastRawTx).toBeCalled()
    })
    it.skip("should return the same value as networkProvider#broadcastRawTx", async () => {
      const txid = wallet.advancedSend([output, output2])
      expect(txid).toBe("txid")
    })
    it.skip("should throw an error if the outputs is an empty array.", async () => {
      await expect(wallet.send([])).rejects.toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider#createSignedTx does not return a string value",
     async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.advancedSend([output, output2])).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider#broadcastRawTx does not return a string value",
     async (providerReturn) => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.advancedSend([output, output2])).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.advancedSend([output, output2])).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.advancedSend([output, output2])).rejects.toThrow(ProviderException)
    })
  })

  //
  // getProtocolVersion
  //
  describe("getProtocolVersion()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(70015))
      })))()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(70015))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })
    it.skip("should be success if there is no problem.", async () => {
      await wallet.getProtocolVersion()
    })
    it.skip("should call IWalletProvider#getProtocolVersion", async () => {
      await wallet.getProtocolVersion()
      expect(walletProvider.getProtocolVersion).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = 70015
      const actual = await wallet.getProtocolVersion(ProviderType.NETWORK)
      expect(actual).toBe(expected)
    })
    it("should throw ProviderException if the wallet provider returns a string.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve("700155"))
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.getProtocolVersion(ProviderType.WALLET)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(networkProvider, walletProvider))
      await expect(wallet.getProtocolVersion(ProviderType.WALLET)).rejects.toThrow(ProviderException)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
  })

  //
  // getNetwork
  //
  describe("getNetwork()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        getNetworkMagic: jest.fn(() => Promise.resolve(0xE3E1f3E8))
      })))()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetworkMagic: jest.fn(() => Promise.resolve(0xE3E1f3E8))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })
    it("should be success if there is no problem", async () => {
      await wallet.getNetwork(ProviderType.NETWORK)
      await wallet.getNetwork(ProviderType.WALLET)
    })
    it("should call INetworkProvider#getNetworkMagic if ProviderType is NETWORK.", async () => {
      await wallet.getNetwork(ProviderType.NETWORK)
      expect(networkProvider.getNetworkMagic).toBeCalled()
    })
    it("should call IWalletProvider#getNetworkMagic if ProviderType is WALLET.", async () => {
      await wallet.getNetwork(ProviderType.WALLET)
      expect(walletProvider.getNetworkMagic).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = new Network(0xE3E1f3E8, NetworkType.MAINNET)
      const actual = await wallet.getNetwork(ProviderType.NETWORK)
      expect(actual).toEqual(expected)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetwork: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getNetwork(ProviderType.NETWORK)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetwork: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getNetwork(ProviderType.NETWORK)).rejects.toThrow(ProviderException)
    })
  })

  //
  // broadcastRawTx
  //
  describe("broadcastRawTx()", () => {
    const rawtx = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0\
    704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8\
    be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000"
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve("txid"))
      })))()
      const providers = new Providers(networkProvider, undefined)
      wallet = new Wallet(providers)
    })
    it("should throw an error with invalid hex.", async () => {
      await expect(wallet.broadcastRawTx("hex")).rejects.toThrow(IllegalArgumentException)
    })
    it("should call INetworkProvider#broadcastRawtx", async () => {
      await wallet.broadcastRawTx("1234567890")
      expect(networkProvider.broadcastRawTx).toBeCalled()
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a string value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.broadcastRawTx("1234567890")).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.broadcastRawTx("1234567890")).rejects.toThrow(ProviderException)
    })
  })

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
    it("should call IWalletProvider#getFeePerByte", async () => {
      await wallet.getFeePerByte()
      expect(walletProvider.getFeePerByte).toBeCalled()
    })
    it("should return 1.", async () => {
      const actual = await wallet.getFeePerByte()
      expect(actual).toBe(1)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getFeePerByte: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getFeePerByte()).rejects.toThrow(ProviderException)
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
  // get/setDefaultDAppId
  //
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
