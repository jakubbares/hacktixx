
pragma solidity ^0.4.11;

contract Venue {

  mapping (string => string) eventToVenue;
  mapping (string => address) eventToProducer;
  mapping (string => address) venueRequestToAddress;
  mapping (string => address) venueToAddress;
  mapping (string => uint256) eventToSeatCount;
  mapping (string => uint256) eventToMaxSeatsPerUser;
  mapping (string => bool) eventVerified;
  address authority;


  function Venue() {
    authority = msg.sender;
  }

  function toVerifyVenueOwner(string venue) returns(bool){
    venueToAddress[venue] = venueRequestToAddress[venue];
    return true;
  }

  function toRegisterVenue(string venue) returns(bool){
    venueRequestToAddress[venue] = msg.sender;
    return true;
  }

  function toPlaceEvent(string _event, string venue, uint256 seatCount, uint256 maxSeatsPerUser) returns(bool){
    eventToVenue[_event] = venue;
    eventToSeatCount[_event] = seatCount;
    eventToProducer[_event] = msg.sender;
    eventToMaxSeatsPerUser[_event] = maxSeatsPerUser;
    return true;
  }

  function toVerifyEvent(string _event, string venue) returns(bool){
    require(venueToAddress[venue] == msg.sender);
    eventVerified[_event] = true;
    return true;
  }

  function toGetSeatCount(string _event) constant returns(uint256){
    require(eventVerified[_event]);
    uint256 seatCount = eventToSeatCount[_event];
    return seatCount;
  }

  function toGetMaxSeatsPerUser(string _event) constant returns(uint256){
    require(eventVerified[_event]);
    uint256 maxSeats = eventToMaxSeatsPerUser[_event];
    return maxSeats;
  }


}
