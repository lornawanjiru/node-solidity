//standard library built into the node. its used in making assertions about tests 
const { strictEqual } = require('assert');
const assert = require('assert');
const ganache = require('ganache-cli');
//whn working with constructor functions we have to capitalize the first letter of the name.
const Web3 = require('web3');
// The web that starts with a small w is a instance.
 const web3 = new Web3(ganache.provider());
 const {abi, bytecode} = require('../compile');
 
// Testing concept with Mocha
//   class Car{
//       park(){
//           return 'stopped';
//       }
//       drive(){
//           return 'vroom';
//       }
//   }
//   let car ;

//   beforeEach (()=>{
//     car = new Car();
//   })
//   describe ('Car', ()=>{
//       it('can park', () =>{
          
//           assert.equal(car.park(), 'stopped');
//       });
//       it('can drive', () =>{
          
//           assert.equal(car.drive(), 'vroom')
//       })
//   });


let accounts ;
let inbox ;
beforeEach(async ()=>{
    //Get a list of all accounts.
    accounts = await web3.eth.getAccounts()
     
 //Use one of those accounts to deploy the contract
 //The first line we see that the constructor Contract is passing the ABI as interface. 
  inbox = await new web3.eth.Contract((abi))
  //Tells web3 that we want to deploy a new copy of this contract  
      .deploy({data:bytecode, arguments:['Hi there!']})
      .send ({from:accounts[0], gas: '1000000'})

});

describe('Inbox', ()=> {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address); 
    } );

    it('has a default message', async() =>{
        let message = await inbox.methods.message().call();
        assert.equal(message,'Hi there!');
    }) 
    it('can change the message', async()=> {
         await inbox.methods.setMessage('bye').send({ from: accounts[0]});
         const message = await inbox.methods.message().call();
         assert.equal(message, 'bye'); 
    })
})
