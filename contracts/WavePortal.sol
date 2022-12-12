// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // test3
    uint256 totalWaves;

    // generate a random number
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;     // the address of user
        string message;    // content
        uint256 timestamp; // the timestamp
    }

    // hold all the waves anyone ever sends to me.
    Wave[] waves;

    //  associate an address with a number
    // storing the address with the last time the user waved at us.
    mapping(address => uint256) public lastWavedAt;


    constructor() payable {
        console.log("Yo yo, i am a smart contract, what about you ?");
        // set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // make sure the current timestamp is at least 15 minutes
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        // update the current timestamp we have for the user
        lastWavedAt[msg.sender] = block.timestamp;


        totalWaves += 1;
        console.log("%s waved w/ message %s: ", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        // generate a new seed for the next user that seed a wave
        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Random # generated: %d", seed);

        // give 50% chance that the user wins the price
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            // the same code we had before to send the prize
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);

//        uint256 prizeAmount = 0.0001 ether;
//        require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
//        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
//        require(success, "Failed to withdraw money from contract.");
    }


    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves.", totalWaves);
        return totalWaves;
    }

}
