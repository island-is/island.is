import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { RskCompany } from './models/rskCompany.model'
import { CompanyApi } from '@island.is/clients/rsk-company-info'
import { RskCompanyFormOfOperation } from './models/rskCompanyFormOfOperation.model'
import { RskCompanyVat } from './models/rskCompanyVat.model'
import { RskCompanyAddress } from './models/rskCompanyAddress.model'
import { RskCompanyRelatedParty } from './models/rskCompanyRelatedParty.model'
import { RskCompanyClassification } from './models/rskCompanyClassification.model'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { fromCursorHash, toCursorHash } from '../rsk-company-info.utils'
import { PageResult } from './types/pageResult'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class RskCompanyInfoService {
  constructor(
    private rskCompanyInfoApi: CompanyApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getCompanyInformationWithExtra(
    nationalId: string,
  ): Promise<RskCompany> {
    this.logger.debug(`Service getting company by nationalId ${nationalId}`)
    const company = await this.rskCompanyInfoApi.v1FyrirtaekjaskraSsidGet({
      ssid: nationalId,
    })
    this.logger.debug(`Company in service ${company.toString()}`)
    return {
      nationalId: company.kennitala,
      name: company.nafn,
      dateOfRegistration: new Date(company.skrad),
      status: company.stada,
      companyInfo: {
        formOfOperation: company.rekstrarform?.map((item) => {
          return {
            type: item.tegund,
            name: item.heiti,
            suffix: item.vidskeyti,
          } as RskCompanyFormOfOperation
        }),
        address: company.heimilisfang?.map((item) => {
          return {
            streetAddress: item.heimilisfang1,
            streetAddress2: item.heimilisfang2,
            postalCode: item.postnumer,
            city: item.sveitarfelag,
            cityNumber: item.sveitarfelagsnumer,
            country: item.land,
          } as RskCompanyAddress
        }),
        relatedParty: company.tengdirAdilar?.map((item) => {
          return {
            type: item.tegund,
            nationalId: item.kennitala,
            name: item.nafn,
          } as RskCompanyRelatedParty
        }),
        vat: company.virdisaukaskattur?.map((item) => {
          return {
            vatNumber: item.vskNumer,
            dateOfRegistration: new Date(item.skrad),
            status: item.stada,
            dateOfDeregistration: new Date(item.afskraning),
            classification: item.flokkun?.map(
              (classification) =>
                ({
                  type: classification.gerd,
                  classificationSystem: classification.flokkunarkerfi,
                  number: classification.numer,
                  name: classification.heiti,
                } as RskCompanyClassification),
            ),
          } as RskCompanyVat
        }),
      },
      lastUpdated: company.sidastUppfaert
        ? new Date(company.sidastUppfaert)
        : undefined,
    }
  }

  async companyInformationSearch(
    searchTerm: string,
    first: number,
    after = '',
  ): Promise<RskCompanySearchItems | null> {
    const searchResults = await this.rskCompanyInfoApi.v1FyrirtaekjaskraSearchSearchStringGet(
      { searchString: searchTerm },
    )
    if (
      !searchResults.items ||
      !searchResults?.count ||
      searchResults.count < 1
    ) {
      throw new NotFoundException('No search results found')
    }

    const formattedSearchResults = searchResults.items?.map((item) => {
      return {
        name: item.nafn,
        status: item.stada,
        dateOfRegistration: item.skrad ? new Date(item.skrad) : undefined,
        nationalId: item.kennitala,
        vatNumber: item.vskNumer,
        lastUpdated: item.sidastUppfaert
          ? new Date(item.sidastUppfaert)
          : undefined,
      } as RskCompany
    })

    const pageResult = this.getPage(formattedSearchResults, first, after)
    if (!pageResult) {
      throw new NotFoundException('No search results found')
    }

    const totalLength = searchResults.count
    const cursor = toCursorHash(this.getLastItemIdentifer(pageResult.items))

    return {
      items: pageResult.items,
      count: totalLength,
      pageInfo: {
        endCursor: cursor,
        hasNextPage: pageResult.hasNextPage,
      },
    }
  }

  getPage(
    searchResult: RskCompany[],
    first: number,
    cursor: string,
  ): PageResult {
    if (searchResult) {
      if (cursor === '')
        return {
          items: searchResult.slice(0, first),
          hasNextPage: first < searchResult.length,
        }

      const index = searchResult.findIndex(
        (x) => x.nationalId === fromCursorHash(cursor),
      )
      const start = index + 1

      return {
        items: searchResult.slice(start, start + first),
        hasNextPage: start + first < searchResult.length,
      }
    }
    return { items: [], hasNextPage: false }
  }

  getLastItemIdentifer(items: RskCompany[]): string {
    if (items && items.length > 0) {
      return items[items.length - 1].nationalId ?? ''
    } else {
      return ''
    }
  }
}
