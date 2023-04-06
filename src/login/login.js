import React, { useEffect, useState } from 'react' 
import './login-style.css';
import {useNavigate} from "react-router-dom"

const Metamask = () => {
  // set states to hold wallet account details
  const [userAccount, setUserAccount] = useState() 

  const navigate = useNavigate();
  //  initialize and check if the ethereum blockchain is defined, the assign
  let eth

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
               "metaMaskAddress" : acc
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
                          <button className='continue-button' onClick={() => connectWallet()}>Continue</button>
                        </>
                        : 
                      <button className='login-button' onClick={() => connectWallet()}>connect wallet</button>
                  }
                  </div>
                  </div>
              </div> 
          </div> 
    </>
  )
}

export default Metamask