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
    this.nonce = 0;
  }

  genHash(){
    return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(diff){
    while(this.hash.substring(0, diff) !== Array(diff + 1).join("0")){
      this.nonce++;
      this.hash = this.genHash();
    }
    console.log("Block Mined: " + this.hash);
  }

};

class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock];
    this.diff = 8;
  }

  createGenesisBlock(){
    return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getPrevBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.prevHash = this.getPrevBlock().hash;
    newBlock.mineBlock(this.diff);
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
testCoin.addBlock(new Block(1, "2/2/2017", {amount: 8}));
testCoin.addBlock(new Block(2, "4/20/2017", {amount: 16}));
testCoin.addBlock(new Block(3, "8/08/2017", {amount: 32}));
