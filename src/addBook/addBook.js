import React, { useEffect, useState,useRef } from 'react';
import './addBook-style.css';
import initWeb3 from '../web3/connector';
import Web3 from 'web3';
import contractABI from '../ABI/abi.json'; 
import {useLocation,useNavigate } from 'react-router-dom'; 
import ClockLoader from "react-spinners/ClockLoader";
import GridLoader from "react-spinners/GridLoader";
import sampleBookCover from '../asset/book-cover-placeholder.png'
import MetamaskLogo from '../asset/MetaMask_Fox.svg.png'
import UserIcon from '../asset/icon-4399701_960_720.webp'
import axios from 'axios';
import { APPURL } from '../constant/const';

/**
 * initial stae for book
 */
const initialState ={
    "title": '',
    "author": '',
    "description": '',
    "imageUrl": ''  
} 

/**
 * web3 assets
 */
const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x0b7fC760E92Eb498f1dCDF1C0856c7c256c360fE";
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
  const [image, setImage] = useState(sampleBookCover);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookIndex, setbookIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const cloudinaryRef = useRef();
  const imageRef = useRef();
  const navigate = useNavigate();

  /**
   * Upload image to cloudinary
   */
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    imageRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'sgcreation',
      uploadPreset: 'enova_reader',
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        setImage(result.info.url);
        console.log(image);
      }else{
        console.log(error);
      }})
  }, []);

  /**************************************************************************************
   *********************************** WEB 2 ********************************************
   **************************************************************************************/

   useEffect(() => {
    if (state.service == 'web2') {
        axios.get(`${APPURL}/book/getBooks`).then((res) => {
          console.log(res.data);
          setBooks(res.data);
        }).catch((err) => {
          console.log(err);
        });

      }
    },[]);
   /**
    * Add book to the database
    * @param {*} title 
    * @param {*} author 
    * @param {*} description 
    * @param {*} image 
    * @returns 
    */
  const addBookWeb2 = async () => {
    const newBook = {
      title: title,
      author: author,
      description: description,
      imageUrl: image
    };
    axios.post(`${APPURL}/book/addBook`, newBook).then((res) => {
      console.log(res.data);
      alert(`Book added: ${title} by ${author}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Update book details in the database
   * @param {*} title 
   * @param {*} author 
   * @param {*} description 
   * @param {*} image 
   */
  const updateBookWeb2 = async () => {
    const book = {
      title: title,
      author: author,
      description: description,
      imageUrl: image
    };
    axios.patch(`${APPURL}/book/updateBook`, book).then((res) => {
      console.log(res.data);
      alert(`Book updated: ${title} by ${author}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Delete book from the database
   * @param {*} index
   * @returns
   */
  const deleteBookWeb2 = async (id) => { 
    axios.get(`${APPURL}/book/deleteBook/`+id).then((res) => {
      console.log(res.data);
      alert(`Book deleted at index: ${id}`);
    }).catch((err) => {
      console.log(err);
    });
  }



  /**************************************************************************************
   *********************************** WEB 3 ********************************************
   **************************************************************************************/

  /**
   * Get all books from the blockchain
   * @returns <Books>
   */
  useEffect(() => {
    if (state.service == 'web3') {
      async function getBooks() {
        const contractAddress = '0x0b7fC760E92Eb498f1dCDF1C0856c7c256c360fE';
        // const contractAddress = '0x629BFba0DDf4e20539a9d15E8C2396be04f3b2eD';
       
        const web3 = new Web3('https://goerli.infura.io/v3/376e00cbb0684049bfc81287c741e84e');
        const networkId = await web3.eth.net.getId();
        // Create a contract instance for the deployed contract
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const  getBookCount = async () => {
            const count = await contract.methods.getBookCount().call();
            console.log(count);
        }
        const count = await contract.methods.getBookCount().call();
        const bookPromises = [];
        for (let i = 0; i < count; i++) {
          bookPromises.push(contract.methods.getBook(i).call());
        }
        const bookData = await Promise.all(bookPromises);
        
       const bookList = contract.methods.getAllBooks().call().then((result) => {
          console.log(result);
          setBooks(bookData);
        }).catch((error) => {
          console.log(error);
        });
       
        
        console.log(books)
      }  
      getBooks();
    }
    
  }, []);

    
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
      data: contract.methods.addBook(title, author, description,image).encodeABI(),
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
    const gasLimit = 3000000;
  
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
  
    console.log(from)
    const nonce = await web3.eth.getTransactionCount(from, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
  
    const tx = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      from: from,
      to: contractAddress,
      data: contract.methods.updateBook(bookIndex, title, author, description,image).encodeABI(),
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
    setImage(sampleBookCover)


  };

  /**
   * Set the book details to the form
   * @param {*} book 
   * @param {*} index 
   */
  const setEditValue = (book,index) => {
    setTitle(state.service == 'web2' ?book.bookName :book[0]);
    setAuthor(state.service == 'web2' ?book.bookAuthor :book[1]);
    setDescription(state.service == 'web2' ?book.bookDescription :book[2]);
    setImage(state.service == 'web2' ?book.bookImage :book[3]);
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
          <p className='loading-text'>Please wait transaction is processing ...</p>
        </div>}
      <div className='top-nav'>
          <h1>eNova - Publisher</h1>
          <div className='account'> 
             {
              state.service == 'web3' ? (
              <>
              <img className='account-img' src={MetamaskLogo}/>
                <h3>MetaMask Address:
                {state.account}
                </h3>
              </>
              ) : (
                <>
                <img className='account-user-image' src={UserIcon}/>
                  <h3>User account :   {state.account.email}
                  </h3>
                </>
              )
              }
          </div>
          <button onClick={()=>{navigate('/')}} className='logout-btn'>Logout</button>
      </div>
      <h4></h4>
      <div className='bottom-part'>
      <div className='form-container'>
          <form className='form'>
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
            <div className='image-wrap'>
              <img className='image' src={image} alt="book cover"/>
              <button type='button' className='image-button' onClick={() => imageRef.current.open()}>Upload Image</button>
            </div>
            {
              isModalOpen ? (
                <button className='add-book-btn' type="button" onClick={()=> {state.service == 'web2' ?updateBookWeb2() :handleUpdateBookDetails()}}>Edit Book</button>
              ) :(
                <button  className='add-book-btn' type="button" onClick={()=>{state.service == 'web2' ?addBookWeb2() : handleSubmit()}}>Add Book</button>
              )
            }
            

          </form>
      </div>
      <div className='publications'>
         <div className='publication-title'> My Publications</div>
         <div className="books">
          {books.length == 0 ? (
          <div className='empty'>
            <GridLoader color="#73358d" />
          </div>
          ) :
          books.map((book, index) => (
            <div className="book" key={index}>
              <img className='book-image' src={state.service == "web2"? book.bookImage:book[3]} alt="book cover"/>
              <div className='book-top'>
                <div className='btn-row'>
                  <button className='edit-btn' onClick={() => setEditValue(book,index)}>
                    <img className='edit-img' src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"/>
                  </button>
                  <button className='delete-btn' onClick={() => {state.service == 'web2' ?deleteBookWeb2(book._id) :handleDeleteBook(index)}}>
                    X
                  </button>
                </div>
              </div>
              <div className='book-data'>
                  <h2>{state.service == "web2"? book.bookName:book[0] }</h2>
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