import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Institution } from './institution.model'
import { InstitutionController } from './institution.controller'
import { InstitutionService } from './institution.service'

@Module({
  imports: [SequelizeModule.forFeature([Institution])],
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}
