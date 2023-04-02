// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.18;


import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VaultProxy is UUPSUpgradeable {
    constructor(address initialImpl) {
        _upgradeTo(initialImpl);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override {}
}
