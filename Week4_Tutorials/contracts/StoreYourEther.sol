//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StoreYourEther is ReentrancyGuard {

    mapping(address => uint256) private balances;
    function depositEther() public payable nonReentrant {
        balances[msg.sender] += msg.value;
    }
    function withdrawEther() public nonReentrant {
        uint256 bal = balances[msg.sender];
        require(bal > 0);
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        balances[msg.sender] = 0;
    }
    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}