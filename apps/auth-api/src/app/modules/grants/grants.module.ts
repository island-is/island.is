import { GrantType } from './../clients/client.model';
import { GrantsController } from './grants.controller';
import { Module } from '@nestjs/common'
import { GrantsService } from './grants.service';
import { Grant } from './grants.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Grant, GrantType])],
  controllers: [GrantsController],
  providers: [GrantsService]
})
export class GrantsModule { }
