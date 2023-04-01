// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultFactory {

    address public governor;

    mapping (address => mapping(bytes32 => bool)) vaults;

    event CreateVault(address creator, bytes32 name);
    event DeleteVault(address creator, bytes32 name);

    modifier onlyGov {
        require(msg.sender == governor);
        _;
    }

    constructor() {
        governor = msg.sender;
    }


    function setGovernor(address newGovernor) public onlyGov {
        governor = newGovernor;
    }

    function withdrawETH(address recepient) public onlyGov{
        payable(recepient).transfer(address(this).balance);
    }

    function withdrawTokens(address token, address recepient, uint256 tokenAmount) public onlyGov{
       IERC20(token).transfer(recepient, tokenAmount);
    }


    function createVault(bytes32 name) public {
       vaults[msg.sender][name] = true;

       emit CreateVault(msg.sender, name);
    }

    function deleteVault(bytes32 name) public {
       delete vaults[msg.sender][name];

       emit DeleteVault(msg.sender, name);
    }
}

