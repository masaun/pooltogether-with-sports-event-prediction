pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "../band/band-solidity/contracts/Band.sol";


contract PoolMock is MCDAwarePool, usingBandProtocol {  /// MCDAwarePool inherits BasePool.sol 
    using SafeMath for uint;

    IERC20 public dai;
    ICErc20 public cDai;

    Oracle public oracle;

    constructor(address _erc20, address _cErc20) public {
        dai = IERC20(_erc20);
        cDai = ICErc20(_cErc20);

        /// Instante an oracle instance for a given dataset address
        /// Assign dateset-oracle address of Sport Events (Kovan) 
        oracle = Oracle(0xF904Db9817E4303c77e1Df49722509a0d7266934);
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
        uint256 queryPrice = oracle.queryPrice();
        return queryPrice;
    }
    
    function getPerformDataQuery() public {
        uint256 _queryPrice = getQueryPrice();

        /// Make a query for key "SPOTPX/ETH-USD" (ETH/USD spot price)
        bytes32 output;
        uint256 updatedAt;
        Oracle.Querystatus status;
        (output, updatedAt, status) = oracle.query.value(_queryPrice)("SPOTPX/ETH-USD");        
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
