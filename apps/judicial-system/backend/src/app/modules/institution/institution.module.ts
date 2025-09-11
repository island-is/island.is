import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Institution } from '../repository'
import { InstitutionController } from './institution.controller'
import { InstitutionService } from './institution.service'

@Module({
  imports: [SequelizeModule.forFeature([Institution])],
  controllers: [InstitutionController],
  providers: [InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
