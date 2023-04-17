// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Interfaces/IVaultFactory.sol";

contract VaultImplementation is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    address public vaultFactory;
    address public keeper;
    bytes32 public name;

    uint256 public constant BASIS_POINTS_DIVISOR = 10000;
    uint256 public MANAGEMENT_FEE;

    struct TraderProps {
        bool inverseCopyTrade;
        uint16 copySizeBPS;
        address defaultCollateral;
    }

    mapping(address => TraderProps) public traders;

    event Trader(address  addressThis, address caller, bytes32 name, address trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral);

    modifier onlyKeeper() {
        require(msg.sender == keeper, "Only keeper");
        _;
    }
    
    modifier onlyVaultFactory() {
        require(vaultFactory != address(0) && msg.sender == vaultFactory, "Only keeper");
        _;
    }

    receive() external payable {}

    function initialize() public initializer {
        __Ownable_init();
    }

    function setParams(bytes32 _name, address _keeper, address _vaultFactory, uint256 _managementFee) public onlyVaultFactory{
        name = _name;
        keeper = _keeper;
        vaultFactory = _vaultFactory;
        MANAGEMENT_FEE = _managementFee;
    }

    function modifyTrader(address trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) public onlyOwner {
        traders[trader] = TraderProps(inverseCopyTrade, copySizeBPS, defaultCollateral);
        IVaultFactory(vaultFactory).fireVaultEvent(msg.sender, name, trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
    }

    function addTrader(address trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) public onlyOwner {
        TraderProps storage traderProps = traders[trader];
        require(traderProps.defaultCollateral == address(0), "already added");
        traderProps.inverseCopyTrade = inverseCopyTrade;
        traderProps.copySizeBPS = copySizeBPS;
        traderProps.defaultCollateral = defaultCollateral;
        IVaultFactory(vaultFactory).fireVaultEvent(msg.sender, name, trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
    }

    function deleteTrader(address trader) public onlyOwner {
        delete traders[trader];
        IVaultFactory(vaultFactory).fireVaultEvent(msg.sender, name, trader, false, 0, address(0));
    }

    function callContract(address contractToCall, bytes calldata data, address token, uint256 amount) public payable onlyKeeper {
        if (token != address(0)) {
            IERC20(token).transferFrom(owner(), address(this), amount);
        }
        (bool success, ) = address(contractToCall).call{value: msg.value}(data);
        require(success, "call failed");
    }

    function withDrawProfit(address token, address recepient, uint256 amount) public onlyOwner {
        if (token != address(0)) {
            IERC20(token).transfer(recepient, (amount * (BASIS_POINTS_DIVISOR - MANAGEMENT_FEE)) / BASIS_POINTS_DIVISOR);
            IERC20(token).transfer(vaultFactory, (amount * MANAGEMENT_FEE) / BASIS_POINTS_DIVISOR);
        }
    }

    function withdrawETH(address recepient) public onlyOwner {
        payable(vaultFactory).transfer((address(this).balance * MANAGEMENT_FEE) / BASIS_POINTS_DIVISOR);
        payable(recepient).transfer(address(this).balance);
    }

   function _authorizeUpgrade(address) internal override onlyOwner {}
}