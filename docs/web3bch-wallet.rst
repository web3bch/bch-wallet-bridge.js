==============
web3bch.wallet
==============

getAddress
=====================

.. code:: ts

   web3bch.wallet.getAddress(changeType, index, dAppId)

Returns the current wallet address.

----------
Parameters
----------

1. ``changeType`` : ``"receive" | "change"`` : The BIP44 change path type.
2. ``index`` : ``number`` : (optional) The BIP44 address_index path.
3. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.

-------
Returns
-------

``Promise<string>`` - The current wallet address.

-------
Example
-------

.. code:: ts

   const address = await web3bch.wallet.getAddress(
     "receive",
     3,
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(address)
   > "bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"

--------------

getAddressIndex
=====================

.. code:: ts

   web3bch.wallet.getAddressIndex(changeType, dAppId)

Returns the current wallet address index.

----------
Parameters
----------

1. ``changeType`` : ``"receive" | "change"`` : The BIP44 change path type.
2. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<number>`` - The current wallet address index.

-------
Example
-------

.. code:: ts

   const addrIdx = await web3bch.wallet.getAddressIndex(
     "change",
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(addrIdx)
   > 3

--------------

getAddresses
=====================

.. code:: ts

   web3bch.wallet.getAddresses(changeType, startIndex, size, dAppId)

Returns the wallet address list.

----------
Parameters
----------

1. ``changeType`` : ``"receive" | "change"`` : The BIP44 change path type.
2. ``startIndex`` : ``number`` : (optional) The BIP44 address_index path.
3. ``size`` : ``number`` : (optional) The address amount you want.
4. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<string>`` - The wallet address list.

-------
Example
-------

.. code:: ts

   const addresses = await web3bch.wallet.getAddresses(
     "receive",
     3,
     2,
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(addresses)
   > ["bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p", "bitcoincash:qrsfpepw3egqq4k7sg237ngyvslc2ug2eg7x7qdu3g"]

--------------

getRedeemScript
=====================

.. code:: ts

   web3bch.wallet.getRedeemScript(p2shAddress, dAppId)

Returns the stored redeem script.

----------
Parameters
----------

1. ``p2shAddress`` : ``string`` : The P2SH Address
2. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<string>`` - The stored redeem script.

-------
Example
-------

.. code:: ts

   const redeemScript = await web3bch.wallet.getRedeemScript(
     "bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg",
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(redeemScript)
   > "03424f587e06424954424f5887"

--------------

getRedeemScript
=====================

.. code:: ts

   web3bch.wallet.getRedeemScript(p2shAddress, dAppId)

Returns the stored redeem script.

----------
Parameters
----------

1. ``p2shAddress`` : ``string`` : The P2SH Address
2. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<string>`` - The stored redeem script.

-------
Example
-------

.. code:: ts

   const redeemScript = await web3bch.wallet.getRedeemScript(
     "bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg",
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(redeemScript)
   > "03424f587e06424954424f5887"

--------------

getRedeemScripts
=====================

.. code:: ts

   web3bch.wallet.getRedeemScripts(dAppId)

Returns the stored redeem scripts belong to the DApp ID.

----------
Parameters
----------

1. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<string[]>`` - The stored redeem script list.

-------
Example
-------

.. code:: ts

   const redeemScripts = await web3bch.wallet.getRedeemScript(
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(redeemScript)
   > ["03424f587e06424954424f5887", "789787a72c21452a1c98ff"]

--------------

addRedeemScript
=====================

.. code:: ts

   web3bch.wallet.getRedeemScripts(redeemScript, dAppId)

Add the redeem script into the wallet.

----------
Parameters
----------

1. ``redeemScript`` : ``string`` : The redeem script you want to add.
2. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<void>``

-------
Example
-------

.. code:: ts

   const redeemScripts = await web3bch.wallet.addRedeemScript(
     "03424f587e06424954424f5887"
   )

--------------

getUtxos
=====================

.. code:: ts

   web3bch.wallet.getUtxos(dAppId)

Returns the unspent transaction outputs.

----------
Parameters
----------

1. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<object[]>`` - The unspent transaction output object list.

1.  ``txid``: ``string`` - txid of the utxo
2.  ``outputIndex``: ``number`` - txout index number of the utxo
3.  ``address``: ``string`` - address
4.  ``script``: ``string`` - scriptPubKey
5.  ``satoshis``: ``number`` - satoshis

-------
Example
-------

.. code:: ts

   const utxos = await web3bch.wallet.getUtxos(
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(utxos)
   > [
       {
         'txId' : '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
         'outputIndex' : 0,
         'address' : 'bitcoincash:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p',
         'script' : '76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac',
         'satoshis' : 50000
       }
     ]

--------------

getBalance
=====================

.. code:: ts

   web3bch.wallet.getBalance(dAppId)

Returns the balance of the addresses.

----------
Parameters
----------

1. ``dAppId`` : ``string`` : (optional) The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<number>`` - The current balance for the addresses in satoshi.

-------
Example
-------

.. code:: ts

   const balance = await web3bch.wallet.getBalance(
     "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   )
   console.log(balance)
   > 500000

--------------

sign
=====================

.. code:: ts

   web3bch.wallet.sign(address, dataToSign)

Signs data from a specific account. This account needs to be unlocked.

----------
Parameters
----------

1. ``address`` : ``string`` - Address to sign with.
2. ``dataToSign`` : ``string`` - Data to sign in hex format.

-------
Returns
-------

``Promise<string>`` - The signed data.
After the hex prefix, characters correspond to ECDSA values like this:

Bitcoin signatures are serialised in the DER format over the wire. The
serialisation follows the form below.

| ``30`` - DER prefix
| ``45`` - Length of rest of Signature
| ``02`` - Marker for r value
| ``21`` - Length of r value
| ``00ed...8f`` - r value, Big Endian
| ``02`` - Marker for s value
| ``21`` - Length of s value
| ``7a98...ed`` - s value, Big Endian

-------
Example
-------

.. code:: ts

  const result = await web3bch.wallet.sign(
    "bchtest:qq28xgrzkdyeg5vf7tp2s3mvx8u95zes5cf7wpwgux",
    "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" // second argument is SHA1("hello")
  )
  console.log(result)
  > "30440220227e0973dfe536385b62f139c40b4304eb113cc51b3a4f227b2e529f278b6f7d0220721c03dc676d90a03e79a121fb52207be2b741f0b8e7e7cf40e2e23210ce3e58"

--------------

send
=====================

.. code:: ts

   web3bch.wallet.send(address, amount, data)

Create a transaction with specified address and amount and send it to
the network. The provider will add a change output to the change
address.

----------
Parameters
----------

1. ``address`` : ``string`` - The destination address.
2. ``amount`` : ``number`` - The value transferred to the destination address in
   satoshi.
3. ``data`` : ``string|string[]`` - (optional) An data or a list of data to put to
   the transaction’s OP_RETURN output.

-------
Returns
-------

``Promise<string>`` - hex formt of txid.

-------
Example
-------

.. code:: ts

   const txid = await web3bch.wallet.send("bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3", 2849119)
   console.log(txid)
   > "9591fdf10b16d4de6f65bcc49aadadc21d7a3a9169a13815e59011b426fe494f"

--------------

send
=====================

.. code:: ts

   web3bch.wallet.send(destinations, data)

Create a transaction with specified destinations and send it to the
network. The provider will add a change output to the change address.

----------
Parameters
----------

1. ``Array`` - The Array of destination objects.

   -  ``address``: ``string`` - The destination address.
   -  ``amount``: ``number`` - The value transferred to the destination address in satoshi.

2. ``string | string[]`` - (optional) An data or a list of data to put
   to the transaction’s OP_RETURN output.

-------
Returns
-------

``Promise<string>`` - hex formt of txid.

-------
Example
-------

.. code:: ts

   const txid = await web3bch.wallet.send([
     {
       address: "bitcoincash:qzg0esm3xr4gcq7u6vvgdwyjr4jwvl7seqrnjfzyc3",
       amount: 2849119
     },
     {
       address: "bitcoincash:prr7qqutastjmc9dn7nwkv2vcc58nn82uqwzq563hg",
       amount: 143124123
     }
   ])
   console.log(txid)
   > "9591fdf10b16d4de6f65bcc49aadadc21d7a3a9169a13815e59011b426fe494f"

--------------

advancedSend
=====================

.. code:: ts

   web3bch.wallet.advancedSend(outputs, dAppId)

Create a transaction with specified outputs and send it to the network.
The provider will not add any outputs. The ordering of outputs remains
as is.

----------
Parameters
----------

1. ``outputs`` : ``Array`` - The Array of TransactionOutput objects.

   - ``lockScript``: ``string`` - The hex format of lock script.
   - ``amount``:  ``number`` - The value transferred to the lock script in satoshi.

2. ``dAppId`` : ``string`` - (optinal)The DApp ID. If no dAppId is set the default DApp ID will be set.


-------
Returns
-------

``Promise<string>`` - hex formt of txid.

-------
Example
-------

.. code:: ts

   const txid = await web3bch.wallet.advancedSend([
     {
       lockScript: "76a91467b2e55ada06c869547e93288a4cf7377211f1f088ac",
       amount: 10000
     },
     {
       lockScript: "76a914aa154846d5aabd5bc740e1d9324f3c202da7bba988ac",
       amount: 20000
     }
   ])
   console.log(txid)
   > "9591fdf10b16d4de6f65bcc49aadadc21d7a3a9169a13815e59011b426fe494f"

--------------

getProtocolVersion
=====================

.. code:: ts

   web3bch.wallet.getProtocolVersion()

Returns the bitcoin protocol version.

-------
Returns
-------

``Promise<string>`` - The protocol version.

-------
Example
-------

.. code:: ts

   const version = await web3bch.wallet.getProtocolVersion()
   console.log(version)
   > "70015"

--------------

getNetwork
=====================

.. code:: ts

   web3bch.wallet.getNetwork()

Returns the current network.

-------
Returns
-------

1. ``Promise<object>`` - The network object.

   - ``magic``: ``string`` - Network magic bytes
   - ``name``: ``"Mainnet" | "Testnet3" | "Regnet"`` - Network name

-------
Example
-------

.. code:: ts

   const network = await web3bch.wallet.getNetwork()
   console.log(network)
   > {
       magicBytes: "e3e1f3e8",
       name: "Mainnet"
   }

--------------

broadcastRawtx
=====================

.. code:: ts

   web3bch.wallet.broadcastRawTx(rawtx)

Broadcast an already signed transaction.

----------
Parameters
----------

1. ``rawtx`` : ``string`` - Signed transaction data in hex format.

-------
Returns
-------

``Promise<string>`` - hex format of txid.

-------
Example
-------

.. code:: ts

   const txId = await web3bch.wallet.broadcastRawtx(
     "01000000013ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000006a4730440220540986d1c58d6e76f8f05501c520c38ce55393d0ed7ed3c3a82c69af04221232022058ea43ed6c05fec0eccce749a63332ed4525460105346f11108b9c26df93cd72012103083dfc5a0254613941ddc91af39ff90cd711cdcde03a87b144b883b524660c39ffffffff01807c814a000000001976a914d7e7c4e0b70eaa67ceff9d2823d1bbb9f6df9a5188ac00000000"
   )
   console.log(txId)
   > "d86c34adaeae19171fd98fe0ffd89bfb92a1e6f0339f5e4f18d837715fd25758"

--------------

getFeePerByte
=====================

.. code:: ts

   web3bch.wallet.getFeePerByte()

Returns the transaction fee per byte.

-------
Returns
-------

``Promise<number>`` - transaction fee per byte in satoshi

-------
Example
-------

.. code:: ts

   const fee = await web3bch.wallet.getFeePerByte()
   console.log(fee)
   > 1

--------------

getDefaultDAppId
=====================

.. code:: ts

   web3bch.wallet.getDefaultDAppId()

Returns the default DApp ID the provider uses. The default value is
``undefined``.

-------
Returns
-------

``Promise<string | undefined>`` - the DApp ID

-------
Example
-------

.. code:: ts

   const dAppId = await web3bch.wallet.defaultDAppId()
   console.log(dAppId)
   > "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"

--------------

setDefaultDAppId
=====================

.. code:: ts

   web3bch.wallet.setDefaultDAppId(dAppId)

Changes the default DApp ID for the provider.

----------
Parameters
----------

1. ``dAppId | undefined`` : ``string`` - The DApp ID.

-------
Returns
-------

``Promise<boolean>`` - whether the DApp ID was changed

-------
Example
-------

.. code:: ts

   const result = await web3bch.wallet.setDefaultDAppId("53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68")
   console.log(result)
   > true
