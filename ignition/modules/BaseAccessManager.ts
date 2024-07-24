import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BaseAccessManagerModule", (m) => {
  const admin = m.getParameter("admin");
  // Deploy BaseAccessManager
  const baseAccessManager = m.contract("BaseAccessManager", [admin]);
  return { baseAccessManager };
});

/* 
npx hardhat ignition deploy ./ignition/modules/BaseERC20.ts --network amoy --verify
    
Error in plugin hardhat-ignition: IGN1002: Verification not natively supported for chainId 80002. 
Please use a custom chain configuration to add support.

npx hardhat verify --network amoy DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 1"

Run the above cmd, ref -> https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify
*/

// VERIFICATION : npx hardhat verify --contract contracts/erc20/BaseAccessManager.sol:BaseAccessManager --network amoy 0x372E6bB1B706DF3FA9070B0c874E82a0D5b3B95a "0x5D7E7B133E5f16C75A18e3b04Ac9Af85451C209c"
