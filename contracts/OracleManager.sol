pragma solidity ^0.5.12;

import "./pooltogether/pooltogether-contracts/contracts/MCDAwarePool.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

/// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "./band/band-solidity/contracts/Band.sol";

/// Own contract
import "./pooltogether/PoolMock.sol";
import "./Prediction.sol";


contract OracleManager is usingBandProtocol, MCDAwarePool, OwnableOriginal(msg.sender), McStorage, McConstants {
    Prediction public prediction;

    constructor(address _prediction) public {
        prediction = Prediction(_prediction);
    }

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    function getQueryPrice() public view returns (uint256 queryPrice) {
        /// Get the price of querying for one data point (in Wei)
        uint256 queryPrice = SPORT.queryPrice();
        return queryPrice;
    }

    function oracleQueryScore() public payable returns (uint8 gameScore1, uint8 gameScore2) {
        /// 1st MLB match of the Astros vs the Tigers on August 19, 2019
        uint8 res1;
        uint8 res2;
        (res1, res2) = SPORT.queryScore("MLB/20190819/HOU-DET/1");
        emit OracleQueryScore(res1, res2);
        return (res1, res2);
    }


    /***
     * @notice - Oracle by using Band-Protocol
     **/
    function getResultOfGameScore(
        address _poolMock, 
        uint _drawId, 
        bytes32 _secret, 
        bytes32 _salt
    ) public payable returns (uint8 _gameScore1, uint8 _gameScore2) {
        /// Call result of game score via Oracle
        uint8 _gameScore1;
        uint8 _gameScore2;
        (_gameScore1, _gameScore2) = oracleQueryScore();

        /// Count participants of specified drawId
        PoolMock poolMock = PoolMock(_poolMock);
        uint currentCommittedDrawId = poolMock.getCurrentCommittedDrawId();

        /// Identify winners in all participants of specified drawId
        require (currentCommittedDrawId >= 1, "currentCommittedDrawId must be more than 1");
        for (uint i=1; i <= prediction.getCountOfPredictionData(currentCommittedDrawId); i++) {
            PredictionData memory predictionData = predictionDatas[i];
        }

        return (_gameScore1, _gameScore2);
    }
}
