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
        const _pool = tokenAddressList["Kovan"]["PoolTogether"]["PoolDai"];  // MCDAwarePool.sol

        let res = await poolToken_mock.methods.initPoolToken(_name, _symbol, _defaultOperators, _pool).send({ from: accounts[0] });
        console.log('=== initPoolToken() ===\n', res);           
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
        const { accounts, web3, dai, poolTogether_nybw } = this.state;

        let res1 = await poolTogether_nybw.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() ===\n', res1);
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
        let PoolTokenMock = {};
        let Dai = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          PoolTogetherNYBW = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
          PodMock = require("../../../../build/contracts/PodMock.json");
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


            if (PoolTogetherNYBW || PodMock || PoolTokenMock || Dai || BokkyPooBahsDateTimeContract) {
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
                poolToken_mock: instancePoolTokenMock,
                dai: instanceDai,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                POOlTOGETHER_NYBW_ADDRESS: POOlTOGETHER_NYBW_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
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
