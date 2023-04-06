import React, { useEffect, useState } from 'react';
import './addBook-style.css';
import initWeb3 from '../web3/connector';
import Web3 from 'web3';
import contractABI from '../ABI/abi.json'; 
import { json, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { InfuraProvider } from '@ethersproject/providers';


const initialState ={
    "title": '',
    "author": '',
    "description": ''
    
}


const web3 = new Web3(Web3.givenProvider);

const contractAddress = "0x805324ab71EeCDB59f88203d79c7C1e37169783a";
const contract = new web3.eth.Contract(contractABI, contractAddress);

function AddBook() {
  const [data, setData] = useState(initialState);
  const [books, setBooks] = useState([]);
  const { state } = useLocation();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function getBooks() {
      const contractAddress = '0x805324ab71EeCDB59f88203d79c7C1e37169783a';

      const web3 = new Web3('https://goerli.infura.io/v3/376e00cbb0684049bfc81287c741e84e');
      const networkId = await web3.eth.net.getId();
      // Create a contract instance for the deployed contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const  getBookCount = async () => {
          const count = await contract.methods.bookCount().call();
          console.log(count);
      }
      const count = await contract.methods.bookCount().call();
      const bookPromises = [];
      for (let i = 0; i < count; i++) {
        bookPromises.push(contract.methods.getBook(i).call());
      }
      const bookData = await Promise.all(bookPromises);
      setBooks(bookData);
    }  
    getBooks();
  }, [books]);

    
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
  
  const onChange = (e) => { 
    setData({
            ...data,
            [e.target.name]: e.target.value
        })
  };

  return (
    <div className='container'>
      <div className='top-nav'>
        <h1>eNova - Publisher</h1>
        <h3>MetaMask Address: {state.metaMaskAddress}</h3>
      </div>
      <h4></h4>
      <div className='bottom-part'>
      <form onSubmit={handleSubmit} className='form'>
        <div className='title'>Create a new publication</div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title" 
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className=''>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author" 
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description" 
            name="description"
            value={description}
            onChange={(e) =>  setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Book</button>

        

      </form>
      <div className='publications'>

         <div className='title'> My Publications</div>
         <div className="books">
          {books.map((book, index) => (
            <div className="book" key={index}>
              <h2>{book[0]} asdasd</h2>
              <p>{book[1]}</p>
              <p>{book[2]}</p>
            </div>
          ))}
        </div>
      </div>
      
      </div>
    </div>
  );
}

export default AddBook;