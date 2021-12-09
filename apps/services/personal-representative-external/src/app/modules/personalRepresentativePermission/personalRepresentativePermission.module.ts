import { PersonalRepresentativePermissionController } from './personalRepresentativePermission.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRight,
      PersonalRepresentativeType,
      PersonalRepresentative,
    ]),
  ],
  controllers: [PersonalRepresentativePermissionController],
  providers: [PersonalRepresentativeService],
})
export class PersonalRepresentativePermissionModule {}
