import { Inject, UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { RskCompany } from './models/rskCompany.model'
import { Audit } from '@island.is/nest/audit'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { RskCompanyInfoService } from './rsk-company-info.service'
import { RskCompanyInfoInput } from './dto/RskCompanyInfo.input'
import { RskCompanyInfoSearchInput } from './dto/RskCompanyInfoSearch.input'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => RskCompany)
export class RskCompanyInfoResolver {
  constructor(
    private rskCompanyInfoService: RskCompanyInfoService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => RskCompany, {
    name: 'rskCompany',
    nullable: true,
  })
  @Audit()
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
    name: 'rskCompanies',
  })
  @Audit()
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

  @Audit()
  @ResolveField(() => RskCompany)
  async companySearchItems(
    @Parent() parent: RskCompanySearchItems,
  ): Promise<RskCompany[]> {
    this.logger.debug('RskCompanySearchItems')
    return parent.items ?? []
  }

  @Audit()
  @ResolveField(() => RskCompany)
  async companyInfo(
    @Parent() rskCompanyItem: RskCompany,
  ): Promise<RskCompany | null> {
    this.logger.debug('Resolving companyInfo')
    return await this.rskCompanyInfoService.getCompanyInformationWithExtra(
      rskCompanyItem.nationalId ?? '',
    )
  }
}
