import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentativesController } from './personalRepresentatives.controller'

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
