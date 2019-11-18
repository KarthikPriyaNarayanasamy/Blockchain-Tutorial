pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Shopping.sol";

contract TestShopping {
 // The address of the adoption contract to be tested
 Shopping shopping = Shopping(DeployedAddresses.Shopping());
 
 // The id of the student that will be used for testing
 uint expectedProductId = 8;

 //The expected owner of the product is this contract
 address expectedStudent = address(this);
 
 // Testing the adopt() function
function testUserCanShopProduct() public {
  uint returnedId = shopping.shop(expectedProductId);

  Assert.equal(returnedId, expectedProductId, "Shopping of the expected product should match what is returned.");
}

// Testing retrieval of a single product's owner
function testGetStudentAddressByProductId() public {
  address student = shopping.students(expectedProductId);

  Assert.equal(student, expectedStudent, "Owner of the expected product should be this contract");
}

// Testing retrieval of all pet owners
function testGetStudentAddressByProductIdInArray() public {
  // Store adopters in memory rather than contract's storage
  address[16] memory students = shopping.getStudents();

  Assert.equal(students[expectedProductId], expectedStudent, "Owner of the expected product should be this contract");
}


}
