import Wallet from "../src/web3bch-wallet/Wallet"
import IWallet from "../src/web3bch-wallet/IWallet"
import ChangeType from "../src/web3bch-providers/entities/ChangeType"
import Providers from "../src/web3bch/Providers"
import INetworkProvider from "../src/web3bch-providers/INetworkProvider"
import IWalletProvider from "../src/web3bch-providers/IWalletProvider"
import IllegalArgumentException from "../src/web3bch-wallet/entities/IllegalArgumentException"
import ProviderException from "../src/web3bch-wallet/entities/ProviderException"
import Network from "../src/web3bch-wallet/entities/Network"
import Utxo from "../src/web3bch-providers/entities/Utxo"
import Destination from "../src/web3bch-wallet/entities/Destination"

describe("Wallet", () => {
  let wallet: IWallet
  let walletProvider: IWalletProvider
  let networkProvider: INetworkProvider

  //
  // getAddress
  //
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
  // getRedeemScript
  //
  describe("getRedeemScript()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() =>
        Promise.resolve(["03424f587e06424954424f5887", "9c1657fb5142ca85ab2d27ea847f648ec172a012"]))
        // "pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya" is a hash value of "9c1657fb5142ca85ab2d27ea847f648ec172a012"
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should returns a script corresponding to the address", async () => {
      const script = await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
      expect(script).toBe("9c1657fb5142ca85ab2d27ea847f648ec172a012")
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
      await expect(wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve([]))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya"))
      .rejects.toThrow(ProviderException)
    })
  })

  //
  // getRedeemScripts
  //
  describe("getRedeemScripts()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>())()
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
    it("should return the same value as IWalletProvider#getRedeemScripts", async () => {
      const sciprts = await wallet.getRedeemScripts()
      expect(sciprts).toBe(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"])
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
  describe("addRedeemScript()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve())
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
    })
    it("should calls IWalletProvider#addRedeemScript", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should throws IllegalArgumentException if the script is empty string.", () => {
      expect(() => wallet.addRedeemScript("")).toThrow(IllegalArgumentException)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
  })

  //
  // getUtxos
  //
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
      networkProvider = new (jest.fn<INetworkProvider>())()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo, utxo2])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve([utxo]))
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getUtxos()
    })
    it("should be success if there is no problem.", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
    })
    it("should calls IWalletProvider#getSpendableUtxos", async () => {
      await wallet.getUtxos()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it("should calls IWalletProvider#getUnspendableUtxos", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo, utxo2])
    })
    it("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo])
    })
    it("should throws ProviderException if IWalletProvider#getSpendableUtxos throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos()).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if IWalletProvider#getUnspendableUtxos throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if IWalletProvider#getSpendableUtxos returns invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos()).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if IWalletProvider#getUnspendableUtxos returns invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
  })

  //
  // getBalance
  //

  //
  // sign
  //

  //
  // send
  //
  describe("send()", () => {
    beforeEach(() => {
      networkProvider = new (jest.fn<INetworkProvider>(() => ({
        broadcastRawTx: jest.fn(() => Promise.resolve("txid"))
      })))()
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve())
      })))()
      const providers = new Providers(networkProvider, walletProvider)
      wallet = new Wallet(providers)
    })
    const destination = new Destination("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p", 100000)
    const destination2 = new Destination("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya", 300000)
    it("should be success if there is no problem.", async () => {
      await wallet.send(destination)
    })
    it("should be success if there is no problem.", async () => {
      await wallet.send(destination, "Hello Bitcoin Cash")
    })
    it("should be success if there is no problem.", async () => {
      await wallet.send(destination, ["Hello", "Bitcoin", "Cash"])
    })
    it("should be success if there is no problem.", async () => {
      await wallet.send([destination, destination2])
    })
    it("should calls IWalletProvider#createSignedTx", async () => {
      await wallet.send(destination)
      expect(walletProvider.createSignedTx).toBeCalled()
    })
    it("should calls networkProvider#broadcastRawTx", async () => {
      await wallet.send(destination)
      expect(networkProvider.broadcastRawTx).toBeCalled()
    })
    it("should return the same value as networkProvider#broadcastRawTx", async () => {
      const txid = wallet.send(destination)
      expect(txid).toBe("txid")
    })
    it("should throw an error if the destination is an empty array.", async () => {
      await expect(wallet.send([])).rejects.toThrow(IllegalArgumentException)
    })
  })

  //
  // advancedSend
  //

  //
  // getProtocolVersion
  //

  describe("getProtocolVersion()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(70015))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.getProtocolVersion()
    })
    it("should calls IWalletProvider#getProtocolVersion", async () => {
      await wallet.getProtocolVersion()
      expect(walletProvider.getProtocolVersion).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = 70015
      const actual = await wallet.getNetwork()
      expect(actual).toBe(expected)
    })
    it("should throw ProviderException if the wallet provider returns a string.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve("70015"))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
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
