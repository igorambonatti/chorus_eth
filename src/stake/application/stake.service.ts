import { Injectable } from '@nestjs/common';
import {
  EthereumStaker,
  CHORUS_ONE_ETHEREUM_VALIDATORS,
} from '@chorus-one/ethereum';
import { FireblocksSigner } from '@chorus-one/signer-fireblocks';
import { ethers } from 'ethers';
import { Balance, Stake } from '../domain/stake.entity';
import { serializeBigInt } from '../../utils/serializeBigInt';

@Injectable()
export class StakeService {
  private staker: EthereumStaker;
  private walletProvider: ethers.JsonRpcProvider;
  private walletSigner: ethers.Wallet | null = null;
  private vaultAddress: string;

  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    this.staker = new EthereumStaker({
      network: isDev ? 'holesky' : 'ethereum',
    });
    this.walletProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (privateKey) {
      this.walletSigner = new ethers.Wallet(privateKey, this.walletProvider);
    }
    this.vaultAddress = isDev
      ? CHORUS_ONE_ETHEREUM_VALIDATORS.holesky.mevMaxVault
      : process.env.STAKE_VAULT_ADDRESS || '';
  }

  async init() {
    await this.staker.init();
  }

  private formatHex(value: string): `0x${string}` {
    return value.startsWith('0x') ? (value as `0x${string}`) : `0x${value}`;
  }

  async buildStakeTransaction(stake: Stake) {
    stake.validate();

    const delegatorAddress = this.formatHex(stake.delegatorAddress);
    const validatorAddress = this.formatHex(this.vaultAddress);

    const amountInEth = ethers.formatEther(stake.amount);
    const normalizedAmount = parseFloat(amountInEth).toString();

    const { tx } = await this.staker.buildStakeTx({
      delegatorAddress,
      validatorAddress,
      amount: normalizedAmount,
    });

    const txSerialized = serializeBigInt(tx);
    return { tx: txSerialized };
  }

  async buildUnstakeTransaction(stake: Stake) {
    stake.validate();

    const delegatorAddress = this.formatHex(stake.delegatorAddress);
    const validatorAddress = this.formatHex(this.vaultAddress);

    const amountInEth = ethers.formatEther(stake.amount);
    const normalizedAmount = parseFloat(amountInEth).toString();
    const { tx } = await this.staker.buildUnstakeTx({
      delegatorAddress,
      validatorAddress,
      amount: normalizedAmount,
    });

    const txSerialized = serializeBigInt(tx);
    return { tx: txSerialized };
  }

  async signAndBroadcast(signedTx: string) {
    const formattedSignedTx = this.formatHex(signedTx);
    const { txHash } = await this.staker.broadcast({
      signedTx: formattedSignedTx,
    });
    return { txHash };
  }

  async signWithFireblocks(
    delegatorAddress: string,
    tx: any,
    fireblocksConfig: any,
  ) {
    const fireblocksSigner = new FireblocksSigner(fireblocksConfig);
    await fireblocksSigner.init();

    const formattedAddress = this.formatHex(delegatorAddress);
    const { signedTx } = await this.staker.sign({
      signer: fireblocksSigner,
      signerAddress: formattedAddress,
      tx,
    });
    return { signedTx };
  }

  async signWithWallet(delegatorAddress: string, tx: any) {
    if (!this.walletSigner) {
      throw new Error('Wallet signer not configured on the server.');
    }
    const transactionResponse = await this.walletSigner.sendTransaction(tx);
    return { txHash: transactionResponse.hash };
  }

  async getTransactionStatus(txHash: string) {
    const formattedTxHash = this.formatHex(txHash);
    const { status, receipt } = await this.staker.getTxStatus({
      txHash: formattedTxHash,
    });
    return { status, receipt };
  }

  async getBalance(stake: Balance) {
    stake.validate();

    const delegatorAddress = this.formatHex(stake.delegatorAddress);
    const validatorAddress = this.formatHex(this.vaultAddress);

    const { balance } = await this.staker.getStake({
      delegatorAddress,
      validatorAddress,
    });
    return { balance };
  }

  async getUnstakeQueue(delegatorAddress: string) {
    const formattedDelegatorAddress = this.formatHex(delegatorAddress);
    const formattedValidatorAddress = this.formatHex(this.vaultAddress);
    const unstakeQueue = await this.staker.getUnstakeQueue({
      delegatorAddress: formattedDelegatorAddress,
      validatorAddress: formattedValidatorAddress,
    });
    return unstakeQueue;
  }

  async buildWithdrawTransaction(
    delegatorAddress: string,
    positionTickets?: string[],
  ) {
    const formattedDelegatorAddress = this.formatHex(delegatorAddress);
    const formattedValidatorAddress = this.formatHex(this.vaultAddress);
    const { tx } = await this.staker.buildWithdrawTx({
      delegatorAddress: formattedDelegatorAddress,
      validatorAddress: formattedValidatorAddress,
      positionTickets,
    });
    const txSerialized = serializeBigInt(tx);
    return { tx: txSerialized };
  }
  async getMaxUnstake(delegatorAddress: string) {
    const formattedDelegatorAddress = this.formatHex(delegatorAddress);
    const validatorAddress = this.formatHex(this.vaultAddress);

    const { maxUnstake } = await this.staker.getStake({
      delegatorAddress: formattedDelegatorAddress,
      validatorAddress,
    });
    return { maxUnstake };
  }
  async getVault() {
    const validatorAddress = this.formatHex(this.vaultAddress);
    const vault = await this.staker.getVault({ validatorAddress });
    console.log(vault);
    return vault;
  }
}
