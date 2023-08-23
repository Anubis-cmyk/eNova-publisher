import React, { useEffect, useState } from 'react' 
import './login-style.css';
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import { APPURL } from '../constant/const';
import { on } from 'stream';

const Metamask = () => {
  // set states to hold wallet account details
  const [userAccount, setUserAccount] = useState() 
  const [user, setUser] = useState({})
  const navigate = useNavigate();
  
  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  }

  const login = async (e) => {
    e.preventDefault();
    const { email, password } = user;
    const data = { email, password };
    const response = await axios.post(`${APPURL}/user/login`, data).then((res) => {
      console.log(res.data[0]);
      localStorage.setItem('user', res.data);
      navigate('/addBook',
      {
        state: {
          "service": "web2",
          "account" : res.data[0]
        }
      });
    }
    ).catch((err) => {
      console.log(err);
    }
    );
  }

  const register = async (e) => {
    e.preventDefault();
    const { email, password } = user;
    const data = { email, password };
    const response = await axios.post(`${APPURL}/user/addUser`, data).then((res) => {
      console.log(res.data);
      localStorage.setItem('user', res.data);
      navigate('/addBook',
      {
        state: {
          "service": "web2",
          "account" : res.data 
        }
      });
    }).catch((err) => {
      console.log(err);
    }
    );
  }
  

  //  initialize and check if the ethereum blockchain is defined, the assign
  let eth;

  if (typeof window !== 'undefined'){
    eth = window.ethereum
  }

  const connectWallet =  async (metamask = eth)=>{
    try {
      // check if metamask is installed
      if(!metamask){
        return alert('please install metamask to proceed')
      }
      // access the account
      const acc = await metamask.request({method:'eth_requestAccounts'})
      setUserAccount(acc[0])
      navigate('./addBook',
            {
              state: {
                "service": "web3",
                "account" : acc
              }
            })
            
           
    } catch (error) {
      console.log(error);
      throw new Error('No ethereum object found')
    }
  }

  const isMobile = ()=>{
    return 'ontouchstart' in window || 'onmsgesturechange' in window
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkWalletConnect = async (metamask =eth)=>{
    try {
      // check if metamask is installed
      if(!metamask){
        return alert('please install metamask to continue')
      }
      const acc = await metamask.request({method: 'eth_accounts'})
      if (acc.length){
        setUserAccount(acc[0])
      }

      if (isMobile()){
        await connectWallet(eth)
      }

    } catch (error) {
      console.log(error);
      throw new Error('No ethereum object')
    }

  }


  useEffect(()=>{
    checkWalletConnect()
  },[checkWalletConnect])
 

  return (
    <>
     <div className='login-container'>
                <div className='top-container'>
                    <div className='overlay'></div>
                      <div className='content'>
                        <h1>Enova - Publisher</h1>
                        <p>Enova is a decentralized platform for sharing and selling books</p>
                      </div>
                </div>    
                <div className='bottom-container'>
                  <div className='bottom-rotation'>
                    <div className='bottom-content'>
                      { 
                      userAccount ?
                       <>
                        <div>
                        <p className='login-text'>Login with Email</p>
                        <form className='form'>
                            <div>
                              <label htmlFor="email">E-mail:</label>
                              <input
                                type="email"
                                id="email" 
                                name="email"
                                onChange={(e) => {onChange(e)}}
                                required
                              />
                            </div>
                            <div className=''>
                              <label htmlFor="password">Password:</label>
                              <input
                                type="password"
                                id="password" 
                                name="password" 
                                onChange={(e) => {onChange(e)}}
                                required
                              />
                            </div>
                            
                            <button type='button' className=" login-btn-primary" onClick={login}>Login</button>
                            <button type='button' className=" login-btn-secondary" onClick={register}>Register</button>
                          </form> 
                          <p className='login-text center-text'>Or</p>
                          <button className='continue-button' onClick={() => connectWallet()}>Continue with MetaMask</button>
                        </div>
                        </>
                        : 
                     <>
                        <div>
                          <p className='login-text'>Login to continue</p>
                          <form className='form'>
                            <div>
                              <label htmlFor="email">E-mail:</label>
                              <input
                                type="text"
                                id="email" 
                                name="email"
                                onChange={(e) => {}}
                                required
                              />
                            </div>
                            <div className=''>
                              <label htmlFor="password">Password:</label>
                              <input
                                type="text"
                                id="password" 
                                name="password" 
                                onChange={(e) => {}}
                                required
                              />
                            </div>
                            
                            <button type='button' className=" login-btn-primary" onClick={login}>Login</button>
                            <button type='button' className=" login-btn-secondary" onClick={register}>Register</button>
                          </form> 
                          <p className='login-text'>Login with Metamask</p>
                         <button className='login-button' onClick={() => connectWallet()}>connect wallet</button>
                        </div>
                     </>
                  }
                  </div>
                  </div>
              </div> 
          </div> 
    </>
  )
}

export default Metamask