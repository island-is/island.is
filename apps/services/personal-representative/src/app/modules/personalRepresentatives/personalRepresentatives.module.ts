import { PersonalRepresentativesController } from './personalRepresentatives.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeService,
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
  controllers: [PersonalRepresentativesController],
  providers: [PersonalRepresentativeService],
})
export class PersonalRepresentativesModule {}
