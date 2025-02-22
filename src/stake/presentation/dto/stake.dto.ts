import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class StakeDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  delegatorAddress: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class BalanceDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  delegatorAddress: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class SignWalletDto {
  delegatorAddress: string;
  tx: any; // Pode ser tipado conforme a estrutura da transação
}
export class SignFireblocksDto {
  delegatorAddress: string;
  tx: any; // Estrutura da transação a ser assinada
  fireblocksConfig: any; // Configurações necessárias para a integração com Fireblocks
}
