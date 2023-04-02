// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.18;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VaultImplementation is Initializable, ERC1967Upgrade, OwnableUpgradeable {

    bytes32 public  name;
    address public keeper;

    struct TraderProps {
        bool inverseCopyTrade;
    }

    mapping (address => TraderProps) trader;


    function initialize(bytes32 _name) public initializer {
        name = _name;
        keeper = keeper;
        __Ownable_init();
    }







}
