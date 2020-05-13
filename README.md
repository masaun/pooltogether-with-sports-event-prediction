# Social Impact Bond for developing vaccines of COVID19

***
## 【Introduction of Social Impact Bond for developing vaccines of COVID19】
- This is a dApp of Social Impact Bond for developing vaccines of COVID19
  - This dApp aim to support institution which try to develop vaccines of COVID19 by structure of Social Impact Bond.

&nbsp;

## 【User Flow】
- ① Institutions of developing vaccines set (define) a `objective for evaluation` .
  - Estimated budget amount
  - Requested budget amount
  - `Objective of saving cost` （=Substract `requested budget amount` from `estimated budget amount` ）
  - start date & end date of developing vaccines
    etc,...


- ② Government stake funds which is equal to `"estimated budget amount"` above
  - Staked amount are lended to `idle.finance`

<br>

- ③ Investors invest funds for institutions of developing vaccines as investment of principal
  （Maximum invested amount is until `"requested budget amount"` above）

- ④ Evaluate outcome of institution towards objective.
  - If outcome of institution is achieved to objective, staked funds from government is disributed to investors. (Investors receieve `investment of principal amount` and `interest amount` )
    - `Investment of principal amount` is amount which is divided that interest amount by number of investors.
    - `Interest amount` is amount which is redeemed from `idle.finance` and divided that interest amount by number of investors.

  - If outcome of institution is not achieved to objective, staked funds is refund to government.

&nbsp;

***

## 【Setup】
### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
Kovan Test Network
```

&nbsp;


### Setup backend
1. Deploy contracts to Kovan Test Network
```
(root directory)

$ npm run migrate:Kovan
```

&nbsp;


### Setup frontend
1. Add an `.env` file under the directory of `./client`.

2. Add `SKIP_PREFLIGHT_CHECK=true` to an `.env` file under the directory of `./client`.    
（Recommend to reference from `./client/.env.example`）

3. Execute command below in root directory.
```
$ npm run client
```

4. Access to browser by using link 
```
http://127.0.0.1:3000/idle-insurance-fund
```

&nbsp;


***

## 【References】
- [Social Impact Bond]
  - https://medium.com/bhpn-crosswalk/what-to-make-of-social-impact-bonds-f2274210235c#.sl2ipi49w
  - https://www.thestandard.com.hk/breaking-news/section/3/117016/Pay-for-Success-for-the-Success-of-Social-Innovation-in-Hong-Kong
  - http://healthmovement.eu/service/health-impact-bonds/


<br>

- [idle.finance]
  - https://idle.finance/#/
  - https://developers.idle.finance/
  - https://github.com/bugduino/idle-contracts

<br>

- [Gnosis / Contract Proxy Kit (CPK)]
  - https://explorer.bounties.network/bounty/3937
  - https://github.com/gnosis/contract-proxy-kit
  - https://github.com/gnosis/safe-demo (Truffle box📦)
  - https://docs.gnosis.io/safe/docs/sdks_cpk/
  - https://docs.gnosis.io/safe/docs/cpktutorial1/
