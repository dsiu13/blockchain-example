const SHA256 = require('crypto-js/sha256');

// index - where block sits on chain
// timestamp - when block was created
// data associated with the block. Amount of $, sender, reciever etc
// prevHash - string that contains the hash of the previous one

class Block {
  constructor(index, timestamp, data, prevHash=''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = '';
  }

  genHash(){
    return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
  }

};

class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock];
  }

  createGenesisBlock(){
    return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getPrevBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.prevHash = this.getPrevBlock().hash;
    newBlock.hash = newBlock.genHash();
    this.chain.push(newBlock);
  }

  isValid(){
    for(let i=1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.genHash() || currentBlock.prevHash !== prevBlock.hash){
        return false;
      } else {
        return true;
      }
    };
  };

}; // class Blockchain

let testCoin = new Blockchain();
testCoin.addBlock(new Block(1, "1/12/2017", {amount: 8}));
testCoin.addBlock(new Block(2, "1/20/2017", {amount: 16}));
testCoin.addBlock(new Block(3, "1/23/2017", {amount: 32}));

// console.log(JSON.stringify(testCoin, null, 4));

console.log("is valid: " + testCoin.isValid());
