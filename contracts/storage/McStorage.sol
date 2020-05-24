pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "./McObjects.sol";
import "./McEvents.sol";


// shared storage
contract McStorage is McObjects, McEvents {

    ///////////////////////////////////
    // @dev - Define as memory
    ///////////////////////////////////
    address[] exampleGroups;

    
    //////////////////////////////////
    // @dev - Define as storage
    ///////////////////////////////////
    mapping (uint => PredictionData) predictionDatas;
    


    ExampleObject[] public exampleObjects;

    mapping (uint256 => Sample) samples;

}
