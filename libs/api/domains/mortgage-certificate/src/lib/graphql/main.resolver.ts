import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { MortgageCertificateService } from '../mortgageCertificate.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly mortgageCertificateService: MortgageCertificateService,
  ) {}

  // @Query(() => Boolean)
  // async mortgageCertificateValidation(
  //   // @CurrentUser() user: User,
  //   @Args('realEstateNumber') realEstateNumber: string,
  // ) {
  //   return await this.mortgageCertificateService.validateMortgageCertificate(
  //     realEstateNumber,
  //   )
  // }
}
