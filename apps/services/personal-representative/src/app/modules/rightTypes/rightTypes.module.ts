import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'

import { RightTypesController } from './rightTypes.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRightType,
      PersonalRepresentativeRight,
      PersonalRepresentative,
    ]),
  ],
  controllers: [RightTypesController],
  providers: [PersonalRepresentativeRightTypeService],
})
export class RightTypesModule {}
