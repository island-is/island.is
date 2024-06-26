import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { GenericLicenseProvider } from '../dto/GenericLicenseProvider.dto'
import {
  type OrganizationLogoByReferenceIdDataLoader,
  OrganizationLogoByReferenceIdLoader,
  type OrganizationTitleByReferenceIdDataLoader,
  OrganizationTitleByReferenceIdLoader,
} from '@island.is/cms'
import { Loader } from '@island.is/nest/dataloader'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericLicenseProvider)
@Audit({ namespace: '@island.is/api/license-service' })
export class LicenseProviderResolver {
  @ResolveField('providerName', () => String, {
    nullable: true,
  })
  async resolveProviderName(
    @Parent() license: GenericLicenseProvider,
    @Loader(OrganizationTitleByReferenceIdLoader)
    organizationTitleLoader: OrganizationTitleByReferenceIdDataLoader,
  ): Promise<string | undefined> {
    const { referenceId } = license
    if (!referenceId) {
      return
    }

    const title: string | null = await organizationTitleLoader.load(referenceId)
    return title ?? undefined
  }

  @ResolveField('providerLogo', () => String, {
    nullable: true,
  })
  async resolveProviderLogo(
    @Parent() license: GenericLicenseProvider,
    @Loader(OrganizationLogoByReferenceIdLoader)
    organizationLogoLoader: OrganizationLogoByReferenceIdDataLoader,
  ): Promise<string | undefined> {
    const { referenceId } = license
    if (!referenceId) {
      return
    }

    const logo = await organizationLogoLoader.load(referenceId)

    return logo ?? undefined
  }
}
