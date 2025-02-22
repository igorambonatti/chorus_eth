import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StakeService } from '../application/stake.service';
import { StakeDto, SignWalletDto, SignFireblocksDto } from './dto/stake.dto';
import { Balance, Stake } from '../domain/stake.entity';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Post('build')
  async buildStakeTransaction(@Body() stakeDto: StakeDto) {
    const stake = new Stake(stakeDto.delegatorAddress, stakeDto.amount);
    return this.stakeService.buildStakeTransaction(stake);
  }

  @Post('unstake/build')
  async buildUnstakeTransaction(@Body() stakeDto: StakeDto) {
    const stake = new Stake(stakeDto.delegatorAddress, stakeDto.amount);
    return this.stakeService.buildUnstakeTransaction(stake);
  }

  @Post('balance')
  async getBalance(@Body() stakeDto: StakeDto) {
    const stake = new Balance(stakeDto.delegatorAddress);
    return this.stakeService.getBalance(stake);
  }

  @Get('vault')
  async getVaultInfo() {
    return await this.stakeService.getVault();
  }

  @Post('sign/wallet')
  async signStakeTransactionWithWallet(@Body() signWalletDto: SignWalletDto) {
    return this.stakeService.signWithWallet(
      signWalletDto.delegatorAddress,
      signWalletDto.tx,
    );
  }

  @Post('sign/fireblocks')
  async signStakeTransactionWithFireblocks(
    @Body() signFireblocksDto: SignFireblocksDto,
  ) {
    return this.stakeService.signWithFireblocks(
      signFireblocksDto.delegatorAddress,
      signFireblocksDto.tx,
      signFireblocksDto.fireblocksConfig,
    );
  }

  @Post('broadcast')
  async broadcastSignedTransaction(@Body('signedTx') signedTx: string) {
    return this.stakeService.signAndBroadcast(signedTx);
  }

  @Get('status/:txHash')
  async getTransactionStatus(@Param('txHash') txHash: string) {
    return this.stakeService.getTransactionStatus(txHash);
  }

  @Get('max-unstake/:delegatorAddress')
  async getMaxUnstake(@Param('delegatorAddress') delegatorAddress: string) {
    return this.stakeService.getMaxUnstake(delegatorAddress);
  }

  @Get('unstake/queue/:delegatorAddress')
  async getUnstakeQueue(@Param('delegatorAddress') delegatorAddress: string) {
    return this.stakeService.getUnstakeQueue(delegatorAddress);
  }

  @Post('unstake/withdraw')
  async buildWithdrawTransaction(@Body() withdrawDto: WithdrawDto) {
    return this.stakeService.buildWithdrawTransaction(
      withdrawDto.delegatorAddress,
      withdrawDto.positionTickets,
    );
  }
}
