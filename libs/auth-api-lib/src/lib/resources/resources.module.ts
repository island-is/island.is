import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsModule } from '@island.is/cms'
import { DelegationScope } from '../delegations/models/delegation-scope.model'
import { Delegation } from '../delegations/models/delegation.model'
import { PersonalRepresentativeRightType } from '../personal-representative/models/personal-representative-right-type.model'
import { PersonalRepresentativeRight } from '../personal-representative/models/personal-representative-right.model'
import { PersonalRepresentativeScopePermission } from '../personal-representative/models/personal-representative-scope-permission.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'
import { TranslationModule } from '../translation/translation.module'
import { DelegationResourcesService } from './delegation-resources.service'
import { ApiResourceScope } from './models/api-resource-scope.model'
import { ApiScopeCategory } from './models/api-scope-category.model'
import { ApiScopeTag } from './models/api-scope-tag.model'
import { ApiResourceSecret } from './models/api-resource-secret.model'
import { ApiResourceUserClaim } from './models/api-resource-user-claim.model'
import { ApiResource } from './models/api-resource.model'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScopeUserAccess } from './models/api-scope-user-access.model'
import { ApiScopeUserClaim } from './models/api-scope-user-claim.model'
import { ApiScopeUser } from './models/api-scope-user.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'
import { IdentityResourceUserClaim } from './models/identity-resource-user-claim.model'
import { IdentityResource } from './models/identity-resource.model'
import { ResourceAccessService } from './resource-access.service'
import { ResourceTranslationService } from './resource-translation.service'
import { ResourcesService } from './resources.service'
import { ScopeService } from './scope.service'
import { TenantsService } from './tenants.service'
import { ApiScopeDelegationType } from './models/api-scope-delegation-type.model'

@Module({
  imports: [
    CmsModule,
    TranslationModule,
    SequelizeModule.forFeature([
      Domain,
      IdentityResource,
      ApiScope,
      ApiResource,
      ApiScopeGroup,
      ApiScopeUser,
      ApiScopeUserAccess,
      ApiResourceScope,
      ApiScopeDelegationType,
      ApiScopeCategory,
      ApiScopeTag,
      IdentityResourceUserClaim,
      ApiScopeUserClaim,
      ApiResourceUserClaim,
      ApiResourceSecret,
      Delegation,
      DelegationScope,
      PersonalRepresentativeScopePermission,
      PersonalRepresentativeRightType,
      PersonalRepresentativeRight,
      PersonalRepresentative,
    ]),
  ],
  providers: [
    ResourcesService,
    ResourceAccessService,
    ResourceTranslationService,
    DelegationResourcesService,
    TenantsService,
    ScopeService,
  ],
  exports: [
    ResourcesService,
    ResourceAccessService,
    DelegationResourcesService,
    TenantsService,
    ScopeService,
  ],
})
export class ResourcesModule {}
