//standard library built into the node. its used in making assertions about tests 
const assert = require('assert');
const ganache = require('ganache-cli');
//whn working with constructor functions we have to capitalize the first letter of the name.
const Web3 = require('web3');
// The web that starts with a small w is a instance.
 const web3 = new Web3(ganache.provider());
 const {abi, bytecode} = require('../compile');

let accounts ;
let lottery ;
beforeEach(async ()=>{
    //Get a list of all accounts.
    accounts = await web3.eth.getAccounts()
     
 //Use one of those accounts to deploy the contract
 //The first line we see that the constructor Contract is passing the ABI as interface. 
  lottery = await new web3.eth.Contract((abi))
  //Tells web3 that we want to deploy a new copy of this contract  
      .deploy({data:bytecode})
      .send ({from:accounts[0], gas: '1000000'})

});

describe('Lottery', ()=> {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address); 
    } );
   it('allows one account to enter', async ()=>{
       await lottery.methods.enter().send({
           from:accounts[0], value:web3.utils.toWei('0.02', 'ether')
       });
       const players = await lottery.methods.getPlayers().call({
           from:accounts[0]
       });
       assert.equal(accounts[0], players[0]);
       assert.equal(1,players.length)
   })
   it('allows multiple accounts to enter', async ()=>{
    await lottery.methods.enter().send({
        from:accounts[0], value:web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
        from:accounts[1], value:web3.utils.toWei('0.02', 'ether')
     });
     await lottery.methods.enter().send({
         from:accounts[2], value:web3.utils.toWei('0.02', 'ether')
     });
    const players = await lottery.methods.getPlayers().call({
        from:accounts[0]
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3,players.length)
    })
    it('only manager can call pickWinner', async () =>{
        try{
            await lottery.methods.pickWinner().send({
              from: accounts[1]  
            });
            assert(false);
        }
        catch(err){
            assert(err);
        }
    })
    

  
})
