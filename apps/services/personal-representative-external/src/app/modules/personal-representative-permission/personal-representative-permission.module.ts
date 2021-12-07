import { PersonalRepresentativePermissionController } from './personal-representative-permission.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRight,
      PersonalRepresentative,
    ]),
  ],
  controllers: [PersonalRepresentativePermissionController],
  providers: [PersonalRepresentativeService],
})
export class PersonalRepresentativePermissionModule {}
