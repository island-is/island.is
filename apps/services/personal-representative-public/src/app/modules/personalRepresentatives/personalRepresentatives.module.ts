import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'

import { PersonalRepresentativesController } from './personalRepresentatives.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRight,
      PersonalRepresentativeType,
      PersonalRepresentative,
    ]),
  ],
  controllers: [PersonalRepresentativesController],
  providers: [PersonalRepresentativeService],
})
export class PersonalRepresentativesModule {}
