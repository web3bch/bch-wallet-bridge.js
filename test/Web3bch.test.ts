import Web3bch from "../src/web3bch"
import IWeb3bch from "../src/web3bch/IWeb3bch"
import IllegalArgumentException from "../src/web3bch/entities/IllegalArgumentException"
import ProviderException from "../src/web3bch/entities/ProviderException"
import Network, { NetworkType } from "../src/web3bch/entities/Network"
import each from "jest-each"
import IWalletProvider from "providers/lib/IWalletProvider"
import ChangeType from "providers/lib/entities/ChangeType"
import Utxo from "providers/lib/entities/Utxo"
import Output from "providers/lib/entities/Output"

describe("Web3bch", () => {
  let web3bch: IWeb3bch
  let walletProvider: IWalletProvider

  describe("getAddress()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(["bitcoincash:foo", "bitcoincash:bar"]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getAddress(ChangeType.RECEIVE)
    })
    it("should call IWalletProvider#getAddresses", async () => {
      await web3bch.getAddress(ChangeType.RECEIVE)
      expect(walletProvider.getAddresses).toBeCalled()
    })
    it("should throw IllegalArgumentException if the index is < 0.", () => {
      expect(() => web3bch.getAddress(ChangeType.RECEIVE, -1)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if the index is > 2147483647", () => {
      expect(() => web3bch.getAddress(ChangeType.RECEIVE, 2147483648)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if the index is not decimal.", () => {
      expect(() => web3bch.getAddress(ChangeType.RECEIVE, 0.1)).toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddress(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  describe("getAddressIndex()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.resolve(3))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getAddressIndex(ChangeType.RECEIVE)
    })
    it("should calls IWalletProvider#getAddressIndex", async () => {
      await web3bch.getAddressIndex(ChangeType.CHANGE)
      expect(walletProvider.getAddressIndex).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getAddressIndex", async () => {
      const index = await web3bch.getAddressIndex(ChangeType.CHANGE)
      expect(index).toBe(3)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddressIndex(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddressIndex: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddressIndex(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  describe("getAddresses()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(["bitcoincash:foo", "bitcoincash:bar"]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getAddresses(ChangeType.RECEIVE)
    })
    it("should call IWalletProvider#getAddresses", async () => {
      await web3bch.getAddresses(ChangeType.RECEIVE)
      expect(walletProvider.getAddresses).toBeCalled()
    })
    it("should throw IllegalArgumentException if startIndex is < 0.", () => {
      expect(() => web3bch.getAddresses(ChangeType.RECEIVE, -1)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if startIndex is > 2147483647", () => {
      expect(() => web3bch.getAddresses(ChangeType.RECEIVE, 2147483648)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if startIndex is not decimal.", () => {
      expect(() => web3bch.getAddresses(ChangeType.RECEIVE, 0.1)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if size is < 1.", () => {
      expect(() => web3bch.getAddresses(ChangeType.RECEIVE, 0, 0)).toThrow(IllegalArgumentException)
    })
    it("should throw IllegalArgumentException if the sum of startIndex and size is > 2147483647.", () => {
      expect(() => web3bch.getAddresses(ChangeType.RECEIVE, 2147483647, 1)).toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[]], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddresses(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getAddresses: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getAddresses(ChangeType.RECEIVE)).rejects.toThrow(ProviderException)
    })
  })

  describe("getRedeemScript()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() =>
        Promise.resolve(["9c1657fb5142ca85ab2d27ea847f648ec172a012", "51519587"]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await web3bch.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should returns a script corresponding to the address", async () => {
      const script = await web3bch.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw")
      expect(script).toBe("51519587")
    })
    it("should throws IllegalArgumentException if the address is invalid", async () => {
      await expect(web3bch.getRedeemScript("I am not Address"))
        .rejects.toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the address is P2PKHAdress.", async () => {
      await expect(web3bch.getRedeemScript("bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"))
        .rejects.toThrow(IllegalArgumentException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array or an empty array"
    , async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(""))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getRedeemScript("bitcoincash:pr9cc50sfdfwmnd5d9udevvvep4s7w6swcvltg3dmw"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("getRedeemScripts()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getRedeemScripts()
    })
    it("should calls IWalletProvider#getRedeemScripts", async () => {
      await web3bch.getRedeemScripts()
      expect(walletProvider.getRedeemScripts).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getRedeemScripts", async () => {
      const sciprts = await web3bch.getRedeemScripts()
      expect(sciprts).toEqual(["03424f587e06424954424f5887", "789787a72c21452a1c98ff"])
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]]])
    .it("should throw ProviderException when provider does not return a string array or an empty array",
     async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getRedeemScripts: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getRedeemScripts()).rejects.toThrow(ProviderException)
    })
  })

  describe("addRedeemScript()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve())
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.addRedeemScript("03424f587e06424954424f5887")
    })
    it("should call IWalletProvider#addRedeemScript", async () => {
      await web3bch.addRedeemScript("03424f587e06424954424f5887")
      expect(walletProvider.addRedeemScript).toBeCalled()
    })
    it("should throw IllegalArgumentException if the script is empty string.", async () => {
      await expect(web3bch.addRedeemScript("")).rejects.toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[null], [true], [3], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return undefined", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        addRedeemScript: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.addRedeemScript("03424f587e06424954424f5887")).rejects.toThrow(ProviderException)
    })
  })

  describe("getUtxos()", () => {
    const utxo = new Utxo(
      "10a879077602483f7e89cae7202c95119fc9ce53db55f33c7efe401703aa7c38",
       2,
       "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3",
       "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
       50000
    )
    const utxo2 = new Utxo(
      "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
      0,
      "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p",
      "047c039059b17576a914f9a93ce9b7ebed298597655065a96c2e0846db1788ac",
      20000
    )
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve([utxo2]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getUtxos()
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
    })
    it("should call IWalletProvider#getSpendableUtxos", async () => {
      await web3bch.getUtxos()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it("should call IWalletProvider#getUnspendableUtxos", async () => {
      await web3bch.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set.",
     async () => {
      const utxos = await web3bch.getUtxos()
      expect(utxos).toEqual([utxo])
    })
    it("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await web3bch.getUtxos("foo")
      expect(new Set(utxos)).toEqual(new Set([utxo, utxo2]))
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getUtxos()).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getUtxos())
      .rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getUtxos("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("getBalance()", () => {
    const utxo = new Utxo(
      "10a879077602483f7e89cae7202c95119fc9ce53db55f33c7efe401703aa7c38",
       2,
       "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3",
       "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
       50000
    )
    const utxo2 = new Utxo(
      "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
      0,
      "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p",
      "047c039059b17576a914f9a93ce9b7ebed298597655065a96c2e0846db1788ac",
      20000
    )

    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve([utxo2]))
      })))()
      web3bch = new Web3bch(walletProvider)
    })

    it("should be success if there is no problem.", async () => {
      await web3bch.getBalance()
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
    })
    it("should calls IWalletProvider#getSpendableUtxos", async () => {
      await web3bch.getBalance()
      expect(walletProvider.getSpendableUtxos).toBeCalled()
    })
    it("should calls IWalletProvider#getUnspendableUtxos", async () => {
      await web3bch.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
      expect(walletProvider.getUnspendableUtxos).toBeCalled()
    })
    it("should return the same value as IWalletProvider#getSpendableUtxos if the DAppsID is not set."
    , async () => {
      const utxos = await web3bch.getBalance()
      expect(utxos).toBe(50000)
    })
    it("should return the same value as IWalletProvider#getUnspendableUtxos if the DAppsID is set.", async () => {
      const utxos = await web3bch.getBalance("foo")
      expect(utxos).toBe(70000)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getBalance()).rejects.toThrow(ProviderException)
    })
    each([[undefined], [null], [true], [3], ["string"], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a Utxo object", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.resolve([utxo])),
        getUnspendableUtxos: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getSpendableUtxos: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getBalance())
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if IWalletProvider#getUnspendableUtxos returns invalid value.",
     async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getUnspendableUtxos: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getBalance("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"))
      .rejects.toThrow(ProviderException)
    })
  })

  describe("sign()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve(
          "II0XaiKCRsRROS6gIcRpwao74wc55ijZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E="
        ))
      })))()
      web3bch = new Web3bch(walletProvider)
    })

    it("should be success if there is no problem.", async () => {
      await web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
    })
    it("should calls IWalletProvider#sign", async () => {
      await web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(walletProvider.sign).toBeCalled()
    })
    it("should return the same value as IWalletProvider#sign.", async () => {
      const signed = await web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch")
      expect(signed).toBe("II0XaiKCRsRROS6gIcRpwao74wc55ijZjfcGpay2vgQ/D1OJclEuFwp7aLYZwZNWjtHw7i5vbKsbcAPLWCmF11E=")
    })
    it("should throws IllegalArgumentException if the address is invalid", async () => {
      await expect(web3bch.sign("I'm an invalid address", "Hello web3bch")).rejects.toThrow(IllegalArgumentException)
    })
    it("should throws IllegalArgumentException if the message is empty string.", async () => {
      await expect(web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", ""))
        .rejects.toThrow(IllegalArgumentException)
    })
    it("should throws ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
    it("should throws ProviderException if the wallet provider invalid value.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve(1))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
        .rejects.toThrow(ProviderException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a string value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        sign: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.sign("bitcoincash:qqk4zg334zpg9dpevnzz06rv2ffcwq96fctnutku5y", "Hello web3bch"))
      .rejects.toThrow(ProviderException)
    })
  })

  //
  // buildTransaction
  //
  describe("buildTransaction()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve("rawtx"))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    const output = new Output("76a91467b2e55ada06c869547e93288a4cf7377211f1f088ac", 10000)
    const output2 = new Output("76a914d7e7c4e0b70eaa67ceff9d2823d1bbb9f6df9a5188ac", 30000)
    it("should be success if there is no problem.", async () => {
      await web3bch.buildTransaction([output, output2])
    })
    it("should calls IWalletProvider#createSignedTx", async () => {
      await web3bch.buildTransaction([output, output2])
      expect(walletProvider.createSignedTx).toBeCalled()
    })
    it("should throw an error if the outputs is an empty array.", async () => {
      await expect(web3bch.buildTransaction([])).rejects.toThrow(IllegalArgumentException)
    })
    // ProviderException
    each([[undefined], [null], [true], [3], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider#createSignedTx does not return a string value",
     async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.buildTransaction([output, output2])).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        createSignedTx: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.buildTransaction([output, output2])).rejects.toThrow(ProviderException)
    })
  })

  //
  // getProtocolVersion
  //
  describe("getProtocolVersion()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(70015))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getProtocolVersion()
    })
    it("should call IWalletProvider#getProtocolVersion", async () => {
      await web3bch.getProtocolVersion()
      expect(walletProvider.getProtocolVersion).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = 70015
      const actual = await web3bch.getProtocolVersion()
      expect(actual).toBe(expected)
    })
    it("should throw ProviderException if the wallet provider returns a string.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve("70015"))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it.skip("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
    it.skip("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getProtocolVersion: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getProtocolVersion()).rejects.toThrow(ProviderException)
    })
  })

  //
  // getNetwork
  //
  describe("getNetwork()", () => {
    beforeEach(() => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetworkMagic: jest.fn(() => Promise.resolve(0xE3E1f3E8))
      })))()
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem", async () => {
      await web3bch.getNetwork()
    })
    it("should call IWalletProvider#getNetworkMagic.", async () => {
      await web3bch.getNetwork()
      expect(walletProvider.getNetworkMagic).toBeCalled()
    })
    it("should return expected value.", async () => {
      const expected = new Network(0xE3E1f3E8, NetworkType.MAINNET)
      const actual = await web3bch.getNetwork()
      expect(actual).toEqual(expected)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetworkMagic: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getNetwork()).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getNetworkMagic: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getNetwork()).rejects.toThrow(ProviderException)
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
      web3bch = new Web3bch(walletProvider)
    })
    it("should be success if there is no problem.", async () => {
      await web3bch.getFeePerByte()
    })
    it("should call IWalletProvider#getFeePerByte", async () => {
      await web3bch.getFeePerByte()
      expect(walletProvider.getFeePerByte).toBeCalled()
    })
    it("should return 1.", async () => {
      const actual = await web3bch.getFeePerByte()
      expect(actual).toBe(1)
    })
    // ProviderException
    each([[undefined], [null], [true], ["string"], [[]], [[true]], [[3]], [["string"]]])
    .it("should throw ProviderException when provider does not return a number value", async (providerReturn) => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getFeePerByte: jest.fn(() => Promise.resolve(providerReturn))
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getFeePerByte()).rejects.toThrow(ProviderException)
    })
    it("should throw ProviderException if the wallet provider throws an error.", async () => {
      walletProvider = new (jest.fn<IWalletProvider>(() => ({
        getFeePerByte: jest.fn(() => Promise.reject())
      })))()
      web3bch = new Web3bch(walletProvider)
      await expect(web3bch.getFeePerByte()).rejects.toThrow(ProviderException)
    })
  })

  //
  // get/setDefaultDAppId
  //
  describe("get/setDefaultDAppId()", () => {
    beforeEach(() => {
      web3bch = new Web3bch()
    })
    it("The initial value of defaultDAppId should be undefined.", async () => {
      const actual = await web3bch.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })
    it("should throw an error with invalid DAppId.", async () => {
      await expect(web3bch.setDefaultDAppId("dappid")).rejects.toThrow(IllegalArgumentException)
      const actual = await web3bch.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })
    it("should set defaultDAppId properly.", async () => {
      const dappId = "fa3c13e9283cff80edeea53958e5ad1b9d8942385408c1b3d2f3c67a06a92835"
      await web3bch.setDefaultDAppId(dappId)
      const actual = await web3bch.getDefaultDAppId()
      expect(actual).toBe(dappId)
    })
    it("should set defaultDAppId as undefined properly.", async () => {
      await web3bch.setDefaultDAppId(undefined)
      const actual = await web3bch.getDefaultDAppId()
      expect(actual).toBeUndefined()
    })
  })
})
