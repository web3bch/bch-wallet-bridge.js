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

describe("Wallet", () => {
  let wallet: IWallet
  let walletProvider: IWalletProvider
  let networkProvider: INetworkProvider

  //
  // getAddress
  //
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
  // getAddressIndex
  //
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
      await wallet.getAddress(ChangeType.CHANGE)
      expect(walletProvider.getAddressIndex).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getAddressIndex", async () => {
      const index = await wallet.getAddress(ChangeType.CHANGE)
      expect(index).toBe(3)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getAddressIndex(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  //
  // getRedeemScript
  //
  describe("getRedeemScript()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() =>
        Promise.resolve(["03424f587e06424954424f5887", "9c1657fb5142ca85ab2d27ea847f648ec172a012"]))
        // "pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya" is a hash value of "9c1657fb5142ca85ab2d27ea847f648ec172a012"
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it.skip("should be success if there is no problem.", async () => {
      await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
    })
    it.skip("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it.skip("should returns a script corresponding to the address", async () => {
      const script = await wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya")
      expect(script).toBe("9c1657fb5142ca85ab2d27ea847f648ec172a012")
    })
    it.skip("should throws IllegalArgumentException if the address is invalid", () => {
      expect(() => wallet.getRedeemScript("I am not Address")).toThrow(IllegalArgumentException)
    })
    it.skip("should throws IllegalArgumentException if the address is P2PKHAdress.", () => {
      expect(() => wallet.getRedeemScript("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"))
      .toThrow(IllegalArgumentException)
    })
    it.skip("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScript("bitcoincash:pzwpv4lm29pv4pdt95n74prlvj8vzu4qzg7pgrspya"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if the wallet provider invalid value.", async () => {
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
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it.skip("should be success if there is no problem.", async () => {
      await wallet.getRedeemScripts()
    })
    it.skip("should calls IWalletProvider#getRedeemScripts", async () => {
      await wallet.getRedeemScripts()
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#getRedeemScripts", async () => {
      const sciprts = await wallet.getRedeemScripts()
      expect(sciprts).toBe(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"])
    })
    it.skip("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if the wallet provider invalid value.", async () => {
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
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve())
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it.skip("should be success if there is no problem.", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
    })
    it.skip("should calls IWalletProvider#addRedeemScript", async () => {
      await wallet.addRedeemScript("03424f587e06424954424f5887")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it.skip("should throws IllegalArgumentException if the script is empty string.", () => {
      expect(() => wallet.addRedeemScript("")).toThrow(IllegalArgumentException)
    })
    it.skip("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if the wallet provider invalid value.", async () => {
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
    it.skip("should calls IWalletProvider#getSpendableUtxos", async () => {
      await wallet.getUtxos()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it.skip("should calls IWalletProvider#getUnspendableUtxos", async () => {
      await wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it.skip("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo, utxo2])
    })
    it.skip("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe([utxo])
    })
    it.skip("should throws ProviderException if IWalletProvider#getSpendableUtxos throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos()).rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if IWalletProvider#getUnspendableUtxos throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if IWalletProvider#getSpendableUtxos returns invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(1))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getUtxos()).rejects.toThrow(ProviderException)
    })
    it.skip("should throws ProviderException if IWalletProvider#getUnspendableUtxos returns invalid value.", async () => {
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

    it("should be success if there is no problem.", async () => {
      await wallet.getBalance()
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
      expect(utxos).toBe(70000)
    })
    it("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await wallet.getUtxos()
      expect(utxos).toBe(20000)
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
  // sign
  //
  describe("sign()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve("II0XaiKCRsRROS6gIcRpwao74wc55ij\
        ZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E="))
      })))()
      const providers = new Providers(undefined, walletProvider)
      wallet = new Wallet(providers)
    })

    it("should be success if there is no problem.", async () => {
      await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
    })
    it("should calls IWalletProvider#addRedeemScript", async () => {
      await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(walletProvider.sign).toBeCalled()
    })
    it("should return the same value as IWalletProvider#sign.", async () => {
      const signed = await wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(signed).toBe("II0XaiKCRsRROS6gIcRpwao74wc55ijZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E=")
    })
    it("should throws IllegalArgumentException if the address is invalid", () => {
      expect(() => wallet.sign("I'm an invalid address", "Hello web3bch")).toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the message is empty string.", () => {
      expect(() => wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", ""))
      .toThrow(IllegalArgumentException)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider return invalid signed data.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve("invalid signed data"))
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
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
  // send
  //

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

    it.skip("should be success if there is no problem.", async () => {
      await wallet.getProtocolVersion()
    })
    it.skip("should calls IWalletProvider#getProtocolVersion", async () => {
      await wallet.getProtocolVersion()
      expect(walletProvider.getProtocolVersion).toBeCalled()
    })
    it.skip("should return expected value.", async () => {
      const expected = 70015
      const actual = await wallet.getProtocolVersion()
      expect(actual).toBe(expected)
    })
    it.skip("should throw ProviderException if the wallet provider returns a string.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve("70015"))
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
    it("should calls INetworkProvider#getNetworkMagic if ProviderType is NETWORK.", async () => {
      await wallet.getNetwork(ProviderType.NETWORK)
      expect(networkProvider.getNetworkMagic).toBeCalled()
    })
    it("should calls IWalletProvider#getNetworkMagic if ProviderType is WALLET.", async () => {
      await wallet.getNetwork(ProviderType.WALLET)
      expect(walletProvider.getNetworkMagic).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = new Network(0xE3E1f3E8, NetworkType.MAINNET)
      const actual = await wallet.getNetwork(ProviderType.NETWORK)
      expect(actual).toEqual(expected)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetwork: jest.fn(() => Promise.reject())
      })))()
      wallet = new Wallet(new Providers(undefined, walletProvider))
      await expect(wallet.getNetwork(ProviderType.NETWORK)).rejects.toThrow(ProviderException)
    })
  })

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
