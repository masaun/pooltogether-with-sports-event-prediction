pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";


contract PoolMock is MCDAwarePool {
    using SafeMath for uint;

    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
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
    


    /**
     * @notice - Getter functions
     */
    function balanceOfContract() public view returns (address poolMockContractAddess, uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        address _poolMockContractAddess = getContractAddress();
        return (_poolMockContractAddess, dai.balanceOf(address(this)), address(this).balance);
    }    

    function getContractAddress() public view returns (address poolMockContractAddess) {
        return address(this);
    }
    
    
}
