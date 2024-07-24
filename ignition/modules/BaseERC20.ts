import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import BaseAccessManagerModule from "./BaseAccessManager";

export const BaseERC20Module = buildModule("BaseERC20Module", (m) => {
  const name = m.getParameter("name");
  const symbol = m.getParameter("symbol");
  const amount = m.getParameter("amount");
  const owner = m.getParameter("owner");
  const authority = m.getParameter("authority");
  // Deploy BaseERC20
  const baseERC20 = m.contract("BaseERC20", [name, symbol, amount, owner, authority]);
  return { baseERC20 };
});

/* 
Setting authority dynamically with BaseAccessManagerModule using m.useModule in BaseERC20ModuleWithAccessManager
Note: Ignition runs for this default export
*/
export const BaseERC20ModuleWithAccessManager = buildModule("BaseERC20Module", (m) => {
  const name = m.getParameter("name");
  const symbol = m.getParameter("symbol");
  const amount = m.getParameter("amount");
  const owner = m.getParameter("owner"); // owner in BaseERC20 is same as admin of BaseAccessManager
  const { baseAccessManager } = m.useModule(BaseAccessManagerModule); // initialAuthority

  const baseERC20 = m.contract("BaseERC20", [name, symbol, amount, owner, baseAccessManager], {
    after: [baseAccessManager]
  });

  return { baseERC20 };
});

export default BaseERC20ModuleWithAccessManager;

/* 
npx hardhat ignition deploy ./ignition/modules/BaseERC20.ts --network amoy --verify
    
Error in plugin hardhat-ignition: IGN1002: Verification not natively supported for chainId 80002. 
Please use a custom chain configuration to add support.

npx hardhat verify --network amoy DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 1"

Run the above cmd, ref -> https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify
*/

// VERIFICATION : npx hardhat verify --network amoy 0x7c378FC1ade29e3538C75de8D3Ab2bCbf42E5E01 "ERC20Token" "OZ" "0x372E6bB1B706DF3FA9070B0c874E82a0D5b3B95a"