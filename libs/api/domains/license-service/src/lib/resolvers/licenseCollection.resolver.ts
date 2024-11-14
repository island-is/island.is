import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import type { Locale } from '@island.is/shared/types'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetGenericLicensesInput } from '../dto/GetGenericLicenses.input'
import { LicenseService } from '../licenseService.service'
import { LicenseCollection } from '../dto/GenericLicenseCollection.dto'
import { GenericUserLicense } from '../dto/GenericUserLicense.dto'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ParsedUserAgent, type UserAgent } from '@island.is/nest/core'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => LicenseCollection)
@Audit({ namespace: '@island.is/api/license-service' })
export class LicenseCollectionResolver {
  constructor(
    private readonly licenseServiceService: LicenseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => [GenericUserLicense], {
    deprecationReason: 'Use genericLicenseCollection instead',
  })
  @Audit()
  async genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    const collection = await this.licenseServiceService.getLicenseCollection(
      user,
      locale,
      {
        ...input,
        includedTypes: input?.includedTypes ?? ['DriversLicense'],
        excludedTypes: input?.excludedTypes,
        force: input?.force,
        onlyList: input?.onlyList,
      },
    )

    return collection.licenses
  }

  @Query(() => LicenseCollection, {
    name: 'genericLicenseCollection',
  })
  @Audit()
  async genericLicenseCollection(
    @CurrentUser() user: User,
    @ParsedUserAgent() agent: UserAgent,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicensesInput,
  ) {
    const licenseCollection =
      await this.licenseServiceService.getLicenseCollection(
        user,
        locale,
        {
          ...input,
          includedTypes: input?.includedTypes ?? ['DriversLicense'],
          excludedTypes: input?.excludedTypes,
          force: input?.force,
          onlyList: input?.onlyList,
        },
        agent,
      )
    return licenseCollection
  }
}
