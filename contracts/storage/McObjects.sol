pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract McObjects {

    /***
     * @dev - Example
     **/
    enum ExampleType { TypeA, TypeB, TypeC }

    struct ExampleObject {
        address addr;
        uint amount;
    }

    struct Sample {
        address addr;
        uint amount;
    }

}
