pragma solidity ^0.5.12;

import "./McObjects.sol";


contract McEvents {

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
        uint8 res1, 
        uint8 res2
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
