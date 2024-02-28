import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, LicenseApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import { Locale } from '@island.is/shared/types'
import { ForbiddenException, UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { GeneratePkPassInput } from '../dto/GeneratePkPass.input'
import { GetGenericLicenseInput } from '../dto/GetGenericLicense.input'
import { GetGenericLicensesInput } from '../dto/GetGenericLicenses.input'
import { VerifyPkPassInput } from '../dto/VerifyPkPass.input'
import { LicenseServiceService } from '../licenseService.service'
import {
  GenericPkPass,
  GenericPkPassQrCode,
  GenericPkPassVerification,
  GenericUserLicense,
  UserLicensesResponse,
} from './genericLicense.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericUserLicense)
@Audit({ namespace: '@island.is/api/license-service' })
export class MainResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => [GenericUserLicense], {
    deprecationReason: 'Use genericUserLicenses instead',
  })
  @Audit()
  async genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    return this.licenseServiceService.getAllLicenses(user, locale, {
      includedTypes: input?.includedTypes ?? ['DriversLicense'],
      excludedTypes: input?.excludedTypes,
      force: input?.force,
      onlyList: input?.onlyList,
    })
  }

  @Query(() => GenericUserLicense)
  @Audit()
  async genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    return this.licenseServiceService.getLicense(
      user,
      locale,
      input.licenseType,
      input.licenseId,
    )
  }

  @Scopes()
  @ResolveField('barcode', () => String)
  async createBarcode(
    @CurrentUser() user: User,
    @Parent() genericUserLicense: GenericUserLicense,
  ): Promise<string> {
    if (!user.scope.includes(LicenseApiScope.licensesBarcode)) {
      throw new ForbiddenException(
        'User does not have permission to create barcode',
      )
    }

    return this.licenseServiceService.createBarcodeJWT(user, genericUserLicense)
  }

  @Query(() => UserLicensesResponse)
  @Audit()
  async genericUserLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicensesInput,
  ) {
    return this.licenseServiceService.getUserLicenses(user, locale, {
      ...input,
      includedTypes: input?.includedTypes ?? ['DriversLicense'],
    })
  }

  @Mutation(() => GenericPkPass)
  @Audit()
  async generatePkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPass> {
    return {
      pkpassUrl: await this.licenseServiceService.generatePkPassUrl(
        user,
        locale,
        input.licenseType,
      ),
    }
  }

  @Mutation(() => GenericPkPassQrCode)
  @Audit()
  async generatePkPassQrCode(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPassQrCode> {
    return {
      pkpassQRCode: await this.licenseServiceService.generatePkPassQRCode(
        user,
        locale,
        input.licenseType,
      ),
    }
  }

  @Scopes(ApiScope.internal, ApiScope.licensesVerify)
  @Mutation(() => GenericPkPassVerification)
  @Audit()
  async verifyPkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: VerifyPkPassInput,
  ): Promise<GenericPkPassVerification> {
    return this.licenseServiceService.verifyPkPass(input.data)
  }
}
