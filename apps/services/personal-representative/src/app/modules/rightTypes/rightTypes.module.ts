import { RightTypesController } from './rightTypes.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

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
