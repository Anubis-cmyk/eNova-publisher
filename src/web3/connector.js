
import Web3 from 'web3';
import contractABI from '../ABI/abi.json'; 


// Initialize web3 with the Gorli provider URL and network ID
async function initWeb3() {
    const contractAddress = '0x1E644BA51396EbFd1e18657044605766C801995e';

    const web3 = new Web3('https://goerli.infura.io/v3/376e00cbb0684049bfc81287c741e84e');
    const networkId = await web3.eth.net.getId();
    // Create a contract instance for the deployed contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);

   
    // Verify that the connected network matches the network ID of the deployed contract
    if (initWeb3.networkId !== 5) {
        console.error(`Connected to network ${initWeb3.networkId}, but contract is deployed on network ${5}`);
    }

    const  getBookCount = async () => {
        const count = await contract.methods.bookCount().call();
        console.log(count);
    }

     return { web3, networkId,contractAddress,getBookCount };


}


export default initWeb3;