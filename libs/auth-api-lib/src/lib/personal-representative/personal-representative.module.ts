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
import { PersonalRepresentativeDelegationTypeModel } from './models/personal-representative-delegation-type.model'
import { DelegationTypeModel } from '../delegations/models/delegation-type.model'
import { DelegationProviderModel } from '../delegations/models/delegation-provider.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentative,
      PersonalRepresentativeAccess,
      PersonalRepresentativeRight,
      PersonalRepresentativeDelegationTypeModel,
      PersonalRepresentativeRightType,
      PersonalRepresentativeScopePermission,
      PersonalRepresentativeType,
      DelegationProviderModel,
      DelegationTypeModel,
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
