import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Institution } from '../models/institution.model'
import { Loader } from '@island.is/nest/dataloader'
import {
  type OrganizationLogoByReferenceIdDataLoader,
  OrganizationLogoByReferenceIdLoader,
  type OrganizationTitleByReferenceIdDataLoader,
  OrganizationTitleByReferenceIdLoader,
} from '@island.is/cms'
import { UniversityContentfulReferenceIds } from '../universityCareers.types'
import { AUDIT_NAMESPACE } from '../constants'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Resolver(() => Institution)
@Audit({ namespace: AUDIT_NAMESPACE })
@CodeOwner(CodeOwners.Hugsmidjan)
export class InstitutionResolver {
  @ResolveField('displayName', () => String, {
    nullable: true,
  })
  async resolveProviderName(
    @Parent() license: Institution,
    @Loader(OrganizationTitleByReferenceIdLoader)
    organizationTitleLoader: OrganizationTitleByReferenceIdDataLoader,
  ): Promise<string | undefined> {
    if (!license.id) {
      return
    }
    const refId = UniversityContentfulReferenceIds[license.id]
    const name = await organizationTitleLoader.load(refId)
    return name ?? undefined
  }

  @ResolveField('logoUrl', () => String, {
    nullable: true,
  })
  async resolveLogoUrl(
    @Parent() license: Institution,
    @Loader(OrganizationLogoByReferenceIdLoader)
    organizationLogoLoader: OrganizationLogoByReferenceIdDataLoader,
  ): Promise<string | undefined> {
    if (!license.id) {
      return
    }
    const refId = UniversityContentfulReferenceIds[license.id]
    const logo = await organizationLogoLoader.load(refId)

    return logo ?? undefined
  }
}
