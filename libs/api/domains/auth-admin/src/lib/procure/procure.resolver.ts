import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { ProcureService } from './procure.service'
import { ProcureCompany } from './model/company.model'
import { CompanyProcurers } from './model/company-procurers.model'

@UseGuards(IdsUserGuard)
@Resolver()
export class ProcureResolver {
  constructor(private readonly procureService: ProcureService) {}

  @Query(() => [ProcureCompany], { name: 'authAdminProcureGetCompanies' })
  getCompanies(@Args('search') search: string): Promise<ProcureCompany[]> {
    return this.procureService.getCompanies(search)
  }

  @Query(() => CompanyProcurers, {
    name: 'authAdminGetCompanyProcurers',
    nullable: true,
  })
  getCompanyProcurers(
    @Args('nationalId') nationalId: string,
  ): Promise<CompanyProcurers | null> {
    return this.procureService.searchCompanyProcurers(nationalId)
  }
}
