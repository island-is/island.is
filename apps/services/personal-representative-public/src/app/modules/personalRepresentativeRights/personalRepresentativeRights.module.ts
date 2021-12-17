import { PersonalRepresentativeRightsController } from './personalRepresentativeRights.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessService,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeAccess,
      PersonalRepresentativeRight,
      PersonalRepresentativeType,
      PersonalRepresentative,
    ]),
  ],
  controllers: [PersonalRepresentativeRightsController],
  providers: [
    PersonalRepresentativeAccessService,
    PersonalRepresentativeService,
  ],
})
export class PersonalRepresentativeRightsModule {}
