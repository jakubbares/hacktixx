
pragma solidity ^0.4.11;

contract Tixx {

  mapping (string => uint256) seatToOrigPrice;
  mapping (string => uint256) seatToPrice;
  mapping (string => address) seatToAddress;
  mapping (string => bool) seatToSold;
  mapping (address => uint256) userToBoughtSeatsCount;
  mapping (address => bool) userIsVerified;
  mapping (address => uint256) balances;
  address ltd;

  function Tixx() {
    ltd = msg.sender;
  }

  function toVerifyUser(address user) returns(bool) {
    userIsVerified[user] = true;
    userToBoughtSeatsCount[user] = 0;
    return true;
  }

  function toVerifyTicket(address user, string seat) returns(bool) {
    return seatToAddress[seat] == user;
  }

  function toBuyTicket(string seat, uint256 origPrice) payable returns(bool){
    require(userIsVerified[msg.sender]);
    require(userToBoughtSeatsCount[msg.sender] <= 4);
    require(!seatToSold[seat]);
    seatToAddress[seat] = msg.sender;
    seatToOrigPrice[seat] = origPrice;
    seatToPrice[seat] = origPrice;
    seatToSold[seat] = true;
    userToBoughtSeatsCount[msg.sender] += 1;
    ltd.transfer(msg.value);
    TicketBought(seat,origPrice,msg.sender);
    return true;
  }

  function toTransferTicket(string seat, uint256 newPrice) payable returns(bool){
    require(userIsVerified[msg.sender]);
    address origOwner = seatToAddress[seat];
    seatToAddress[seat] = msg.sender;
    seatToPrice[seat] = newPrice;
    uint256 origPrice = seatToOrigPrice[seat];
    uint256 fee = (newPrice - origPrice) / 3;
    ltd.transfer(fee);
    origOwner.transfer(newPrice - fee);
    TicketTransfered(seat,newPrice,msg.sender);
    return true;
  }

  event TicketBought(string seat, uint256 origPrice, address owner);
  event TicketTransfered(string seat, uint256 newPrice, address newOwner);


}
