import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { GrantsService } from './grants.service'
import { Grant } from './models/grants.model'

@Module({
  imports: [SequelizeModule.forFeature([Grant])],
  providers: [GrantsService],
  exports: [GrantsService],
})
export class GrantsModule {}
