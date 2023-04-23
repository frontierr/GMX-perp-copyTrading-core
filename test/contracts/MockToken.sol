// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol) {
        // _setupDecimals(decimals);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}


// pragma solidity 0.8.18;

// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// contract VaultProxy is UUPSUpgradeable {
//     constructor(address initialImpl) {
//         _upgradeTo(initialImpl);
//     }

//     function _authorizeUpgrade(
//         address newImplementation
//     ) internal virtual override {}
// }



// contract VaultImplementation is Initializable, ERC1967Upgrade, OwnableUpgradeable {

//     address public vaultFactory;
//     address public keeper;
//     bytes32 public  name;

//     uint256 public constant BASIS_POINTS_DIVISOR = 10000;
//     uint256 public MANAGEMENT_FEE;
//     struct TraderProps {
//         bool inverseCopyTrade;
//         uint16 copySizeBPS;
//         address defaultCollateral;
//     }

//     mapping (address => TraderProps) traders;

//     event Trader(address indexed trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral);

//     modifier onlyKeeper {
//         require(msg.sender == keeper);
//         _;
//     }

//     receive() payable external{}


//     function initialize(bytes32 _name, address _keeper, address _vaultFactory, uint256 _managementFee) public initializer {
//         name = _name;
//         keeper = _keeper;
//         vaultFactory = _vaultFactory;
//         MANAGEMENT_FEE = _managementFee;
//         __Ownable_init();
//     }

//     function modifyTrader(address trader ,bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) public onlyOwner {
//         traders[trader] = TraderProps(inverseCopyTrade, copySizeBPS, defaultCollateral);

//         emit Trader(trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
//     }

//     function addTrader(address trader ,bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) public onlyOwner {
//         TraderProps storage traderProps = traders[trader];

//         require(traderProps.defaultCollateral == address(0), "already added");

//         traderProps.inverseCopyTrade = inverseCopyTrade;
//         traderProps.copySizeBPS = copySizeBPS;
//         traderProps.defaultCollateral = defaultCollateral;

//         emit Trader(trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
//     }

//     function deleteTrader(address trader) public onlyOwner {
//         delete traders[trader];

//         emit Trader(trader, false, 0, address(0));
//     }


//     function callContract(
//         address contractToCall, 
//         bytes calldata data, 
//         address token, 
//         uint256 amount) 
//     payable public onlyKeeper{

//         if (token != address(0)) {
//             IERC20(token).transferFrom(owner(), address(this), amount);
//         }

//         (bool success, ) = address(contractToCall).call{value : msg.value}(data);
//         require(success, "tx call failed");
//     }

//     function withDrawProfit(address token, address recepient, uint256 amount) public onlyOwner {
//         if (token != address(0)) {
//             IERC20(token).transfer(recepient, amount * (BASIS_POINTS_DIVISOR -  MANAGEMENT_FEE) / BASIS_POINTS_DIVISOR);
//             IERC20(token).transfer(vaultFactory, amount * MANAGEMENT_FEE / BASIS_POINTS_DIVISOR);
//         }
//     }

//     function withdrawETH(address recepient) public onlyOwner {
//         payable(vaultFactory).transfer(address(this).balance * MANAGEMENT_FEE / BASIS_POINTS_DIVISOR);
//         payable(recepient).transfer(address(this).balance );
//     }


// }



// contract VaultFactory {

//     address public governor;
//     address public keeper;
//     uint256 public MANAGEMENT_FEE;

//     mapping (address => mapping(address => bytes32)) vaults;

//     event CreateVault(address creator, bytes32 name, address vaultImplementation, address vaultProxy);
//     event DeleteVault(address creator, address vaultProxy);

//     modifier onlyGov {
//         require(msg.sender == governor);
//         _;
//     }

//     constructor() {
//         governor = msg.sender;
//     }

//     receive() payable external{}


//     function setGovernor(address newGovernor) public onlyGov {
//         governor = newGovernor;
//     }

//     function setKeeper(address newKeeper) public onlyGov {
//         keeper = newKeeper;
//     }

//     function setManagementFee(uint256 newManagementFee) public onlyGov {
//         MANAGEMENT_FEE = newManagementFee;
//     }

//     function withdrawETH(address recepient) public onlyGov{
//         payable(recepient).transfer(address(this).balance);
//     }

//     function withdrawTokens(address recepient, address token, uint256 tokenAmount) public onlyGov{
//        IERC20(token).transfer(recepient, tokenAmount);
//     }


//     function createVault(bytes32 name) public {

//        VaultImplementation vaultImplementation = new VaultImplementation();
//        VaultProxy vaultProxy = new VaultProxy(address(vaultImplementation));

//        VaultImplementation(payable(address(vaultProxy))).initialize(name, keeper, address(this), MANAGEMENT_FEE);
       
//        vaults[msg.sender][address(vaultProxy)] = name;

//        emit CreateVault(msg.sender, name, address(vaultImplementation), address(vaultProxy));
//     }

//     function deleteVault(address vaultProxy) public {
//        delete vaults[msg.sender][vaultProxy];

//        emit DeleteVault(msg.sender, vaultProxy);
//     }
// }
