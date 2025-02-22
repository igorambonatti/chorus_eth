import { Module } from '@nestjs/common';
import { StakeService } from './application/stake.service';
import { StakeController } from './presentation/stake.controller';

@Module({
  controllers: [StakeController],
  providers: [StakeService],
})
export class StakeModule {}
