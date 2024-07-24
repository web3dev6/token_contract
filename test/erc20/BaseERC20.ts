import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseERC20, BaseAccessManager } from "../../typechain-types";

describe("BaseERC20 Contract", function () {
  const name = "ERC20Token";
  const symbol = "ERC20";
  const amount = "1000000000";
  let owner: any;
  let admin: any;
  let user1: any;
  let user2: any;
  let ownerAddr: string;
  let adminAddr: string;
  let user1Addr: string;
  let user2Addr: string;

  let baseAccessManager: BaseAccessManager;
  let baseERC20: BaseERC20;
  
  before(async function () {
    [owner, admin, user1, user2] = await ethers.getSigners();
    ownerAddr = await owner.getAddress();
    adminAddr = await admin.getAddress();
    user1Addr = await user1.getAddress();
    user2Addr = await user2.getAddress();

    // Deploy BaseAccessManager
    const BaseAccessManagerFactory = await ethers.getContractFactory("BaseAccessManager");
    baseAccessManager = (await BaseAccessManagerFactory.deploy(adminAddr)) as BaseAccessManager;

    const baseAccessManagerAddr = await baseAccessManager.getAddress();
    if (!baseAccessManagerAddr) {
      throw new Error("BaseAccessManager deployment failed, address is null");
    }

    // Deploy BaseERC20 using BaseAccessManager's address
    const BaseERC20Factory = await ethers.getContractFactory("BaseERC20");
    baseERC20 = (await BaseERC20Factory.deploy(name, symbol, amount, owner, baseAccessManagerAddr)) as BaseERC20;

    const baseERC20Addr = await baseERC20.getAddress();
    if (!baseERC20Addr) {
      throw new Error("BaseERC20 deployment failed, address is null");
    }

    // give ADMIN_ROLE(0) to accounts in access manager to let UTs work with all addresses
    await baseAccessManager.connect(admin).grantRole(0, ownerAddr, 0);
    await baseAccessManager.connect(admin).grantRole(0, user1Addr, 0);
    await baseAccessManager.connect(admin).grantRole(0, user2Addr, 0);
  });

  it("should deploy and set up contracts correctly", async function () {
    expect(await baseERC20.name()).to.equal("ERC20Token");
    expect(await baseERC20.symbol()).to.equal("ERC20");
  });

  it("should mint tokens", async function () {
    await baseERC20.connect(owner).mint(user1Addr, ethers.parseUnits("100", 18));
    const user1Balance = await baseERC20.balanceOf(user1Addr);

    expect(user1Balance).to.equal(ethers.parseUnits("100", 18));
  });

  it("should burn tokens", async function () {
    await baseERC20.connect(user1).burn(ethers.parseUnits("10", 18));
    const user1Balance = await baseERC20.balanceOf(user1Addr);

    expect(user1Balance).to.equal(ethers.parseUnits("90", 18));
  });

  it("should transfer tokens", async function () {
    await baseERC20.connect(user1).transfer(user2Addr, ethers.parseUnits("10", 18));
    const user1Balance = await baseERC20.balanceOf(user1Addr);
    const user2Balance = await baseERC20.balanceOf(user2Addr);

    expect(user1Balance).to.equal(ethers.parseUnits("80", 18));
    expect(user2Balance).to.equal(ethers.parseUnits("10", 18));
  });

  it("should transfer tokens using transferFrom", async function () {
    await baseERC20.connect(user1).approve(user2Addr, ethers.parseUnits("10", 18));
    await baseERC20.connect(user2).transferFrom(user1Addr, user2Addr, ethers.parseUnits("10", 18));
    const user1Balance = await baseERC20.balanceOf(user1Addr);
    const user2Balance = await baseERC20.balanceOf(user2Addr);

    expect(user1Balance).to.equal(ethers.parseUnits("70", 18));
    expect(user2Balance).to.equal(ethers.parseUnits("20", 18));
  });

  it("should pause and unpause the contract", async function () {
    await baseERC20.connect(owner).pause();
    expect(await baseERC20.paused()).to.be.true;

    await baseERC20.connect(owner).unpause();
    expect(await baseERC20.paused()).to.be.false;
  });

  it("should permit and transfer tokens using permit method", async function () {
    // Get the nonce for the user
    const nonce = await baseERC20.nonces(user1Addr);
    // Get the deadline for the permitted user to make transfer
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    // Get value to transfer
    const value = ethers.parseUnits("10", 18);
    const domain = {
      name: "ERC20Token",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: await baseERC20.getAddress(),
    };
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    // Create the permit message
    const message = {
      owner: user1Addr,
      spender: user2Addr,
      value: value,
      nonce: nonce,
      deadline: deadline,
    };
    // Sign the permit message
    const signature = await user1.signTypedData(domain, types, message);
    const { v, r, s } = ethers.Signature.from(signature);
    // Call permit method
    await baseERC20.connect(user1).permit(user1Addr, user2Addr, value, deadline, v, r, s);
    // Check the allowance
    const allowance = await baseERC20.allowance(user1Addr, user2Addr);
    expect(allowance.toString()).to.equal(value.toString());
    // Perform a transfer from user1 to user2 using the allowance
    await baseERC20.connect(user2).transferFrom(user1Addr, user2Addr, value);
    // Check final balances
    const user1Balance = await baseERC20.balanceOf(user1Addr);
    const user2Balance = await baseERC20.balanceOf(user2Addr);

    expect(user1Balance.toString()).to.equal(ethers.parseUnits("60", 18).toString());
    expect(user2Balance.toString()).to.equal(ethers.parseUnits("30", 18).toString());
  });
});
