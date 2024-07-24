# Token Contract

This project demonstrates basic implementations of ERC Token Standards (ERC20).

Make sure to add a valid funded private key in .env file (refer .env.example).
Make sure to add owner's wallet address in ignition -> parameters.json -> BaseERC20Module -> owner
Make sure to add admin's wallet address in ignition -> parameters.json -> BaseAccessManagerModule -> admin

Note: owner(token) and admin(access_manager) can be same.

Now, try running some of the following scripts:
```shell
npm run compile
npm run test
npm run ignite-baseERC20
npm run deploy-baseERC20
```

## Deployed & verified Contracts on Polygon Amoy :

- [BaseERC20](https://amoy.polygonscan.com/address/0xF2D52442B0F7e6948583C62e4d63c819b9e4E8e8)
- [BaseAccessManager](https://amoy.polygonscan.com/address/0x63aD3BcfE3E6B07681030262607B0852C0d1d46b)
