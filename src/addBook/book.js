import React, { useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import ContractABI from "../ABI/abi.json";
import EthUtil from 'ethereumjs-util';

const web3 = new Web3(Web3.givenProvider);

const contractAddress = "0xb6FdC3e3B015e94BF050e2FaDDA1E47226167ea0";
const contractABI = ContractABI;
const contract = new web3.eth.Contract(contractABI, contractAddress);

function Book() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  
  async function handleSubmit(event) {
  event.preventDefault();
  

  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  const account = web3.eth.accounts.wallet.add("0d7b5ae50bb85ee4e096990708999d618b5c00068ef29cfbbf92e6d53db6c308");

  const nonce = await web3.eth.getTransactionCount(from, "latest"); 
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 3000000;

  const tx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    from: from,
    to: contractAddress,
    data: contract.methods.addBook(title, author, description).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
  const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Book added: ${title} by ${author}`);
  console.log(sentTx);
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default Book;
