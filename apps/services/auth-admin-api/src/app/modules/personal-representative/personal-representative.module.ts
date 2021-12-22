import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentativeController } from './personal-representative.controller'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeScopePermissionService,
} from '@island.is/auth-api-lib'

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
