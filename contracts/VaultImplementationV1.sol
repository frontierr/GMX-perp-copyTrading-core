// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.18;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultImplementation is Initializable, ERC1967Upgrade, OwnableUpgradeable {

    address public vaultFactory;
    address public keeper;
    bytes32 public  name;

    uint256 public constant BASIS_POINTS_DIVISOR = 10000;
    uint256 public MANAGEMENT_FEE;
    struct TraderProps {
        bool inverseCopyTrade;
    }

    mapping (address => TraderProps) trader;

    modifier onlyKeeper {
        require(msg.sender == keeper);
        _;
    }


    function initialize(bytes32 _name, address _keeper, address _vaultFactory, uint256 _managementFee) public initializer {
        name = _name;
        keeper = _keeper;
        vaultFactory = _vaultFactory;
        MANAGEMENT_FEE = _managementFee;
        __Ownable_init();
    }


    function callContract(
        address contractToCall, 
        bytes calldata data, 
        address token, 
        uint256 amount) 
    payable public onlyKeeper{

        if (token != address(0)) {
            IERC20(token).transferFrom(owner(), address(this), amount);
        }

        (bool success, ) = address(contractToCall).call{value : msg.value}(data);
        require(success, "tx call failed");
    }

    function withDrawProfit(address token, address recepient, uint256 amount) public  {
        if (token != address(0)) {
            IERC20(token).transfer(recepient, amount * (BASIS_POINTS_DIVISOR -  MANAGEMENT_FEE) / BASIS_POINTS_DIVISOR);
            IERC20(token).transfer(vaultFactory, amount * MANAGEMENT_FEE / BASIS_POINTS_DIVISOR);
        }
    }


}
