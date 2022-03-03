import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'

import { RightsController } from './rights.controller'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeRightType])],
  controllers: [RightsController],
  providers: [PersonalRepresentativeRightTypeService],
})
export class RightsModule {}
