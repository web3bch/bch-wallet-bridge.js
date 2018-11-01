=============
Web3bch
=============

web3bch object
===============

The ``web3bch`` object provides all methods.

-------
Example
-------

.. code:: ts

   import Web3bch from "web3bch"

   const injected = window.web3bch
   if (!injected || !injected.currentProvider) {
     console.log("Web3bch provider doesn't injected!")
     return
   }
   const web3bch = new Web3bch(provider)

After that you can use the ``web3bch`` object.

--------------

version
===============

.. code:: ts

   web3bch.version

The web3bch version.

-------
Returns
-------

``string`` - The current web3bch version.

-------
Example
-------

.. code:: ts

   const version = web3bch.version
   console.log(version)
   > "0.1.0"

--------------

currentProvider
=========================

.. code:: ts

   web3bch.currentProvider

The current provider.

-------
Returns
-------

``object | undefined`` - The current provider set.
