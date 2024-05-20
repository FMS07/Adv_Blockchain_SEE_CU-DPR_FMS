import { useState, useEffect } from "react";
import { ethers } from "ethers";
import crowdfundingfmsABI from "../artifacts/contracts/Crowdfundingfms.sol/Crowdfundingfms.json";

export default function App() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState("");
  const [crowdfundingfms, setCrowdfundingfms] = useState(undefined);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [campaignIdToDonate, setCampaignIdToDonate] = useState("");
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const crowdfundingfmsABIJson = crowdfundingfmsABI.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    } else {
      console.error("Please install MetaMask to use this app.");
    }
  };

  const connectWallet = async () => {
    if (ethWallet) {
      try {
        const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask wallet not detected.");
    }
  };

  const getCrowdfundingfmsContract = () => {
    const signer = ethWallet.getSigner();
    const crowdfundingfmsContract = new ethers.Contract(
      contractAddress,
      crowdfundingfmsABIJson,
      signer
    );
    setCrowdfundingfms(crowdfundingfmsContract);
  };

  const createCampaign = async () => {
    if (crowdfundingfms) {
      try {
        const targetInWei = ethers.utils.parseEther(target);
        const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

        const tx = await crowdfundingfms.createCampaign(
          title,
          description,
          targetInWei,
          deadlineTimestamp,
          image
        );
        await tx.wait();
        console.log("Campaign created");
      } catch (error) {
        console.error("Error creating campaign:", error);
      }
    }
  };

  const donateToCampaign = async () => {
    if (crowdfundingfms) {
      try {
        const campaignId = parseInt(campaignIdToDonate); // Convert to integer
        const donationInWei = ethers.utils.parseEther(donationAmount);

        const tx = await crowdfundingfms.donateToCampaign(campaignId, {
          value: donationInWei,
        });
        await tx.wait();
        console.log("Donation successful");
      } catch (error) {
        console.error("Error donating to campaign:", error);
      }
    }
  };

  const getCampaignDetails = async (id) => {
    if (crowdfundingfms) {
      try {
        const campaign = await crowdfundingfms.getCampaignDetails(id);
        console.log("Campaign details:", campaign);
        setCampaignDetails(campaign);
      } catch (error) {
        console.error("Error getting campaign details:", error);
      }
    }
  };

  const getAllCampaigns = async () => {
    if (crowdfundingfms) {
      try {
        const campaigns = await crowdfundingfms.getAllCampaigns();
        console.log("All campaigns:", campaigns);
        setAllCampaigns(campaigns);
      } catch (error) {
        console.error("Error getting all campaigns:", error);
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet) {
      getCrowdfundingfmsContract();
    }
  }, [ethWallet]);

const appStyle = {
  backgroundColor: 'black',
  color: 'white',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
};

const formStyle = {
  margin: '20px auto',
  maxWidth: '400px',
};

const inputStyle = {
  margin: '10px 0',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid white',
  backgroundColor: 'transparent',
  color: 'white',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  margin: '10px 0',
  padding: '8px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

const hrStyle = {
  border: '1px solid white',
};

return (
  <div style={appStyle}>
    <h1>Crowdfunding App</h1>
    <p>Connected Account: {account}</p>
    <button onClick={connectWallet} style={buttonStyle}>Connect Wallet</button>
    <hr style={hrStyle} />
    <h2>Create Campaign</h2>
    <form style={formStyle}>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <label>Description:</label>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
      <label>Target (ETH):</label>
      <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle} />
      <label>Deadline (YYYY-MM-DD HH:MM:SS):</label>
      <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
      <label>Image URL:</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
      <button type="button" onClick={createCampaign} style={buttonStyle}>Create Campaign</button>
    </form>
    <hr style={hrStyle} />
    <h2>Donate to Campaign</h2>
    <form style={formStyle}>
      <label>Campaign ID:</label>
      <input type="text" value={campaignIdToDonate} onChange={(e) => setCampaignIdToDonate(e.target.value)} style={inputStyle} />
      <label>Amount (ETH):</label>
      <input type="text" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} style={inputStyle} />
      <button type="button" onClick={donateToCampaign} style={buttonStyle}>Donate</button>
    </form>
    <hr style={hrStyle} />
    <h2>Get Campaign Details</h2>
    <form style={formStyle}>
      <label>Campaign ID:</label>
      <input type="text" onChange={(e) => getCampaignDetails(e.target.value)} style={inputStyle} />
    </form>
    <hr style={hrStyle} />
    <h2>Get All Campaigns</h2>
    <button type="button" onClick={getAllCampaigns} style={buttonStyle}>Get All Campaigns</button>

    {campaignDetails && (
      <div>
        <h3>Campaign Details</h3>
        <p>Title: {campaignDetails.title}</p>
        <p>Description: {campaignDetails.description}</p>
        <p>Target: {ethers.utils.formatEther(campaignDetails.target)} ETH</p>
        <p>Deadline: {new Date(campaignDetails.deadline * 1000).toLocaleString()}</p>
        <p>Image URL: {campaignDetails.image}</p>
      </div>
    )}

    {allCampaigns.length > 0 && (
      <div>
        <h3>All Campaigns</h3>
        <ul>
          {allCampaigns.map((campaign, index) => (
            <li key={index}>
              <p>Title: {campaign.title}</p>
              <p>Description: {campaign.description}</p>
              <p>Target: {ethers.utils.formatEther(campaign.target)} ETH</p>
              <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
              <p>Image URL: {campaign.image}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
}