// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";

contract BaseAccessManager is AccessManager {
    constructor(address admin) AccessManager(admin) {}
}
