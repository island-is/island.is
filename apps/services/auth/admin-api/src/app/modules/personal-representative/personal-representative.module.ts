import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeScopePermissionService,
} from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentativeController } from './personal-representative.controller'

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
