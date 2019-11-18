pragma solidity ^0.5.0;

contract Shopping {
  address[16] public students;

	// Adopting a pet
	function shop(uint productId) public returns (uint) {
	  require(productId >= 0 && productId <= 15);

	  students[productId] = msg.sender;

	  return productId;
	}
	//retrieving the students list
	function getStudents() public view returns (address[16] memory) {
	    return students;
	}

}