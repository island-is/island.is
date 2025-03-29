import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { GenericLicenseProvider } from '../dto/GenericLicenseProvider.dto'
import {
  type OrganizationLogoByEntryIdDataLoader,
  type OrganizationTitleByEntryIdDataLoader,
  OrganizationTitleByEntryIdLoader,
  OrganizationLogoByEntryIdLoader,
} from '@island.is/cms'
import { Loader } from '@island.is/nest/dataloader'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.Hugsmidjan)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericLicenseProvider)
@Audit({ namespace: '@island.is/api/license-service' })
export class LicenseProviderResolver {
  @ResolveField('providerName', () => String, {
    nullable: true,
  })
  async resolveProviderName(
    @Parent() license: GenericLicenseProvider,
    @Loader(OrganizationTitleByEntryIdLoader)
    organizationTitleLoader: OrganizationTitleByEntryIdDataLoader,
  ): Promise<string | undefined> {
    const { entryId } = license
    if (!entryId) {
      return
    }

    const title = await organizationTitleLoader.load(entryId)

    return title ?? undefined
  }

  @ResolveField('providerLogo', () => String, {
    nullable: true,
  })
  async resolveProviderLogo(
    @Parent() license: GenericLicenseProvider,
    @Loader(OrganizationLogoByEntryIdLoader)
    organizationLogoLoader: OrganizationLogoByEntryIdDataLoader,
  ): Promise<string | undefined> {
    const { entryId } = license
    if (!entryId) {
      return
    }

    const logo = await organizationLogoLoader.load(entryId)

    return logo ?? undefined
  }
}
