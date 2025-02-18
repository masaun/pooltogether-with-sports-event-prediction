pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract McObjects {

    struct PredictionData {
        uint predictionId;
        bytes32 userId;
        uint drawId;
        string gameOverview;
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
