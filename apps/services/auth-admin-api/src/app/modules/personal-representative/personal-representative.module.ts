import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentativeController } from './personal-representative.controller'
import {
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeScopePermissionService,
} from '@island.is/auth-api-lib'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentative,
      PersonalRepresentativeRight,
      PersonalRepresentativeRightType,
      PersonalRepresentativeScopePermission,
    ]),
  ],
  controllers: [PersonalRepresentativeController],
  providers: [
    PersonalRepresentativeRightTypeService,
    PersonalRepresentativeScopePermissionService,
  ],
})
export class PersonalRepresentativeModule {}
