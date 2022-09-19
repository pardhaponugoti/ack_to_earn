import { Web3Storage } from "web3.storage";

import { IPFS_API_TOKEN } from "../constants/FileStorage";

let storageClient = null;

export const getStorageClient = () => {
  if (!storageClient) {
    storageClient = new Web3Storage({ token: IPFS_API_TOKEN });
  }

  return storageClient;
};
