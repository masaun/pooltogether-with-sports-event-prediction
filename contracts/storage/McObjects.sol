pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract McObjects {

    struct Prediction {
        uint userId;
        uint drawId;
        uint gameScore1;
        uint gameScore2;
        uint timestamp;
    }



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
