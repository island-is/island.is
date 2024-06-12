import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, LicenseApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import type { Locale } from '@island.is/shared/types'
import { ForbiddenException, UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { CreateBarcodeResult } from './dto/CreateBarcodeResult.dto'
import { GeneratePkPassInput } from './dto/GeneratePkPass.input'
import { GenericPkPass } from './dto/GenericPkPass.dto'
import { GenericPkPassQrCode } from './dto/GenericPkPassQrCode.dto'
import { GenericPkPassVerification } from './dto/GenericPkPassVerification.dto'
import { GenericUserLicense } from './dto/GenericUserLicense.dto'
import { GetGenericLicenseInput } from './dto/GetGenericLicense.input'
import { GetGenericLicensesInput } from './dto/GetGenericLicenses.input'
import { UserLicensesResponse } from './dto/UserLicensesResponse.dto'
import { VerifyLicenseBarcodeInput } from './dto/VerifyLicenseBarcodeInput'
import { VerifyLicenseBarcodeResult } from './dto/VerifyLicenseBarcodeResult.dto'
import { VerifyPkPassInput } from './dto/VerifyPkPass.input'
import { LicenseServiceService } from './licenseService.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericUserLicense)
@Audit({ namespace: '@island.is/api/license-service' })
export class LicenseServiceResolver {
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

  @Query(() => GenericUserLicense, { nullable: true })
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

  @ResolveField('barcode', () => CreateBarcodeResult, { nullable: true })
  async createBarcode(
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
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPass> {
    const pkpassUrl = await this.licenseServiceService.generatePkPassUrl(
      user,
      input.licenseType,
    )

    return {
      pkpassUrl,
    }
  }

  @Mutation(() => GenericPkPassQrCode)
  @Audit()
  async generatePkPassQrCode(
    @CurrentUser() user: User,
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPassQrCode> {
    const pkpassQRCode = await this.licenseServiceService.generatePkPassQRCode(
      user,
      input.licenseType,
    )

    return {
      pkpassQRCode,
    }
  }

  @Scopes(ApiScope.internal, ApiScope.licensesVerify)
  @Mutation(() => GenericPkPassVerification, {
    deprecationReason:
      'Should use verifyLicenseBarcode instead of verifyPkPass',
  })
  @Audit()
  async verifyPkPass(
    @Args('input')
    input: VerifyPkPassInput,
  ): Promise<GenericPkPassVerification> {
    return this.licenseServiceService.verifyPkPassDeprecated(input.data)
  }

  @Scopes(ApiScope.internal, ApiScope.licensesVerify)
  @Mutation(() => VerifyLicenseBarcodeResult, {
    name: 'verifyLicenseBarcode',
  })
  @Audit()
  async verifyLicenseBarcode(
    @Args('input') input: VerifyLicenseBarcodeInput,
  ): Promise<VerifyLicenseBarcodeResult> {
    return this.licenseServiceService.verifyLicenseBarcode(input.data)
  }
}
