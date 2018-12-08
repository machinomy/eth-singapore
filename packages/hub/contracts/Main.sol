pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";

contract Main {
  using SafeMath for uint256;

  mapping (address => uint256) public data;

  event transferSuccessful(uint256 operationId, bytes fromAccount, address fromAddress, address toAddress, uint256 amount, uint256 fromBalance, uint256 toBalance);

  function check (bytes userAccount, address userAddress, bytes userSignature) public {
      bytes32 hash = keccak256(abi.encodePacked(userAccount, userAddress));
      address recoveredAddress = ECRecovery.recover(ECRecovery.toEthSignedMessageHash(hash), userSignature);
      require(data[userAddress] != 0, "check: Record not found!");
      require(userAddress == recoveredAddress, "check: Record is not correct!");
  }

  function addFund (address who, uint256 howMuch) public {
      data[who] += howMuch;
  }

  function () payable public {
      addFund(msg.sender, msg.value);
  }

  function transfer (uint256 operationId, bytes fromAccount, address fromAddress, address toAddress, uint256 amount, bytes fromSignature) public {
    check(fromAccount, fromAddress, fromSignature);
    require(data[fromAddress] - amount > 0, "transfer: User From has no enough fund. Please, refill wallet.");
    data[fromAddress] -= amount;
    data[toAddress] += amount;

    emit transferSuccessful(operationId, fromAccount, fromAddress, toAddress, amount, data[fromAddress], data[toAddress]);
  }
}
