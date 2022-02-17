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
import { querystring } from '@island.is/clients/rsk/company-registry'



const mockSearchResponse = (searchQuery: string): RskCompanySearchItems => {


  const response = {
    data: [
      { status: '', nationalId: '6605101090', name: 'Málflutningsstofa Reykjavík ehf' },
      { status: '', nationalId: '6712061500', name: 'NóNó ehf.' },
      { status: '', nationalId: '6104080520', name: 'Orkuskólinn Reyst hf.' },
      { status: '', nationalId: '4612101470', name: 'Reyk Tour ehf.' },
      { status: '', nationalId: '5301992159', name: 'Reyk- og eldþéttingar ehf.' },
      { status: '', nationalId: '5208051170', name: 'Reyka ehf' },
      { status: '', nationalId: '4508140670', name: 'Reykavik Records ehf.' },
      { status: '', nationalId: '4102050250', name: 'Reykdalsfélagið' },
      { status: '', nationalId: '5806090310', name: 'Reykfiskur ehf.' },
      { status: '', nationalId: '6701120630', name: 'Reykfjörð ehf.' },
      { status: '', nationalId: '4801070710', name: 'Reykholt ehf.' },
      { status: '', nationalId: '5302694509', name: 'Reykholtskirkja' },
      { status: '', nationalId: '4905080310', name: 'Reykholtskirkjugarður' },
      { status: '', nationalId: '6010992179', name: 'Reykholtskórinn' },
      { status: '', nationalId: '4401800789', name: 'Reykholtslaug' },
      { status: '', nationalId: '6901181490', name: 'Reykholtsorka ehf.' },
      { status: '', nationalId: '5007790479', name: 'Reykholtsstaður' },
      { status: '', nationalId: '6408050210', name: 'Reykholtsstaður ehf.' },
      { status: '', nationalId: '4407872589', name: 'Reykhólahreppur' },
      { status: '', nationalId: '5302696049', name: 'Reykhólakirkja' },
      { status: '', nationalId: '5003200870', name: 'Reykhólar hses.' },
      { status: '', nationalId: '5906730489', name: 'Reykhólaskóli' },
      { status: '', nationalId: '5912081440', name: 'Reykhóll ehf' },
      { status: '', nationalId: '4607201920', name: 'Reykhóll-land ehf.' },
      { status: '', nationalId: '5705051220', name: 'Reykhús ehf.' },
      { status: '', nationalId: '5410090430', name: 'Reykhúsið Reykhólar ehf.' },
      { status: '', nationalId: '5012070390', name: 'Reykhúsið Útey ehf' },
      { status: '', nationalId: '6610131920', name: 'Reykir fasteignafélag ehf.' },
      { status: '', nationalId: '6206161410', name: 'Reykjaborg fjárfestingar ehf.' },
      { status: '', nationalId: '5811872549', name: 'Reykjabúið ehf.' },
      { status: '', nationalId: '5605140340', name: 'Reykjadalsfélagið slf.' },
      { status: '', nationalId: '6504171430', name: 'Reykjadalur ehf.' },
      { status: '', nationalId: '7105022420', name: 'Reykjaeignir ehf.' },
      { status: '', nationalId: '5302696559', name: 'Reykjafell ehf.' },
      { status: '', nationalId: '4511190440', name: 'Reykjafoss ehf.' },
      { status: '', nationalId: '6509032180', name: 'Reykjagarður hf.' },
      { status: '', nationalId: '6905012360', name: 'Reykjahlíð 10,húsfélag' },
      { status: '', nationalId: '5304992009', name: 'Reykjahlíð 12,húsfélag' },
      { status: '', nationalId: '6801110300', name: 'Reykjahlíð 14,húsfélag' },
      { status: '', nationalId: '4410871289', name: 'Reykjahlíð 8,húsfélag' },
      { status: '', nationalId: '4401691399', name: 'Reykjahlíðarskóli' },
      { status: '', nationalId: '5302696399', name: 'Reykjahlíðarsókn' },
      { status: '', nationalId: '5410140200', name: 'Reykjahvoll ehf.' },
      { status: '', nationalId: '6309151470', name: 'Reykjaháls ehf.' },
      { status: '', nationalId: '5312071220', name: 'Reykjahöfði ehf.' },
      { status: '', nationalId: '5302696129', name: 'Reykjakirkja' },
      { status: '', nationalId: '6905080600', name: 'Reykjakirkjugarður' },
      { status: '', nationalId: '6302002960', name: 'Reykjalaug ehf.' },
      { status: '', nationalId: '5712201480', name: 'Reykjalind ehf.' },
      { status: '', nationalId: '6104200790', name: 'Reykjalundur endurhæfing ehf.' },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "WyIwM2JmMWUwOS1hNWEwLTQyNDMtOTAxOC1mY2FhYjg4NTVkMTYiXQ==∂",
      endCursor: "WyIwM2JmMWUwOS1hNWEwLTQyNDMtOTAxOC1mY2FhYjg4NTVkMTYiXQ==∂"
    },
    totalCount: 100
  }
  response.data = response.data.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()) || x.nationalId.includes(searchQuery))
  if (!searchQuery) {
    response.data = []
  }
  return response
}


@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => RskCompany)
@Audit({ namespace: '@island.is/api/company-registry' })
export class CompanyRegistryResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private rskCompanyInfoService: RskCompanyInfoService,
    private RSKService: RSKService,
  ) { }

  @Query(() => [CurrentUserCompanies])
  @Audit()
  async rskCurrentUserCompanies(@CurrentUser() user: User) {
    return this.RSKService.getCompaniesByNationalId(user.nationalId)
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
    return new Promise((res, rej) => {
      setTimeout(() => {
        return res(mockSearchResponse(input.searchTerm))
      }, 250)
    })
    // return await this.rskCompanyInfoService.companyInformationSearch(
    //   input.searchTerm,
    //   input.first,
    //   input.after,
    // )
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
