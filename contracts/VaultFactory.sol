// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { VaultProxy } from "./VaultProxy.sol";
import { VaultImplementation } from "./VaultImplementationV1.sol";

contract VaultFactory {
    address public governor;
    address public keeper;
    uint256 public MANAGEMENT_FEE;
    mapping(address => mapping(address => bytes32)) public vaults;

    event CreateVault(address creator, bytes32 name, address vaultImplementation, address vaultProxy);
    event DeleteVault(address creator, address vaultProxy);
    event Trader(bytes32 indexed name, address indexed trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral);

    modifier onlyGov {
        require(msg.sender == governor, "Only governor");
        _;
    }

    constructor() {
        governor = msg.sender;
    }

    receive() payable external {}

    function setGovernor(address newGovernor) public onlyGov {
        governor = newGovernor;
    }

    function setKeeper(address newKeeper) public onlyGov {
        keeper = newKeeper;
    }

    function setManagementFee(uint256 newManagementFee) public onlyGov {
        MANAGEMENT_FEE = newManagementFee;
    }

    function withdrawETH(address recepient) public onlyGov {
        payable(recepient).transfer(address(this).balance);
    }

    function withdrawTokens(address recepient, address token, uint256 tokenAmount) public onlyGov {
        IERC20(token).transfer(recepient, tokenAmount);
    }

    function createVault(bytes32 name) public {
        VaultImplementation vaultImplementation = new VaultImplementation();
        VaultProxy vaultProxy = new VaultProxy(address(vaultImplementation));
        VaultImplementation(payable(address(vaultImplementation))).initialize();
        VaultImplementation(payable(address(vaultProxy))).setParams(name, keeper, address(this), MANAGEMENT_FEE);
        vaultProxy.transferOwnership(msg.sender);
        vaults[msg.sender][address(vaultProxy)] = name;
        emit CreateVault(msg.sender, name, address(vaultImplementation), address(vaultProxy));
    }

    function deleteVault(address vaultProxy) public {
        delete vaults[msg.sender][vaultProxy];
        emit DeleteVault(msg.sender, vaultProxy);
    }

    function fireVaultEvent(address caller, bytes32 name, address trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) public {
        require(vaults[caller][msg.sender] == name, "onlyVaultOwner call");
        emit Trader(name, trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
   }
}