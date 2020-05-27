pragma solidity ^0.5.12;

import "./McObjects.sol";


contract McEvents {

    /***
     * @notice - The relevant prediction
     **/
    event GameScorePrediction(
        uint predictionId,
        bytes32 userId, 
        uint drawId, 
        string gameOverview,  /// i.e). "MLB/20190819/HOU-DET/1"
        uint gameScore1, 
        uint gameScore2,
        uint timestamp
    );

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    event OracleQuerySpotPrice(
        uint256 ethUsdPrice
    );

    event OracleQuerySpotPriceWithExpiry(
        uint256 ethUsdPrice
    );

    event OracleQueryScore(
        uint8 gameScore1, 
        uint8 gameScore2
    );    

    event AddAdminRoleAddress(
        address _admin
    );
    


    /***
     * @notice - Example
     **/
    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        address msgSender,
        uint256 approvedValue    
    );

}
