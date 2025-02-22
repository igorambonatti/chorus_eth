import { IsOptional, IsString, IsArray } from 'class-validator';

export class WithdrawDto {
  @IsString()
  delegatorAddress: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positionTickets?: string[];
}
