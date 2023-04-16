// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract VaultProxy is  ERC1967Proxy, OwnableUpgradeable  {
    constructor(address initialImpl) ERC1967Proxy(initialImpl, "") initializer{
        _upgradeTo(initialImpl);
        __Ownable_init();
    }

}
