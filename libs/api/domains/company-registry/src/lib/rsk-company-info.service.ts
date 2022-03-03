import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import {
  GetCompanyApi,
  SearchCompanyRegistryApi,
} from '@island.is/clients/rsk/company-registry'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { RskCompany } from './models/rskCompany.model'
import { RskCompanyAddress } from './models/rskCompanyAddress.model'
import { RskCompanyClassification } from './models/rskCompanyClassification.model'
import { RskCompanyFormOfOperation } from './models/rskCompanyFormOfOperation.model'
import { RskCompanyRelatedParty } from './models/rskCompanyRelatedParty.model'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { RskCompanyVat } from './models/rskCompanyVat.model'
import { decodeBase64, toBase64 } from './rsk-company-info.utils'

@Injectable()
export class RskCompanyInfoService {
  constructor(
    private rskCompanyInfoApi: GetCompanyApi,
    private companyRegistrySearchApi: SearchCompanyRegistryApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getCompanyInformationWithExtra(
    nationalId: string,
  ): Promise<RskCompany> {
    this.logger.debug(`Service getting company by nationalId ${nationalId}`)
    const company = await this.rskCompanyInfoApi.getCompany({
      nationalId,
    })
    this.logger.debug(`Company in service ${company.toString()}`)
    return {
      nationalId: company.kennitala,
      name: company.nafn,
      dateOfRegistration: company.skrad ? new Date(company.skrad) : undefined,
      status: company.stada,
      companyInfo: {
        formOfOperation:
          company.companyType?.map((item) => {
            return {
              type: item.tegund,
              name: item.heiti,
            } as RskCompanyFormOfOperation
          }) ?? [],
        address:
          company.responseAddress?.map((item) => {
            return {
              streetAddress: item.heimilisfang1,
              streetAddress2: item.heimilisfang2,
              postalCode: item.postnumer,
              city: item.sveitarfelag,
              cityNumber: item.sveitarfelagsnumer,
              country: item.land,
            } as RskCompanyAddress
          }) ?? [],
        relatedParty:
          company.tengdirAdilar?.map((item) => {
            return {
              type: item.tegund,
              nationalId: item.kennitala,
              name: item.nafn,
            } as RskCompanyRelatedParty
          }) ?? [],
        vat:
          company.virdisaukaskattur?.map((item) => {
            return {
              vatNumber: item.vskNumer,
              dateOfRegistration: new Date(item.skrad),
              status: item.stada,
              dateOfDeregistration: item.afskraning
                ? new Date(item.afskraning)
                : undefined,
              classification: item.categoryInfo?.map(
                (classification) =>
                  ({
                    type: classification.gerd,
                    classificationSystem: classification.flokkunarkerfi,
                    number: classification.numer,
                    name: classification.heiti,
                  } as RskCompanyClassification),
              ),
            } as RskCompanyVat
          }) ?? [],
      },
      lastUpdated: company.sidastUppfaert
        ? new Date(company.sidastUppfaert)
        : undefined,
    }
  }

  async companyInformationSearch(
    searchTerm: string,
    limit: number,
    cursor?: string,
  ): Promise<RskCompanySearchItems | null> {
    const offset = cursor ? decodeBase64(cursor) : '0'
    const searchResults = await this.companyRegistrySearchApi.searchCompanies({
      searchString: searchTerm,
      fetchSize: limit,
      fetchOffset: +decodeBase64(offset) ?? 0,
    })
    if (
      !searchResults.items ||
      !searchResults?.count ||
      searchResults.count < 1
    ) {
      return {
        data: [],
        totalCount: 0,
        pageInfo: {
          endCursor: toBase64('0'),
          hasNextPage: false,
        },
      }
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

    const totalLength = searchResults.count
    const resultOffset = searchResults.offset ?? 0
    const endCursor = toBase64(
      (resultOffset + formattedSearchResults.length).toString(),
    )

    return {
      data: formattedSearchResults,
      totalCount: totalLength,
      pageInfo: {
        endCursor: endCursor,
        hasNextPage: !!searchResults.hasMore,
      },
    }
  }
}
