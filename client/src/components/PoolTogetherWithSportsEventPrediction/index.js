import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import App from "../../App.js";

import { Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../../utils/theme';
import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';
//import './App.css';

import { walletAddressList } from '../../data/walletAddress/walletAddress.js'
import { contractAddressList } from '../../data/contractAddress/contractAddress.js'
import { tokenAddressList } from '../../data/tokenAddress/tokenAddress.js'


export default class PoolTogetherWithSportsEventPrediction extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        this._initPoolToken = this._initPoolToken.bind(this);
        this.initPool = this.initPool.bind(this);
        this.addAdmin = this.addAdmin.bind(this);
        this.removeAdmin = this.removeAdmin.bind(this);
        this.openNextDraw = this.openNextDraw.bind(this);
        this._depositIntoTemporaryAccount = this._depositIntoTemporaryAccount.bind(this);
        this._depositPool = this._depositPool.bind(this);
        this.reward = this.reward.bind(this);

        /////// The relevant prediction
        this.gameScorePrediction = this.gameScorePrediction.bind(this);

        /////// Oracle by using Band-Protocol
        this._getQueryPrice = this._getQueryPrice.bind(this);
        this._oracleQueryScore = this._oracleQueryScore.bind(this);

        /////// Getter Functions
        this._getCurrentOpenDrawId = this._getCurrentOpenDrawId.bind(this);
        this._getBasePool = this._getBasePool.bind(this);
        this.balanceOfUnderlying = this.balanceOfUnderlying.bind(this);
        this._balanceOfContract = this._balanceOfContract.bind(this);

        /////// Test Functions
        this._getCurrentDrawId = this._getCurrentDrawId.bind(this);
        this.timestampFromDate = this.timestampFromDate.bind(this);
    }

    _initPoolToken = async () => {
        const { accounts, web3, dai, poolToken_mock } = this.state;

        const _name = 'Test PoolToken'
        const _symbol = 'TPT'
        const _defaultOperators = [accounts[0]];
        const _pool = contractAddressList["Kovan"]["PoolTogether"]["PoolDai"];  // MCDAwarePool.sol

        let res = await poolToken_mock.methods.initPoolToken(_name, _symbol, _defaultOperators, _pool).send({ from: accounts[0] });
        //let res = await poolToken_mock.methods.init(_name, _symbol, _defaultOperators, _pool).send({ from: accounts[0] });
        console.log('=== initPoolToken() ===\n', res);           
    }

    initPool = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        //const _owner = POOlMOCK_ADDRESS; /// OwnerAddress is added as "Owner" role?
        const _owner = walletAddressList["WalletAddress1"]; /// OwnerAddress is added as "Owner" role?
        const _cToken = tokenAddressList["Kovan"]["cDAI"];
        const _feeFraction = web3.utils.toWei('0.1');
        const _feeBeneficiary = walletAddressList["WalletAddress1"];
        const _lockDuration = 55;
        const _cooldownDuration = 90;
        //const _admin = "";                                  /// _addmin is added as "admin" role
        //const _admin = POOlMOCK_ADDRESS;                    /// _addmin is added as "admin" role
        const _admin = walletAddressList["WalletAddress1"];   /// _addmin is added as "admin" role
 
        //@dev - Init Pool
        let res5 = await pool_mock.methods.init(_owner, 
                                                _cToken, 
                                                _feeFraction, 
                                                _feeBeneficiary, 
                                                _lockDuration, 
                                                _cooldownDuration).send({ from: accounts[0] });
        console.log('=== init() / addAdmin() - MCDAwarePool.sol ===\n', res5);   

        //@dev - Check Admin
        let res4 = await pool_mock.methods.isAdmin(_admin).call();
        console.log('=== isAdmin() ===\n', res4); 
    }

    addAdmin = async () => {
        const { accounts, web3, dai, pool_mock, reward_manager, POOlMOCK_ADDRESS, REWARD_MANAGER_ADDRESS } = this.state;

        /// Add a right of "Pool/Admin" to contract address of PoolMock.sol and RewardManager.sol
        //let res1 = await pool_mock.methods.addAdmin(POOlMOCK_ADDRESS).send({ from: accounts[0] });
        let res2 = await pool_mock.methods.addAdmin(REWARD_MANAGER_ADDRESS).send({ from: accounts[0] });
        //console.log('=== addAdmin() to PoolMock contract address ===\n', res1); 
        console.log('=== addAdmin() via addAdminRoleAddress in RewardManager.sol ===\n', res2); 
    }

    removeAdmin = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS, REWARD_MANAGER_ADDRESS } = this.state;

        /// Add a right of "Pool/Admin" to contract address of PoolMock.sol and RewardManager.sol
        //let res1 = await pool_mock.methods.removeAdmin(POOlMOCK_ADDRESS).send({ from: accounts[0] });
        let res2 = await pool_mock.methods.removeAdmin(REWARD_MANAGER_ADDRESS).send({ from: accounts[0] });
        //console.log('=== removeAdmin() to PoolMock contract address ===\n', res1); 
        console.log('=== removeAdmin() to RewardManager contract address ===\n', res2); 
    }

    openNextDraw = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        //@notice - Calculate secret hash
        const SALT = '0x1234123412341234123412341234123412341234123412341234123412341236';
        const SECRET = '0x1234123412341234123412341234123412341234123412341234123412341234';
        const SECRET_HASH = new Web3().utils.soliditySha3(SECRET, SALT);

        const _nextSecretHash = SECRET_HASH;

        //@dev - Open Pool
        let res3 = await pool_mock.methods._openNextDraw(_nextSecretHash).send({ from: accounts[0] });
        console.log('=== openNextDraw() ===\n', res3);          
    }

    _depositPool = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        const _depositAmount = web3.utils.toWei('0.15');

        //@dev - Deposit Pool
        let res1 = await dai.methods.approve(POOlMOCK_ADDRESS, _depositAmount).send({ from: accounts[0] });
        let res2 = await pool_mock.methods._depositPool(_depositAmount).send({ from: accounts[0] });
        console.log('=== depositPool() ===\n', res2); 
    }

    reward = async () => {
        const { accounts, web3, dai, pool_mock, prediction, reward_manager, oracle_manager, POOlMOCK_ADDRESS } = this.state;

        //@dev - Check Admin
        const _admin = walletAddressList["WalletAddress1"];
        let isAdmin1 = await pool_mock.methods.isAdmin(_admin).call();
        let isAdmin2 = await reward_manager.methods.isAdmin(_admin).call();
        console.log('=== isAdmin() - PoolMock.sol ===\n', isAdmin1);
        console.log('=== isAdmin() - RewardManager.sol ===\n', isAdmin2);

        /// Request result of game score to oracle
        let queryPrice = await oracle_manager.methods.getQueryPrice().call();
        let responseFromOracle = await oracle_manager.methods.oracleQueryScore().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQueryScore() ===\n', responseFromOracle);

        let _gameScore1 = responseFromOracle.events.OracleQueryScore.returnValues.gameScore1;
        let _gameScore2 = responseFromOracle.events.OracleQueryScore.returnValues.gameScore2;
        console.log('=== oracleQueryScore() ===\n', responseFromOracle);
        console.log('=== oracleQueryScore() ===\n', responseFromOracle);

        /// Select winner and distribute reward
        const SALT = '0x1234123412341234123412341234123412341234123412341234123412341236'
        const SECRET = '0x1234123412341234123412341234123412341234123412341234123412341234'

        /// Call the extendedReward method of RewardManager.sol directly
        let res1 = await pool_mock.methods.extendedReward(SECRET, SALT, _gameScore1, _gameScore2).send({ from: accounts[0] });
        console.log('=== extendedReward() - PoolMock.sol ===\n', res1);

        //let res2 = await pool_mock.methods.selectWinnerAndDistributeReward(SECRET, SALT, _gameScore1, _gameScore2).send({ from: accounts[0] });
        //console.log('=== reward() ===\n', res2);         
    }


    /***
     * @notice - The relevant prediction
     **/
    gameScorePrediction = async () => {
        const { accounts, web3, dai, pool_mock, prediction, POOlMOCK_ADDRESS } = this.state;

        const _userAddress = accounts[0];
        const _drawId = 1;
        const _query = "MLB/20190819/HOU-DET/1";
        const _gameScore1 = 5
        const _gameScore2 = 4

        let res = await prediction.methods.gameScorePrediction(POOlMOCK_ADDRESS,
                                                               _userAddress, 
                                                               _drawId,
                                                               _query,  /// i.e). "MLB/20190819/HOU-DET/1"
                                                               _gameScore1, 
                                                               _gameScore2).send({ from: accounts[0] });
        console.log('=== gameScorePrediction() ===\n', res);                
    }


    /***
     * @notice - Oracle by using Band-Protocol
     **/
    _getQueryPrice = async () => {
        const { accounts, web3, dai, oracle_manager } = this.state;

        let res = await oracle_manager.methods.getQueryPrice().call();
        console.log('=== getQueryPrice() ===\n', res); 
    }    

    _oracleQueryScore = async () => {
        const { accounts, web3, dai, oracle_manager } = this.state;

        let queryPrice = await oracle_manager.methods.getQueryPrice().call();
        let res = await oracle_manager.methods.oracleQueryScore().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQueryScore() ===\n', res); 
    }

    _oracleQuerySpotPrice = async () => {
        const { accounts, web3, dai, oracle_manager } = this.state;

        let queryPrice = await oracle_manager.methods.getQueryPrice().call();
        let res = await oracle_manager.methods.oracleQuerySpotPrice().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQuerySpotPrice() ===\n', res); 
    }


    /***
     * @dev - Getter function
     **/
    _getBasePool = async () => {
        const { accounts, web3, dai, poolToken_mock } = this.state;

        let res = await poolToken_mock.methods.getBasePool().call();
        console.log('=== getBasePool() ===\n', res);        
    }

    balanceOfUnderlying = async () => {
        const { accounts, web3, dai, pod_mock } = this.state;

        const _user = accounts[0];

        let res = await pod_mock.methods._balanceOfUnderlying(_user).call();
        console.log('=== _balanceOfUnderlying() ===\n', res);        
    }

    _balanceOfContract = async () => {
        const { accounts, web3, dai, prediction, pool_mock } = this.state;

        let res1 = await prediction.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() ===\n', res1);

        let res2 = await pool_mock.methods.balanceOfPoolMockContract().call();
        console.log('=== balanceOfPoolMockContract() - PoolMock.sol ===\n', res2);
    }

    /***
     * @dev - Test Functions
     **/
    _depositIntoTemporaryAccount = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        const _depositAmount = web3.utils.toWei('0.15');

        //@dev - Deposit Pool
        let res1 = await dai.methods.approve(POOlMOCK_ADDRESS, _depositAmount).send({ from: accounts[0] });
        let res2 = await pool_mock.methods.depositIntoTemporaryAccount(_depositAmount).send({ from: accounts[0] });
        console.log('=== depositIntoTemporaryAccount() ===\n', res2);         
    }

    _getCurrentOpenDrawId = async () => {
        const { accounts, web3, dai, prediction, pool_mock } = this.state;

        let res = await pool_mock.methods.getCurrentOpenDrawId().call();
        console.log('=== getCurrentOpenDrawId() ===\n', res);
    }

    _getCurrentDrawId = async () => {
        const { accounts, web3, dai, prediction, pool_mock, POOlMOCK_ADDRESS } = this.state;
        const _poolMock = POOlMOCK_ADDRESS;

        let res = await prediction.methods.getCurrentOpenDrawIdPredictionContract(_poolMock).call();
        console.log('=== getCurrentOpenDrawIdPredictionContract() ===\n', res);
    }

    timestampFromDate = async () => {
        const { accounts, web3, bokkypoobahs_datetime_contract } = this.state;

        const dateToTimestamp = await bokkypoobahs_datetime_contract.methods.timestampFromDate(2020, 5, 4).call();
        console.log('=== dateToTimestamp ===', dateToTimestamp);
    }


    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceStakeholderRegistry) => {
        if (instanceStakeholderRegistry) {
          //console.log('refreshValues of instanceStakeholderRegistry');
        }
    }


    //////////////////////////////////// 
    ///// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
            this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
            return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let Prediction = {};
        let RewardManager = {};
        let OracleManager = {};
        let PodMock = {};        
        let PoolMock = {};
        let PoolTokenMock = {};
        let Dai = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          Prediction = require("../../../../build/contracts/Prediction.json");
          RewardManager = require("../../../../build/contracts/RewardManager.json");
          OracleManager = require("../../../../build/contracts/OracleManager.json");
          PodMock = require("../../../../build/contracts/PodMock.json");
          PoolMock = require("../../../../build/contracts/PoolMock.json");
          PoolTokenMock = require("../../../../build/contracts/PoolTokenMock.json");
          Dai = require("../../../../build/contracts/IERC20.json");               //@dev - DAI（Underlying asset）
          BokkyPooBahsDateTimeContract = require("../../../../build/contracts/BokkyPooBahsDateTimeContract.json");   //@dev - BokkyPooBahsDateTimeContract.sol (for calculate timestamp)
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            // Create instance of contracts
            let instancePrediction = null;
            let deployedNetwork = null;
            let PREDICTION_ADDRESS = Prediction.networks[networkId.toString()].address;
            if (Prediction.networks) {
              deployedNetwork = Prediction.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePrediction = new web3.eth.Contract(
                  Prediction.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instancePrediction ===', instancePrediction);
              }
            }

            // Create instance of contracts
            let instanceRewardManager = null;
            let deployedNetworkRewardManager = null;
            let REWARD_MANAGER_ADDRESS = RewardManager.networks[networkId.toString()].address;
            if (RewardManager.networks) {
              deployedNetworkRewardManager = RewardManager.networks[networkId.toString()];
              if (deployedNetworkRewardManager) {
                instanceRewardManager = new web3.eth.Contract(
                  RewardManager.abi,
                  deployedNetworkRewardManager && deployedNetworkRewardManager.address,
                );
                console.log('=== instanceRewardManager ===', instanceRewardManager);
              }
            }
 
            // Create instance of contracts
            let instanceOracleManager = null;
            let deployedNetworkOracleManager = null;
            let ORACLE_MANAGER_ADDRESS = OracleManager.networks[networkId.toString()].address;
            if (OracleManager.networks) {
              deployedNetworkOracleManager = OracleManager.networks[networkId.toString()];
              if (deployedNetworkOracleManager) {
                instanceOracleManager = new web3.eth.Contract(
                  OracleManager.abi,
                  deployedNetworkOracleManager && deployedNetworkOracleManager.address,
                );
                console.log('=== instanceOracleManager ===', instanceOracleManager);
              }
            }

            // Create instance of contracts
            let instancePodMock = null;
            let deployedNetworkPodMock = null;
            if (PodMock.networks) {
              deployedNetworkPodMock = PodMock.networks[networkId.toString()];
              if (deployedNetworkPodMock) {
                instancePodMock = new web3.eth.Contract(
                  PodMock.abi,
                  deployedNetworkPodMock && deployedNetworkPodMock.address,
                );
                console.log('=== instancePodMock ===', instancePodMock);
              }
            }

            // Create instance of contracts
            let instancePoolMock = null;
            let deployedNetworkPoolMock = null;
            let POOlMOCK_ADDRESS = PoolMock.networks[networkId.toString()].address;
            if (PoolMock.networks) {
              deployedNetworkPoolMock = PoolMock.networks[networkId.toString()];
              if (deployedNetworkPoolMock) {
                instancePoolMock = new web3.eth.Contract(
                  PoolMock.abi,
                  deployedNetworkPoolMock && deployedNetworkPoolMock.address,
                );
                console.log('=== instancePoolMock ===', instancePoolMock);
              }
            }

            // Create instance of contracts
            let instancePoolTokenMock = null;
            let deployedNetworkPoolTokenMock = null;
            if (PoolTokenMock.networks) {
              deployedNetworkPoolTokenMock = PoolTokenMock.networks[networkId.toString()];
              if (deployedNetworkPoolTokenMock) {
                instancePoolTokenMock = new web3.eth.Contract(
                  PoolTokenMock.abi,
                  deployedNetworkPoolTokenMock && deployedNetworkPoolTokenMock.address,
                );
                console.log('=== instancePoolTokenMock ===', instancePoolTokenMock);
              }
            }

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let DAI_ADDRESS = tokenAddressList["Kovan"]["DAI"]; //@dev - DAI（on Kovan）
            instanceDai = new web3.eth.Contract(
              Dai.abi,
              DAI_ADDRESS,
            );
            console.log('=== instanceDai ===', instanceDai);

            //@dev - Create instance of BokkyPooBahsDateTimeContract.sol
            let instanceBokkyPooBahsDateTimeContract = null;
            let BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS = contractAddressList["Kovan"]["BokkyPooBahsDateTimeLibrary"]["BokkyPooBahsDateTimeContract"];  // IdleDAI (on Kovan)
            instanceBokkyPooBahsDateTimeContract = new web3.eth.Contract(
              BokkyPooBahsDateTimeContract.abi,
              BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS,
            );
            console.log('=== instanceBokkyPooBahsDateTimeContract ===', instanceBokkyPooBahsDateTimeContract);


            if (Prediction || PodMock || PoolMock || PoolTokenMock || Dai || BokkyPooBahsDateTimeContract) {
              // Set web3, accounts, and contract to the state, and then proceed with an
              // example of interacting with the contract's methods.
              this.setState({ 
                web3, 
                ganacheAccounts, 
                accounts, 
                balance, 
                networkId, 
                networkType, 
                hotLoaderDisabled,
                isMetaMask, 
                prediction: instancePrediction,
                reward_manager: instanceRewardManager,
                oracle_manager: instanceOracleManager,
                pod_mock: instancePodMock,
                pool_mock: instancePoolMock,
                poolToken_mock: instancePoolTokenMock,
                dai: instanceDai,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                PREDICTION_ADDRESS: PREDICTION_ADDRESS,
                REWARD_MANAGER_ADDRESS: REWARD_MANAGER_ADDRESS,
                ORACLE_MANAGER_ADDRESS: ORACLE_MANAGER_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
                POOlMOCK_ADDRESS: POOlMOCK_ADDRESS
              }, () => {
                this.refreshValues(
                  instancePrediction
                );
                setInterval(() => {
                  this.refreshValues(instancePrediction);
                }, 5000);
              });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }


    render() {
        const { accounts, prediction } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <h4>PoolTogether with Sports Event Prediction</h4>
                    </Grid>

                    <Grid item xs={6}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Admin</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.initPool}> Init Pool </Button> <br />


                            <Button size={'small'} mt={3} mb={2} onClick={this.openNextDraw}> Open Next Draw </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.reward}> Distribute Reward from Pool </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Test Functions for Oracle (Band-Protocol)</h4>
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getQueryPrice}> Get QueryPrice </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._oracleQueryScore}> Oracle QueryScore of Sports </Button> <br />

                            <hr /><br />

                            <h4>Test Functions for PoolTogether</h4> <br />
                            <Button size={'small'} mt={3} mb={2} onClick={this._initPoolToken}> Init PoolToken </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.addAdmin}> Add Admin right </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.removeAdmin}> Remove Admin right </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._depositIntoTemporaryAccount}> Deposit Into Temporary Account </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getCurrentOpenDrawId}> Get Current Open DrawId </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getBasePool}> Get BasePool </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.balanceOfUnderlying}> Balance Of Underlying </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._balanceOfContract}> Balance of contract </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getCurrentDrawId}> Get Current DrawId in PredictionContract </Button> <br />

                            <hr />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.timestampFromDate}> Timestamp From Date </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={6}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>User</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.gameScorePrediction}> Game Score Prediction </Button> <br />                        

                            <Button size={'small'} mt={3} mb={2} onClick={this._depositPool}> Deposit Pool </Button> <br />
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
