import hre from "hardhat";
import BaseAccessManagerModule from "../ignition/modules/BaseAccessManager";
import { BaseERC20Module } from "../ignition/modules/BaseERC20";
import fs from "fs";

type paramsType = {
  BaseERC20Module: {
    name: string;
    symbol: string;
    amount: string;
    owner: string;
    authority: string;
  };
  BaseAccessManagerModule: {
    admin: string;
  };
};

async function main() {
  try {
    const params: paramsType = JSON.parse(fs.readFileSync(process.cwd() + "/ignition/parameters.json", "utf8"));
    console.log("params: ", params);

    // Deploy BaseAccessManager
    const { baseAccessManager } = await hre.ignition.deploy(BaseAccessManagerModule, {
      parameters: {
        BaseAccessManagerModule: {
          admin: params.BaseAccessManagerModule.admin,
        },
      },
    });
    const baseAccessManagerAddr = await baseAccessManager.getAddress();
    console.log(`baseAccessManager deployed to: ${baseAccessManagerAddr}`);

    // Deploy BaseERC20 with BaseAccessManager's address
    const { baseERC20 } = await hre.ignition.deploy(BaseERC20Module, {
      parameters: {
        BaseERC20Module: {
          name: params.BaseERC20Module.name,
          symbol: params.BaseERC20Module.symbol,
          amount: params.BaseERC20Module.amount,
          owner: params.BaseERC20Module.owner,
          authority: baseAccessManagerAddr,
        },
      },
    });
    const baseERC20Addr = await baseERC20.getAddress();
    console.log(`baseERC20 deployed to: ${baseERC20Addr}`);
  } catch (err) {
    console.error("Error deploying contracts:", err);
  }
}

main().catch(console.error);
