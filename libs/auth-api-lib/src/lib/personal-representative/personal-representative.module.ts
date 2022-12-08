import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PersonalRepresentative } from './models/personal-representative.model'
import { PersonalRepresentativeAccess } from './models/personal-representative-access.model'
import { PersonalRepresentativeRight } from './models/personal-representative-right.model'
import { PersonalRepresentativeRightType } from './models/personal-representative-right-type.model'
import { PersonalRepresentativeScopePermission } from './models/personal-representative-scope-permission.model'
import { PersonalRepresentativeType } from './models/personal-representative-type.model'
import { PersonalRepresentativeAccessService } from './services/personalRepresentativeAccess.service'
import { PersonalRepresentativeService } from './services/personalRepresentative.service'
import { PersonalRepresentativeScopePermissionService } from './services/personal-representative-scope-permission.service'
import { PersonalRepresentativeRightTypeService } from './services/personalRepresentativeRightType.service'
import { PersonalRepresentativeTypeService } from './services/personalRepresentativeType.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentative,
      PersonalRepresentativeAccess,
      PersonalRepresentativeRight,
      PersonalRepresentativeRightType,
      PersonalRepresentativeScopePermission,
      PersonalRepresentativeType,
    ]),
  ],
  providers: [
    PersonalRepresentativeAccessService,
    PersonalRepresentativeService,
    PersonalRepresentativeScopePermissionService,
    PersonalRepresentativeRightTypeService,
    PersonalRepresentativeTypeService,
  ],
  exports: [
    PersonalRepresentativeAccessService,
    PersonalRepresentativeService,
    PersonalRepresentativeScopePermissionService,
    PersonalRepresentativeRightTypeService,
    PersonalRepresentativeTypeService,
  ],
})
export class PersonalRepresentativeModule {}
