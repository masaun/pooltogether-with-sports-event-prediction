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


export default class PoolTogetherNYBW extends Component {
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
        this._openNextDraw = this._openNextDraw.bind(this);
        this._depositPool = this._depositPool.bind(this);
        this.reward = this.reward.bind(this);

        /////// Oracle by using Band-Protocol
        this._getQueryPrice = this._getQueryPrice.bind(this);
        this._oracleQuerySpotPrice = this._oracleQuerySpotPrice.bind(this);
        this._oracleQuerySpotPriceWithExpiry = this._oracleQuerySpotPriceWithExpiry.bind(this);
        this._oracleQueryScore = this._oracleQueryScore.bind(this);

        /////// Getter Functions
        this._getBasePool = this._getBasePool.bind(this);
        this.balanceOfUnderlying = this.balanceOfUnderlying.bind(this);
        this._balanceOfContract = this._balanceOfContract.bind(this);

        /////// Test Functions
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

        const _owner = walletAddressList["WalletAddress1"];
        const _cToken = tokenAddressList["Kovan"]["cDAI"];
        const _feeFraction = web3.utils.toWei('0.1');
        const _feeBeneficiary = walletAddressList["WalletAddress1"];
        const _lockDuration = 55;
        const _cooldownDuration = 90;
        const _admin = walletAddressList["WalletAddress1"];
 
        //@dev - Init Pool
        let res5 = await pool_mock.methods.init(_owner, _cToken, _feeFraction, _feeBeneficiary, _lockDuration, _cooldownDuration).send({ from: accounts[0] });
        console.log('=== init() / addAdmin() - MCDAwarePool.sol ===\n', res5);   

        //@dev - Check Admin
        let res4 = await pool_mock.methods.isAdmin(_admin).call();
        console.log('=== isAdmin() ===\n', res4); 
    }

    _openNextDraw = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        //@notice - Calculate secret hash
        const SALT = '0x1234123412341234123412341234123412341234123412341234123412341236';
        const SECRET = '0x1234123412341234123412341234123412341234123412341234123412341234';
        const SECRET_HASH = new Web3().utils.soliditySha3(SECRET, SALT);

        const _nextSecretHash = SECRET_HASH;

        //@dev - Open Pool
        let res3 = await pool_mock.methods.openNextDraw(_nextSecretHash).send({ from: accounts[0] });
        console.log('=== openNextDraw() ===\n', res3);          
    }

    _depositPool = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        const _depositAmount = web3.utils.toWei('0.15');

        //@dev - Deposit Pool
        let res6 = await dai.methods.approve(POOlMOCK_ADDRESS, _depositAmount).send({ from: accounts[0] });
        let res2 = await pool_mock.methods._depositPool(_depositAmount).send({ from: accounts[0] });
        console.log('=== depositPool() ===\n', res2); 
    }

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    _getQueryPrice = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        let res = await pool_mock.methods.getQueryPrice().call();
        console.log('=== getQueryPrice() ===\n', res); 
    }    

    _oracleQuerySpotPrice = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        let queryPrice = await pool_mock.methods.getQueryPrice().call();
        let res = await pool_mock.methods.oracleQuerySpotPrice().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQuerySpotPrice() ===\n', res); 
    }    

    _oracleQuerySpotPriceWithExpiry = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        let queryPrice = await pool_mock.methods.getQueryPrice().call();
        let res = await pool_mock.methods.oracleQuerySpotPriceWithExpiry().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQuerySpotPriceWithExpiry() ===\n', res); 
    }

    _oracleQueryScore = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        let queryPrice = await pool_mock.methods.getQueryPrice().call();
        let res = await pool_mock.methods.oracleQueryScore().send({ from: accounts[0], value: queryPrice });
        console.log('=== oracleQueryScore() ===\n', res); 
    }

    reward = async () => {
        const { accounts, web3, dai, pool_mock, POOlMOCK_ADDRESS } = this.state;

        const SALT = '0x1234123412341234123412341234123412341234123412341234123412341236'
        const SECRET = '0x1234123412341234123412341234123412341234123412341234123412341234'

        //@dev - Withdraw DAI from Pool
        let res = await pool_mock.methods._reward(SECRET, SALT).send({ from: accounts[0] });
        console.log('=== rewardAndOpenNextDraw() ===\n', res);         
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
        const { accounts, web3, dai, poolTogether_nybw, pool_mock } = this.state;

        let res1 = await poolTogether_nybw.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() ===\n', res1);

        let res2 = await pool_mock.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() - PoolMock.sol ===\n', res2);
    }

    /***
     * @dev - Test Functions
     **/
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
     
        let PoolTogetherNYBW = {};
        let PodMock = {};        
        let PoolMock = {};
        let PoolTokenMock = {};
        let Dai = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          PoolTogetherNYBW = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
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
            let instancePoolTogetherNYBW = null;
            let deployedNetwork = null;
            let POOlTOGETHER_NYBW_ADDRESS = PoolTogetherNYBW.networks[networkId.toString()].address;
            if (PoolTogetherNYBW.networks) {
              deployedNetwork = PoolTogetherNYBW.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePoolTogetherNYBW = new web3.eth.Contract(
                  PoolTogetherNYBW.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instancePoolTogetherNYBW ===', instancePoolTogetherNYBW);
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


            if (PoolTogetherNYBW || PodMock || PoolMock || PoolTokenMock || Dai || BokkyPooBahsDateTimeContract) {
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
                poolTogether_nybw: instancePoolTogetherNYBW,
                pod_mock: instancePodMock,
                pool_mock: instancePoolMock,
                poolToken_mock: instancePoolTokenMock,
                dai: instanceDai,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                POOlTOGETHER_NYBW_ADDRESS: POOlTOGETHER_NYBW_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
                POOlMOCK_ADDRESS: POOlMOCK_ADDRESS
              }, () => {
                this.refreshValues(
                  instancePoolTogetherNYBW
                );
                setInterval(() => {
                  this.refreshValues(instancePoolTogetherNYBW);
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
        const { accounts, poolTogether_nybw } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>PoolTogether NYBW Hack 2020</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._initPoolToken}> Init PoolToken </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.initPool}> Init Pool </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._openNextDraw}> Open Next Draw </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._depositPool}> Deposit Pool </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.reward}> Distribute Reward from Pool </Button> <br />

                            <hr />

                            <Button size={'small'} mt={3} mb={2} onClick={this._getQueryPrice}> Get QueryPrice </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._oracleQuerySpotPrice}> Oracle QuerySpotPrice </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._oracleQuerySpotPriceWithExpiry}> Oracle QuerySpotPriceWithExpiry </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._oracleQueryScore}> Oracle QueryScore of Sports </Button> <br />

                            <hr />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getBasePool}> Get BasePool </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.balanceOfUnderlying}> Balance Of Underlying </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._balanceOfContract}> Balance of contract </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Test Functions</h4> <br />
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.timestampFromDate}> Timestamp From Date </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
