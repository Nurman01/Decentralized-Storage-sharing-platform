// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageSharing {
    struct Provider {
        address providerAddress;
        uint storageSpace;
        bool isAvailable;
    }

    struct Consumer {
        address consumerAddress;
        uint storageRequested;
        bool isActive;
    }

    mapping(address => Provider) public providers;
    mapping(address => Consumer) public consumers;

    event ProviderRegistered(address provider, uint space);
    event StorageRented(address consumer, address provider, uint space);

    function registerAsProvider(uint _storageSpace) public {
        require(_storageSpace > 0, "Storage space must be greater than zero.");
        providers[msg.sender] = Provider(msg.sender, _storageSpace, true);
        emit ProviderRegistered(msg.sender, _storageSpace);
    }

    function rentStorage(address _provider, uint _spaceRequested) public payable {
        require(providers[_provider].isAvailable, "Provider is not available.");
        require(providers[_provider].storageSpace >= _spaceRequested, "Insufficient storage available.");

        consumers[msg.sender] = Consumer(msg.sender, _spaceRequested, true);
        providers[_provider].storageSpace -= _spaceRequested;

        emit StorageRented(msg.sender, _provider, _spaceRequested);
    }

    function getProviderInfo(address _provider) public view returns (uint, bool) {
        Provider memory provider = providers[_provider];
        return (provider.storageSpace, provider.isAvailable);
    }
}
