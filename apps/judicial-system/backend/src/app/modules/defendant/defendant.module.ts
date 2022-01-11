import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Defendant } from './models/defendant.model'

@Module({
  imports: [SequelizeModule.forFeature([Defendant])],
})
export class DefendantModule {}
