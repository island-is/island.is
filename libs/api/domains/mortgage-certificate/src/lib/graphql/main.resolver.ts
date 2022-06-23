import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { MortgageCertificateService } from '../mortgageCertificate.service'
import { MortgageCertificateValidationModel } from './models'
import { ValidateMortgageCertificateInput } from './dto/validateMortgageCertificate.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(
    private readonly mortgageCertificateService: MortgageCertificateService,
  ) {}

  @Query(() => MortgageCertificateValidationModel)
  async validateMortgageCertificate(
    @Args('input') input: ValidateMortgageCertificateInput,
  ) {
    return await this.mortgageCertificateService.validateMortgageCertificate(
      input.propertyNumber,
      input.isFromSearch,
    )
  }
}
