# PoolTogether NYBW Hack 2020

***
## 【Introduction of PoolTogether NYBW Hack 2020】
- This is a dApp

&nbsp;

## 【User Flow】
- ① 
- ②
- ③
- ④

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
1. Move to `./client`
```
$ cd client
```

2. Add an `.env` file under the directory of `./client`.
```
$ cp .env.example .env
```

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
- [PoolTogether]：  
  - Bounty of "Best PoolTogether Project" at Gitcoin   
    https://gitcoin.co/issue/pooltogether/pooltogether-contracts/30/4308

  - Repos  
    - pooltogether-contracts  
      https://github.com/pooltogether/pooltogether-contracts  
    - pods  
      https://github.com/pooltogether/pods  
    - pooltogether-contracts-mock  
      https://github.com/pooltogether/pooltogether-contracts-mock  
    - pooltogether.js  
      https://github.com/pooltogether/pooltogetherjs  

  - Article abount "v2"  
    https://medium.com/pooltogether/inside-pooltogether-v2-0-e7d0e1b90a08
