import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { InstitutionController } from './institution.controller'
import { Institution } from './institution.model'
import { InstitutionService } from './institution.service'

@Module({
  imports: [SequelizeModule.forFeature([Institution])],
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}
