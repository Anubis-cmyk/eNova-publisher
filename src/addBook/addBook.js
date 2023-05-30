import React, { useEffect, useState } from 'react';
import './addBook-style.css';
import initWeb3 from '../web3/connector';
import Web3 from 'web3';
import contractABI from '../ABI/abi.json'; 
import { json, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { InfuraProvider } from '@ethersproject/providers';
import ClockLoader from "react-spinners/ClockLoader";

/**
 * initial stae for book
 */
const initialState ={
    "title": '',
    "author": '',
    "description": ''  
} 

/**
 * web3 assets
 */
const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0xa3f4c07cB198758e2474c2F1372239b2d4F90D13";
const contract = new web3.eth.Contract(contractABI, contractAddress);

/**
 * Publisher page
 * @returns 
 */
function AddBook() {
  const [data, setData] = useState(initialState);
  const [books, setBooks] = useState([]);
  const { state } = useLocation();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookIndex, setbookIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Get all books from the blockchain
   * @returns <Books>
   */
  useEffect(() => {
    async function getBooks() {
      const contractAddress = '0xa3f4c07cB198758e2474c2F1372239b2d4F90D13';

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

    
  /**
   * Add a new book to the blockchain
   * @param {*} event 
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoaded(true);
    

    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];

    const account = web3.eth.accounts.wallet.add("0d7b5ae50bb85ee4e096990708999d618b5c00068ef29cfbbf92e6d53db6c308");

    const nonce = await web3.eth.getTransactionCount(from, "latest"); 
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
    console.log("gast price",gasPrice , "gas limit", gasLimit ,"gas",gasPrice*gasLimit)
  

    const tx = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      from: from,
      to: contractAddress,
      data: contract.methods.addBook(title, author, description).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((receipt) => {
      console.log(receipt);
      alert(`Book added: ${title} by ${author}`);
    }).catch((error) => {
      console.log(error);
      alert(`Book added fail ! Error code : ${error.code} , Error ${error.message}`);
    });

    console.log(`Book added: ${title} by ${author}`);
    console.log(sentTx);
    setIsLoaded(false);
  }
  
  

  /**
   * Delete a book from the blockchain
   * @param {*} index 
   */
  const handleDeleteBook = async (index) => {
    setIsLoaded(true);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
  
    const account = web3.eth.accounts.wallet.add(
      "0d7b5ae50bb85ee4e096990708999d618b5c00068ef29cfbbf92e6d53db6c308"
    );
  
    const nonce = await web3.eth.getTransactionCount(from, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 8000000;
  
    const tx = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      from: from,
      to: contractAddress,
      data: contract.methods.deleteBook(index).encodeABI(), // Assuming there's a deleteBook function in your smart contract
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      account.privateKey
    );
    const sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    ).then((receipt) => {
      console.log(receipt);
      alert(`Book deleted at index: ${index}`);
    }).catch((error) => {
      console.log(error);
      alert(`Book deleted fail ! Error code : ${error.code} , Error ${error.message}`);
    });
    console.log(sentTx);
  
    // After deleting the book, you can update the books state to remove the deleted book
    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks];
      updatedBooks.splice(index, 1);
      return updatedBooks;
    });
    setIsLoaded(false); 
  };

  /**
   * Update a book details
   */
  const handleUpdateBookDetails = async () => {
    setIsLoaded(true);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
  
    const account = web3.eth.accounts.wallet.add(
      "0d7b5ae50bb85ee4e096990708999d618b5c00068ef29cfbbf92e6d53db6c308"
    );
  
    const nonce = await web3.eth.getTransactionCount(from, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 8000000;
  
    const tx = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      from: from,
      to: contractAddress,
      data: contract.methods.updateBook(bookIndex, title, author, description).encodeABI(),
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((receipt) => {
      console.log(receipt);
      alert(`Book details updated at index: ${bookIndex}`);
    }).catch((error) => {
      console.log(error);
      alert(`Book added fail ! Error code : ${error.code} , Error ${error.message}`);
    });
  
   
    console.log(sentTx);
  
    // Update the books state to reflect the updated details
    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks];
      updatedBooks[bookIndex] = [title, author, description];
      return updatedBooks;
    });
    setIsModalOpen(false);
    setTitle("");
    setAuthor("");
    setDescription("");
    setbookIndex(0);
    setIsLoaded(false); 


  };

  /**
   * Set the book details to the form
   * @param {*} book 
   * @param {*} index 
   */
  const setEditValue = (book,index) => {
    setTitle(book[0]);
    setAuthor(book[1]);
    setDescription(book[2]);
    setbookIndex(index);
    setIsModalOpen(true);
  };


  return (
    <div className='container'>
      {isLoaded&&
        <div className='loader'>
          <ClockLoader
            color="#ffffff"
            cssOverride={{}}
            size={200}
            speedMultiplier={1}
          />
          <p className='loading-text-heading'>eNova - Publisher</p>
          <p className='loading-text'>Please wait trasaction processing ...</p>
        </div>}
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
        {
          isModalOpen ? (
            <button type="button" onClick={()=> handleUpdateBookDetails()}>Edit Book</button>
          ) :(
            <button type="submit">Add Book</button>
          )
        }
        

      </form>
      <div className='publications'>
         <div className='title'> My Publications</div>
         <div className="books">
          {books.map((book, index) => (
            <div className="book" key={index}>
              <div className='book-top'>
                <div className='btn-row'>
                  <button className='edit-btn' onClick={() => setEditValue(book,index)}>
                    <img className='edit-img' src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"/>
                  </button>
                  <button className='delete-btn' onClick={() => handleDeleteBook(index)}>
                    X
                  </button>
                </div>
                <div className='book-data'>
                  <h2>Title : {book[0]}</h2>
                  <p>Author : {book[1]}</p>
                  <p>Descrition :  {book[2]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      </div>
    </div>
  );
}

export default AddBook;