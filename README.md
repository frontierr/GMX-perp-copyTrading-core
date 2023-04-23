## to learn more on UUPS
- https://github.com/nuthan2x/uups-feb23

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```


## steps

- clone the repo to the local folder
```
npm init -y
```
```
npm i
```

then fork Arbitrum locally to deploy/ interact with contract.

```
npx hardhat node --fork https://rpc.ankr.com/arbitrum
```


then see forkArbitrum.md for more details on fork node data or see in command line 
or fork with anvil.

```
anvil --fork-url https://rpc.ankr.com/arbitrum
```

use

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

create a proxy and implementation contract for UUPS pattern that can be deployed on another smart contract call and initialised, ownership transfered, upgraded .

Sure, here's an example implementation of a proxy contract using the UUPSUpgradeable pattern that can be deployed on another smart contract and initialized, have ownership transferred, and be upgraded.

First, let's define the implementation contract that we want to proxy, which will inherit from UUPSUpgradeable and OwnableUpgradeable:

// MyContract.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyContract is UUPSUpgradeable, OwnableUpgradeable {
  uint public myData;

  function initialize() initializer public {
    __Ownable_init();
    myData = 42;
  }

  function increment() public {
    myData++;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
Next, let's define the proxy contract, which will inherit from UUPSUpgradeable and OwnableUpgradeable as well:

// MyContractProxy.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContractProxy is UUPSUpgradeable, OwnableUpgradeable, Initializable {
  function initialize(address initialImplementation) initializer public {
    __UUPSUpgradeable_init();
    __Ownable_init();

    _upgradeTo(initialImplementation);
  }

  function upgrade(address newImplementation) public onlyOwner {
    _upgradeTo(newImplementation);
  }

  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
The initialize function takes an initial implementation address and upgrades the proxy to that implementation. The upgrade function can be called by the owner to upgrade the proxy to a new implementation. The transferOwnership function can be called by the owner to transfer ownership of the proxy to a new address.

To deploy the proxy and initialize the implementation contract, you can follow these steps:

Deploy the implementation contract, e.g. using Truffle console:
MyContract.deployed().then(instance => { instance.initialize() })
Get the address of the implementation contract:
const implementationAddress = MyContract.address
Deploy the proxy contract, passing in the implementation address, e.g. using Truffle console:
MyContractProxy.deployed().then(instance => { instance.initialize(implementationAddress) })
Now you can interact with the proxy contract as if it were the implementation contract. For example, you can call the increment function:

MyContractProxy.deployed().then(instance => { instance.increment() })
This will increment the myData variable in the implementation contract. You can also upgrade the proxy to a new implementation contract, transfer ownership, and perform other actions as needed.

now write a smart contract function to do above 3 functions

Sure, here's an example smart contract function that deploys the proxy and initializes the implementation contract, upgrades the proxy to a new implementation contract, and transfers ownership of the proxy:

// MyContractManager.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./MyContractProxy.sol";

contract MyContractManager is Initializable, OwnableUpgradeable {
  address public implementationAddress;
  address public proxyAddress;

  function initialize(address _implementationAddress) initializer public {
    __Ownable_init();
    implementationAddress = _implementationAddress;
    createProxy();
  }

  function createProxy() public onlyOwner {
    MyContractProxy proxy = new MyContractProxy();
    proxy.initialize(implementationAddress);
    proxyAddress = address(proxy);
  }

  function upgradeProxy(address newImplementation) public onlyOwner {
    MyContractProxy(proxyAddress).upgrade(newImplementation);
  }

  function transferProxyOwnership(address newOwner) public onlyOwner {
    MyContractProxy(proxyAddress).transferOwnership(newOwner);
  }
}
The createProxy function creates a new proxy contract and initializes it with the current implementation address. The upgradeProxy function upgrades the proxy to a new implementation contract. The transferProxyOwnership function transfers ownership of the proxy to a new address.

To use this contract, you would first need to deploy the implementation contract and get its address. Then you can deploy the MyContractManager contract and call its initialize function with the implementation address:

MyContract.deployed().then(instance => { 
  const implementationAddress = instance.address;
  MyContractManager.deployed().then(manager => { manager.initialize(implementationAddress) })
})
This creates a new instance of the MyContractManager contract and initializes it with the implementation address.

To upgrade the proxy to a new implementation contract, you can call the upgradeProxy function:

const newImplementationAddress = "0x123456...";
MyContractManager.deployed().then(manager => { manager.upgradeProxy(newImplementationAddress) })
This will upgrade the proxy to the new implementation contract at the specified address.

To transfer ownership of the proxy, you can call the transferProxyOwnership function:

const newOwner = "0xabcdef...";
MyContractManager.deployed().then(manager => { manager.transferProxyOwnership(newOwner) })
This will transfer ownership of the proxy to the specified address.