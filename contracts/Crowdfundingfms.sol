// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfundingfms {
    struct Campaign {
        address owner; // The owner of the campaign
        string title; // Name of the campaign
        string description; // What the campaign is about
        uint target; // The target amount which can be donated/sent
        uint deadline;
        uint amountColl; // To find the cumulative amount collected in that particular campaign so far.
        string image; // We will be pasting the URL of an image here.
        address[] donators; // An array of donators who donated to the campaign
        uint[] donations; // An array to store the amount corresponding to each donator
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns;

    event CampaignCreated(uint256 indexed id);
    event DonationMade(address indexed donator, uint256 indexed campaignId, uint256 amount);

    constructor() {
        numberOfCampaigns = 0;
    }

    function createCampaign(string memory _title, string memory _description, uint _target, uint _deadline, string memory _image) public {
        require(_deadline > block.timestamp, "Deadline should be in the future");

        Campaign storage newCampaign = campaigns[numberOfCampaigns];
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.amountColl = 0;
        newCampaign.image = _image;

        emit CampaignCreated(numberOfCampaigns);
        numberOfCampaigns++;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign ID does not exist");
        require(msg.value > 0, "Donation amount should be greater than 0");

        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountColl += msg.value;

        emit DonationMade(msg.sender, _id, msg.value);
    }

    function getCampaignDetails(uint256 _id) public view returns (
        address owner,
        string memory title,
        string memory description,
        uint target,
        uint deadline,
        uint amountColl,
        string memory image
    ) {
        require(_id < numberOfCampaigns, "Campaign ID does not exist");

        Campaign storage campaign = campaigns[_id];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountColl,
            campaign.image
        );
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            allCampaigns[i] = campaign;
        }

        return allCampaigns;
    }
}
