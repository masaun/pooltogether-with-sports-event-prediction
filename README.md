# PoolTogether with Sports Event Lottery

***
## 【Introduction of PoolTogether with Sports Game Score Lottery】
- This is a dApp which integrates PoolTogether with sport event oracle
  - User predict sports game score at the gameday.
  - Winner is selected in participants who prediction of sports game score is right.
  - Target of prediction is professional sports games (MLB, EPL, NFL, NBA).

&nbsp;

## 【Flow】
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


### Setup frontend（※ In progress）
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
http://127.0.0.1:3000/pooltogether-nybw-hack-2020
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

<br>

- [Band-Protocol]
  - How to create instance of Oracle
    https://developer.bandprotocol.com/devs/data-query.html

  - Sport Events Oracle (Kovan) 
    https://developer.bandprotocol.com/datasets/sport-kovan.html

