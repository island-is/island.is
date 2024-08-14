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
import { LicenseService } from '../licenseService.service'
import { GenericPkPassVerification } from '../dto/GenericPkPassVerification.dto'
import { VerifyPkPassInput } from '../dto/VerifyPkPass.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => GenericPkPass)
@Audit({ namespace: '@island.is/api/license-service' })
export class PkPassResolver {
  constructor(private readonly licenseServiceService: LicenseService) {}

  @Mutation(() => GenericPkPass, {
    name: 'generatePkPass',
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
    name: 'generatePkPassQrCode',
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
    name: 'verifyLicenseBarcode',
  })
  @Audit()
  async verifyLicenseBarcode(
    @Args('input') input: VerifyLicenseBarcodeInput,
  ): Promise<VerifyLicenseBarcodeResult> {
    return this.licenseServiceService.verifyLicenseBarcode(input.data)
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
}
