import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { MortgageCertificateService } from '../mortgageCertificate.service'
import {
  MortgageCertificateValidationModel,
  RequestCorrectionOnMortgageCertificateModel,
} from './models'
import { ValidateMortgageCertificateInput } from './dto/validateMortgageCertificate.input'
import { RequestCorrectionOnMortgageCertificateInput } from './dto/requestCorrectionOnMortgageCertificate.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.internalProcuring)
@Resolver()
export class MainResolver {
  constructor(
    private readonly mortgageCertificateService: MortgageCertificateService,
  ) {}

  @Query(() => [MortgageCertificateValidationModel])
  async validateMortgageCertificate(
    @Args('input') input: ValidateMortgageCertificateInput,
  ) {
    return await this.mortgageCertificateService.validateMortgageCertificate(
      input.properties,
    )
  }

  @Query(() => RequestCorrectionOnMortgageCertificateModel)
  async requestCorrectionOnMortgageCertificate(
    @Args('input') input: RequestCorrectionOnMortgageCertificateInput,
  ) {
    return await this.mortgageCertificateService.requestCorrectionOnMortgageCertificate(
      input.propertyNumber,
      input.identityData,
      input.userProfileData,
    )
  }
}
