import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { RSKService } from '@island.is/clients/rsk/v1'
import { Audit } from '@island.is/nest/audit'

import { CurrentUserCompanies } from './models/currentUserCompanies.model'
import { RskCompany, RskCompanyInfo } from './models/rskCompany.model'
import { RskCompanyInfoInput } from './dto/RskCompanyInfo.input'
import { RskCompanyInfoService } from './rsk-company-info.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { RskCompanyInfoSearchInput } from './dto/RskCompanyInfoSearch.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => RskCompany)
@Audit({ namespace: '@island.is/api/company-registry' })
export class CompanyRegistryResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private rskCompanyInfoService: RskCompanyInfoService,
    private rskService: RSKService,
  ) {}

  @Query(() => [CurrentUserCompanies])
  @Audit()
  async rskCurrentUserCompanies(@CurrentUser() user: User) {
    return this.rskService.getCompaniesByNationalId(user.nationalId)
  }

  @Query(() => RskCompany, {
    name: 'companyRegistryCompany',
    nullable: true,
  })
  async companyInformation(
    @Args('input', { type: () => RskCompanyInfoInput })
    input: RskCompanyInfoInput,
  ): Promise<RskCompany | null> {
    this.logger.debug(`Getting company information`)
    const company = await this.rskCompanyInfoService.getCompanyInformationWithExtra(
      input.nationalId,
    )
    this.logger.debug(`Company in resolver ${company}`)
    if (!company) {
      return null
    }
    return company
  }

  @Query(() => RskCompanySearchItems, {
    name: 'companyRegistryCompanies',
  })
  async companyInformationSearch(
    @Args('input', { type: () => RskCompanyInfoSearchInput })
    input: RskCompanyInfoSearchInput,
  ): Promise<RskCompanySearchItems | null> {
    this.logger.debug('Searching for companies')
    return await this.rskCompanyInfoService.companyInformationSearch(
      input.searchTerm,
      input.first,
      input.after,
    )
  }

  @ResolveField(() => RskCompanyInfo)
  async companyInfo(
    @Parent() rskCompanyItem: RskCompany,
  ): Promise<RskCompanyInfo | undefined> {
    this.logger.debug('Resolving companyInfo')
    if (rskCompanyItem.companyInfo) return rskCompanyItem.companyInfo

    const company = await this.rskCompanyInfoService.getCompanyInformationWithExtra(
      rskCompanyItem.nationalId ?? '',
    )
    return company.companyInfo
  }
}
