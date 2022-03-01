import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { MortgageCertificateService } from '../mortgageCertificate.service'
import { MortgageCertificateValidationModel } from './models'
import { ValidateMortgageCertificateInput } from './dto/validateMortgageCertificate.input'

@UseGuards(IdsUserGuard, ScopesGuard)
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
    )
  }
}
