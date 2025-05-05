import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, LicenseApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import type { Locale } from '@island.is/shared/types'
import { ForbiddenException, UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CreateBarcodeResult } from '../dto/CreateBarcodeResult.dto'
import { GenericUserLicense } from '../dto/GenericUserLicense.dto'
import { GetGenericLicenseInput } from '../dto/GetGenericLicense.input'
import { LicenseService } from '../licenseService.service'
import { GenericLicenseError } from '../dto/GenericLicenseError.dto'
import { ParsedUserAgent, type UserAgent } from '@island.is/nest/core'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.Hugsmidjan)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericUserLicense)
@Audit({ namespace: '@island.is/api/license-service' })
export class UserLicenseResolver {
  constructor(private readonly licenseServiceService: LicenseService) {}

  @Query(() => GenericUserLicense, {
    nullable: true,
  })
  @Audit()
  async genericLicense(
    @CurrentUser() user: User,
    @ParsedUserAgent()
    agent: UserAgent,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    const license = await this.licenseServiceService.getLicense(
      user,
      locale,
      input.licenseType,
      input.licenseId,
      agent,
    )

    if (license instanceof GenericLicenseError) {
      return null
    }

    return license
  }

  @ResolveField('barcode', () => CreateBarcodeResult, { nullable: true })
  async resolveBarcode(
    @CurrentUser() user: User,
    @Parent() genericUserLicense: GenericUserLicense,
  ): Promise<CreateBarcodeResult | null> {
    if (!user.scope.includes(LicenseApiScope.licensesBarcode)) {
      throw new ForbiddenException(
        'User does not have permission to create barcode',
      )
    }

    return this.licenseServiceService.createBarcode(user, genericUserLicense)
  }
}
