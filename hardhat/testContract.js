const { ethers } = require("ethers");

const TokenABIJson = require("./artifacts/contracts/Letapay.sol/Letapay.json");

const ERC20ABIJson = require("../utils/erc20.abi.json");

require('dotenv').config();

const { cUsdToWei, weiToCusd } = require("../utils/utils")

const OWNER_API_KEY = process.env.OWNER_PRIVATE_KEY;

const SENDER_API_KEY = process.env.SENDER_API_KEY;

const ownerAddress = "0x8C998Ca53F797646b6CBa17bBD191d521648E4EC";

const senderAdress = "0x141adc0e0158B4c6886534701412da2E2b0d7fF1";

const recieverAddress = "0x31B2821B611b8e07d88c9AFcb494de8E36b09537";


//wallet
const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
//const provider = new ethers.JsonRpcProvider('https://forno.celo.org');
const wallet = new ethers.Wallet(OWNER_API_KEY, provider);


//cusd
const cUsdAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const celoContract = new ethers.Contract(cUsdAddress, ERC20ABIJson, wallet);


// sender contract
const senderWallet = new ethers.Wallet(SENDER_PRIVATE_KEY, provider);
const senderContract = new ethers.Contract(letapayContractAddress, contractABI, senderWallet);


// ABI and Address of the deployed contract
const contractABI = TokenABIJson.abi;

// aljores
const letapayContractAddress = "0x614A568899911523ea51E91F3ccB21E0CBB82462";


// Connect to the contract
const contract = new ethers.Contract(letapayContractAddress, contractABI, wallet);


async function readFunction() {
    const owner = await contract.owner();
    console.log("Owner:", owner);

    const name = await contract.name();
    console.log("Name:", name);
}


async function paymentDetails(id) {
    let payment = await contract.getPayment(id);
    console.log(payment);
}


async function addPayment() {
    let tx = await contract.addPayment("22", recieverAddress, 10);
    let r = await tx.wait();
}

async function balance(address, name) {
    const balance = await celoContract.balanceOf(address);
    console.log(`Balance of ${name} is ${weiToCusd(balance)}`);
}

readFunction();






