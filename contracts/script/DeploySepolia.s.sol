// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {Vault} from "../src/Vault.sol";
import {SP1MockVerifier} from "@sp1-contracts/SP1MockVerifier.sol";
import {stdJson} from "forge-std/StdJson.sol";

contract DeploySepolia is Script {
    using stdJson for string;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        bytes32 programVKey = bytes32(0x00ec3ee7e896c08a288594cb602f469f7813ac136f59c65ec16b1356dce460fa); // From Operator build

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Verifier (Using Mock for now as it's easiest to verify locally/testnet without Succinct Gateway setup)
        // In production, we would point to the official Succinct Gateway on Sepolia.
        SP1MockVerifier verifier = new SP1MockVerifier();
        console2.log("SP1Verifier deployed at:", address(verifier));

        // 2. Deploy Vault
        Vault vault = new Vault(address(verifier), programVKey);
        console2.log("Vault deployed at:", address(vault));

        vm.stopBroadcast();

        // 3. Write to deployments.json
        string memory jsonObj = "key";
        jsonObj.serialize("chainId", vm.toString(block.chainid));
        jsonObj.serialize("verifier", vm.toString(address(verifier)));
        string memory finalJson = jsonObj.serialize("vault", vm.toString(address(vault)));

        string memory path = "./deployments.json"; // Saves to contracts/deployments.json
        vm.writeJson(finalJson, path);
    }
}
