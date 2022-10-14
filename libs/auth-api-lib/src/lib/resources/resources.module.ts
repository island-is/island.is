import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ResourcesService } from './resources.service'
import { ResourceAccessService } from './resource-access.service'
import { TranslationModule } from '../translation/translation.module'
import { Domain } from './models/domain.model'
import { IdentityResource } from './models/identity-resource.model'
import { ApiScope } from './models/api-scope.model'
import { ApiResource } from './models/api-resource.model'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScopeUser } from './models/api-scope-user.model'
import { ApiScopeUserAccess } from './models/api-scope-user-access.model'
import { ApiResourceScope } from './models/api-resource-scope.model'
import { IdentityResourceUserClaim } from './models/identity-resource-user-claim.model'
import { ApiScopeUserClaim } from './models/api-scope-user-claim.model'
import { ApiResourceUserClaim } from './models/api-resource-user-claim.model'
import { ApiResourceSecret } from './models/api-resource-secret.model'
import { Delegation } from '../delegations/models/delegation.model'
import { DelegationScope } from '../delegations/models/delegation-scope.model'
import { PersonalRepresentativeScopePermission } from '../personal-representative/models/personal-representative-scope-permission.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'
import { PersonalRepresentativeRight } from '../personal-representative/models/personal-representative-right.model'
import { PersonalRepresentativeRightType } from '../personal-representative/models/personal-representative-right-type.model'
import { DelegationResourcesService } from './delegation-resources.service'
import { DelegationDomainsService } from './delegation-domains.service'
import { ResourceTranslationService } from './resource-translation.service'

@Module({
  imports: [
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
    DelegationDomainsService,
  ],
  exports: [
    ResourcesService,
    ResourceAccessService,
    DelegationResourcesService,
    DelegationDomainsService,
  ],
})
export class ResourcesModule {}
