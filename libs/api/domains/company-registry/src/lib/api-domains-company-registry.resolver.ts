import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { RskCompany, RskCompanyInfo } from './models/rskCompany.model'
import { RskCompanyInfoInput } from './dto/RskCompanyInfo.input'
import { RskCompanyInfoService } from './rsk-company-info.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { RskCompanyInfoSearchInput } from './dto/RskCompanyInfoSearch.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.company, AdminPortalScope.serviceDesk)
@Resolver(() => RskCompany)
@Audit({ namespace: '@island.is/api/company-registry' })
export class CompanyRegistryResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly rskCompanyInfoService: RskCompanyInfoService,
  ) {}

  @Query(() => RskCompany, {
    name: 'companyRegistryCompany',
    nullable: true,
  })
  async companyInformation(
    @Args('input', { nullable: true, type: () => RskCompanyInfoInput })
    input: RskCompanyInfoInput,
    @CurrentUser()
    user: User,
  ): Promise<RskCompany | null> {
    this.logger.debug(`Getting company information`)
    const company =
      await this.rskCompanyInfoService.getCompanyInformationWithExtra(
        input ? input.nationalId : user.nationalId,
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

    const company =
      await this.rskCompanyInfoService.getCompanyInformationWithExtra(
        rskCompanyItem.nationalId,
      )
    return company ? company.companyInfo : undefined
  }
}
