// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Vault} from "../src/Vault.sol";
import {SP1MockVerifier} from "@sp1-contracts/SP1MockVerifier.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy SP1 Verifier (Mock/Real)
        // For local development, we deploy a fresh instance of the official SP1Verifier
        SP1MockVerifier verifier = new SP1MockVerifier();
        console.log("SP1Verifier deployed at:", address(verifier));

        // 2. Program VKey (Placeholder for Phase 2, usually derived from the ELF)
        // In Phase 3 integration we will automate fetching this from the elf.
        // For now we use a dummy hash or we can fetch it if we have sp1-sdk available here (we don't).
        bytes32 programVKey = bytes32(0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef);

        // 3. Deploy Vault
        Vault vault = new Vault(address(verifier), programVKey);
        console.log("Vault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
