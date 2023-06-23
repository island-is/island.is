import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'

import { ProcureService } from './procure.service'
import { ProcureCompany } from './model/company.model'
import { CompanyRelationships } from './model/company-relationships.model'

@UseGuards(IdsUserGuard)
@Resolver()
export class ProcureResolver {
  constructor(private readonly procureService: ProcureService) {}

  @Query(() => [ProcureCompany], { name: 'authAdminProcureGetCompanies' })
  getCompanies(
    @CurrentUser() user: User,
    @Args('search') search: string,
  ): Promise<ProcureCompany[]> {
    return this.procureService.getCompanies(user, search)
  }

  @Query(() => CompanyRelationships, {
    name: 'authAdminProcureGetCompanyRelationships',
    nullable: true,
  })
  getCompanyRelationships(
    @CurrentUser() user: User,
    @Args('nationalId') nationalId: string,
  ): Promise<CompanyRelationships | null> {
    return this.procureService.getCompanyRelationships(user, nationalId)
  }
}
