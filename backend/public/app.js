// Replace with your deployed contract address
const contractAddress = "0x5263770A33dfb8a50C9461871Dcb7bAc4bE986E0";

// Replace with your deployed contract's ABI
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "space",
				"type": "uint256"
			}
		],
		"name": "ProviderRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_storageSpace",
				"type": "uint256"
			}
		],
		"name": "registerAsProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_provider",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_spaceRequested",
				"type": "uint256"
			}
		],
		"name": "rentStorage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "consumer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "space",
				"type": "uint256"
			}
		],
		"name": "StorageRented",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "consumers",
		"outputs": [
			{
				"internalType": "address",
				"name": "consumerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "storageRequested",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProviders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_provider",
				"type": "address"
			}
		],
		"name": "getProviderInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "providerList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "providers",
		"outputs": [
			{
				"internalType": "address",
				"name": "providerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "storageSpace",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;

async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            
            // Check the current network
            const { chainId } = await provider.getNetwork();
            const expectedChainId = 1337;  // Assuming you're using a local blockchain like Ganache

            if (chainId !== expectedChainId) {
                alert(`Please switch to the correct network. Expected chainId: ${expectedChainId}, but got ${chainId}`);
                // Optionally, you could prompt the user to switch networks
                return;
            }

            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("Wallet connected");
            alert("Metamask connected successfully!");
        } catch (error) {
            if (error.code === 4001) {
                console.error("User rejected the request.");
                alert("You rejected the connection request to Metamask.");
            } else {
                console.error("Error connecting to Metamask:", error);
                alert("An error occurred while connecting to Metamask. Please try again.");
                console.error("Full error object:", JSON.stringify(error));
            }
        }
    } else {
        alert("Please install Metamask to interact with this application.");
    }
}

async function registerStorageProvider(storageSpace) {
    try {
        const tx = await contract.registerAsProvider(storageSpace);
        await tx.wait();
        console.log("Storage provider registered:", storageSpace);
        alert("Successfully registered as a storage provider!");
    } catch (error) {
        console.error("Error registering storage provider:", error);
        alert("An error occurred while registering as a storage provider. Please try again.");
    }
}

async function findProviders() {
    try {
        const providerAddresses = await contract.getAllProviders();
        const providers = [];

        for (const address of providerAddresses) {
            const providerInfo = await contract.getProviderInfo(address);
            providers.push({
                address: address,
                storageSpace: providerInfo[0],
                isAvailable: providerInfo[1]
            });
        }

        console.log("Available storage providers:", providers);
        // Logic to display providers on the frontend
    } catch (error) {
        console.error("Error finding storage providers:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("provider-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const storageSpace = document.getElementById("storage-space").value;
        await registerStorageProvider(storageSpace);
    });
    
    // Connect MetaMask on page load
    connectMetamask();
});
