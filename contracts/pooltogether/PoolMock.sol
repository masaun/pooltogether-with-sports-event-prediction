pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "../band/band-solidity/contracts/Band.sol";


contract PoolMock is MCDAwarePool, usingBandProtocol {  /// MCDAwarePool inherits BasePool.sol 
    using SafeMath for uint;

    IERC20 public dai;
    ICErc20 public cDai;

    //Oracle public oracleSportEvents;         // For Sport Events (Kovan)
    //Oracle public oracleFinancialDataFeeds;  // For Financial Data Feeds (Kovan)

    constructor(address _erc20, address _cErc20) public {
        dai = IERC20(_erc20);
        cDai = ICErc20(_cErc20);

        /// Instante an oracle instance for a given dataset address
        //oracleSportEvents = Oracle(0xF904Db9817E4303c77e1Df49722509a0d7266934);  // Dateset-Oracle address of Sport Events (Kovan)
        //oracleFinancialDataFeeds = Oracle(0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e);  // Dateset-Oracle address of Financial Data Feeds (Kovan)
    }


    /***
     * @notice - Deposit DAI into Pool(=this contract)
     **/
    function _depositPool(uint _depositAmount) public returns (bool) {
        depositPool(_depositAmount);  // Delegate call of depositPool() in BasePool.sol
    }

    
    /***
     * @notice - Pool Logic for selecting winner 
     **/
    function poolLogic() public returns (bool) {
        // In progress

    }
    

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    function getQueryPrice() public view returns (uint256 queryPrice) {
        /// Get the price of querying for one data point (in Wei)
        uint256 queryPrice = FINANCIAL.queryPrice();
        return queryPrice;
    }
    
    function oracleQuerySpotPrice() public payable returns (uint256 _ethUsdPrice1) {
        /// Get the most-up-to-date ETH/USD rate
        uint256 ethUsdPrice1 = FINANCIAL.querySpotPrice("ETH-USD");
        return ethUsdPrice1;
    }

    function oracleQuerySpotPriceWithExpiry() public payable returns (uint256 _ethUsdPrice2) {
        /// Get the most-up-to-date ETH/USD rate. Must not be older than 10 mins.
        uint256 ethUsdPrice2 = FINANCIAL.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
        return ethUsdPrice2;
    }    

    function oracleQueryScore() public payable returns (uint8 _res1, uint8 _res2) {
        /// 1st MLB match of the Astros vs the Tigers on August 19, 2019
        uint8 res1;
        uint8 res2;
        (res1, res2) = SPORT.queryScore("MLB/20190819/HOU-DET/1");
        return (res1, res2);
    }
    

    /**
     * @notice - Getter functions
     */
    function balanceOfContract() public view returns (address poolMockContractAddess, uint balanceOfContract_DAI, uint balanceOfContract_cDAI, uint balanceOfContract_ETH) {
        address _poolMockContractAddess = getContractAddress();
        return (_poolMockContractAddess, dai.balanceOf(address(this)), cDai.getCash(), address(this).balance);
    }    

    function getContractAddress() public view returns (address poolMockContractAddess) {
        return address(this);
    }
    
    
}
