/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import DataSource from '../Config/typeorm.config';
import { UserModule } from './user.module';
import { MessageModule } from './message.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...DataSource,
      name: 'default',
      autoLoadEntities: true,
    }),
    UserModule,
    MessageModule, 
    AuthModule
  ],
})
export class AppModule {}