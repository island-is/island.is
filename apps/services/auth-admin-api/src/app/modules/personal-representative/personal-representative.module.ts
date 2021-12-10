import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeScopePermissionService,
  PersonalRepresentativeScopePermission,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentativeController } from './personal-representative.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRightType,
      PersonalRepresentativeRight,
      PersonalRepresentative,
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
