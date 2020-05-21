pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "../band/band-solidity/contracts/Band.sol";

/// Storage
import "../storage/McStorage.sol";
import "../storage/McConstants.sol";


contract PoolMock is MCDAwarePool, usingBandProtocol, McStorage, McConstants {  /// MCDAwarePool inherits BasePool.sol 
    using SafeMath for uint;

    IERC20 public dai;
    ICErc20 public cDai;

    constructor(address _erc20, address _cErc20) public {
        dai = IERC20(_erc20);
        cDai = ICErc20(_cErc20);
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
        uint256 queryPrice = SPORT.queryPrice();
        return queryPrice;
    }
    
    function oracleQuerySpotPrice() public payable {
        /// Get the most-up-to-date ETH/USD rate
        uint256 ethUsdPrice = FINANCIAL.querySpotPrice("ETH-USD");
        emit OracleQuerySpotPrice(ethUsdPrice);
    }

    function oracleQuerySpotPriceWithExpiry() public payable {
        /// Get the most-up-to-date ETH/USD rate. Must not be older than 10 mins.
        uint256 ethUsdPrice = FINANCIAL.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
        emit OracleQuerySpotPriceWithExpiry(ethUsdPrice);
    }    

    function oracleQueryScore() public payable {
        /// 1st MLB match of the Astros vs the Tigers on August 19, 2019
        uint8 res1;
        uint8 res2;
        (res1, res2) = SPORT.queryScore("MLB/20190819/HOU-DET/1");
        emit OracleQueryScore(res1, res2);
    }

    /***
     * @notice - Distribute DAI into winner's wallet address
     * @param _secret The secret to reveal for the current committed Draw
     * @param _salt The salt that was used to conceal the secret
     **/
    function _reward(bytes32 _secret, bytes32 _salt) public {
        /// Lock tokens
        lockTokens();

        /// Delegate call of reward() in BasePool.sol
        reward(_secret, _salt);
    }



    /**
     * @notice - Getter functions
     */
    function balanceOfContract() public view returns (address poolMockContractAddess, uint balanceOfContract_DAI, uint balanceOfContract_cDAI, uint balanceOfContract_ETH) {
        address _poolMockContractAddess = getContractAddress();
        return (_poolMockContractAddess, dai.balanceOf(address(this)), cDai.supplyRatePerBlock(), address(this).balance);
    }    

    function getContractAddress() public view returns (address poolMockContractAddess) {
        return address(this);
    }
    
    
}
