// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IVaultFactory {
    // function setGovernor(address newGovernor) external;
    // function setKeeper(address newKeeper) external;
    // function setManagementFee(uint256 newManagementFee) external;
    // function withdrawETH(address recipient) external;
    // function withdrawTokens(address recipient, address token, uint256 tokenAmount) external;
    // function createVault(bytes32 name) external;
    // function deleteVault(address vaultProxy) external;
    function fireVaultEvent(address proxy, bytes32 name, address trader, bool inverseCopyTrade, uint16 copySizeBPS, address defaultCollateral) external;
    // function governor() external view returns (address);
    // function keeper() external view returns (address);
    // function MANAGEMENT_FEE() external view returns (uint256);
    // function vaults(address creator, address vaultProxy) external view returns (bytes32);
}