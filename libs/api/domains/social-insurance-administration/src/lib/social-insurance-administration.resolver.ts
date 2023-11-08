import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class SocialInsuranceAdministrationResolver {
  constructor(
    private socialInsuranceAdministrationService: SocialInsuranceAdministrationService,
  ) {}

  @Query(() => [String], { nullable: true })
  async getCurrencies(): Promise<Array<string> | null> {
    return this.socialInsuranceAdministrationService.getCurrencies()
  }
}
