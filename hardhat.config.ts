import { HardhatUserConfig } from "hardhat/config";
// import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";

// import "./tasks/deploy-erc721";
// import "./tasks/deploy-erc20";
import dotenv from "dotenv";
dotenv.config();

// Ensure your configuration variables are set before executing the script
// import { vars } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    amoy: {
      allowUnlimitedContractSize: true,
      // url: vars.get("AMOY_URL"),
      // accounts: [vars.get("AMOY_PVT_KEY")]
      url: String(process.env.AMOY_URL),
      accounts: process.env.AMOY_PVT_KEY ? [process.env.AMOY_PVT_KEY] : [],
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          evmVersion: "london",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: process.env.AMOY_API_KEY,
  },
  sourcify: {
    enabled: true
  }
};

export default config;