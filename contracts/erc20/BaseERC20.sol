// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/manager/AccessManaged.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BaseERC20 is ERC20, ERC20Burnable, ERC20Pausable, AccessManaged, ERC20Permit {
    address public immutable tokenOwner;
    address public accessAuthority;

    constructor(string memory name, string memory symbol, uint256 amount, address owner, address authority)
        ERC20(name, symbol)
        AccessManaged(authority)
        ERC20Permit(name)
    {
        tokenOwner = owner;
        accessAuthority = authority;
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function pause() public restricted {
        _pause();
    }

    function unpause() public restricted {
        _unpause();
    }

    function mint(address to, uint256 amount) public restricted {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
