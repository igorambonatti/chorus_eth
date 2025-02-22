import { Module } from '@nestjs/common';
import { StakeModule } from './stake/stake.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    StakeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
