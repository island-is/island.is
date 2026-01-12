import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

import { GoneException, UseGuards } from '@nestjs/common'
import { Args, Directive, Mutation, Resolver } from '@nestjs/graphql'
import { GeneratePkPassInput } from '../dto/GeneratePkPass.input'
import { GenericPkPass } from '../dto/GenericPkPass.dto'
import { GenericPkPassQrCode } from '../dto/GenericPkPassQrCode.dto'
import { VerifyLicenseBarcodeInput } from '../dto/VerifyLicenseBarcodeInput'
import { VerifyLicenseBarcodeResult } from '../dto/VerifyLicenseBarcodeResult.dto'
import { LicenseService } from '../licenseService.service'
import { GenericPkPassVerification } from '../dto/GenericPkPassVerification.dto'
import { VerifyPkPassInput } from '../dto/VerifyPkPass.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => GenericPkPass)
@Audit({ namespace: '@island.is/api/license-service' })
export class PkPassResolver {
  constructor(private readonly licenseServiceService: LicenseService) {}

  @Directive(
    '@deprecated(reason: "Permanently closed. Not removed for backwards compatibility")',
  )
  @Mutation(() => GenericPkPass, {
    name: 'generatePkPass',
    deprecationReason:
      'Permanently closed. Not removed for backwards compatibility',
  })
  @Audit()
  async generatePkPass(
    @Args('input') _: GeneratePkPassInput,
  ): Promise<GenericPkPass> {
    throw new GoneException('Permanently closed')
  }

  @Directive(
    '@deprecated(reason: "Permanently closed. Not removed for backwards compatibility")',
  )
  @Mutation(() => GenericPkPassQrCode, {
    name: 'generatePkPassQrCode',
    deprecationReason:
      'Permanently closed. Not removed for backwards compatibility',
  })
  @Audit()
  async generatePkPassQrCode(
    @Args('input') _: GeneratePkPassInput,
  ): Promise<GenericPkPassQrCode> {
    throw new GoneException('Permanently closed')
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
