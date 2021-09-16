import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { RskCompany } from './models/rskCompany.model'
import { Audit } from '@island.is/nest/audit'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { RskCompanyInfoService } from './rsk-company-info.service'
import { GetRskCompanyInfoInput } from './dto/getRskCompanyInfoInput'
import { GetRskCompanyInfoSearchInput } from './dto/getRskCompanyInfoSearchInput'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RskCompanyInfoResolver {
  constructor(private rskCompanyInfoService: RskCompanyInfoService) {}

  @Query(() => RskCompany, {
    name: 'rskCompanyInfo',
    nullable: true,
  })
  @Audit()
  async companyInformation(
    @Args('input', { type: () => GetRskCompanyInfoInput })
    input: GetRskCompanyInfoInput,
  ): Promise<RskCompany> {
    return await this.rskCompanyInfoService.getCompanyInformation(
      input.nationalId,
    )
  }

  @Query(() => RskCompanySearchItems, {
    name: 'rskCompanyInfoSearch',
    nullable: true,
  })
  @Audit()
  async companyInformationSearch(
    @Args('input', { type: () => GetRskCompanyInfoSearchInput })
    input: GetRskCompanyInfoSearchInput,
  ): Promise<RskCompanySearchItems> {
    return await this.rskCompanyInfoService.companyInformationSearch(
      input.searchTerm,
    )
  }
}
