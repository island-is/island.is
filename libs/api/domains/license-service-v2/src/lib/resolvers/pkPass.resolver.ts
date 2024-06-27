import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GeneratePkPassInput } from '../dto/GeneratePkPass.input'
import { GenericPkPass } from '../dto/GenericPkPass.dto'
import { GenericPkPassQrCode } from '../dto/GenericPkPassQrCode.dto'
import { VerifyLicenseBarcodeInput } from '../dto/VerifyLicenseBarcodeInput'
import { VerifyLicenseBarcodeResult } from '../dto/VerifyLicenseBarcodeResult.dto'
import { LicenseServiceV2 } from '../licenseService.service'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@FeatureFlag(Features.licensesV2)
@Resolver(() => GenericPkPass)
@Audit({ namespace: '@island.is/api/license-service-v2' })
export class PkPassResolver {
  constructor(private readonly licenseServiceService: LicenseServiceV2) {}

  @Mutation(() => GenericPkPass, {
    name: 'licenseServiceV2GeneratePkPass',
  })
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

  @Mutation(() => GenericPkPassQrCode, {
    name: 'licenseServiceV2GeneratePkPassQrCode',
  })
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
  @Mutation(() => VerifyLicenseBarcodeResult, {
    name: 'licenseServiceV2VerifyLicenseBarcode',
  })
  @Audit()
  async verifyLicenseBarcode(
    @Args('input') input: VerifyLicenseBarcodeInput,
  ): Promise<VerifyLicenseBarcodeResult> {
    return this.licenseServiceService.verifyLicenseBarcode(input.data)
  }
}
