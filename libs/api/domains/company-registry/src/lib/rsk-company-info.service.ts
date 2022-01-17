import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { RskCompany } from './models/rskCompany.model'
import { CompanyApi } from '@island.is/clients/rsk-company-info'
import { RskCompanyFormOfOperation } from './models/rskCompanyFormOfOperation.model'
import { RskCompanyVat } from './models/rskCompanyVat.model'
import { RskCompanyAddress } from './models/rskCompanyAddress.model'
import { RskCompanyRelatedParty } from './models/rskCompanyRelatedParty.model'
import { RskCompanyClassification } from './models/rskCompanyClassification.model'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { decodeBase64, toBase64 } from './rsk-company-info.utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Injectable()
export class RskCompanyInfoService {
  constructor(
    private rskCompanyInfoApi: CompanyApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
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
      dateOfRegistration: company.skrad ? new Date(company.skrad) : undefined,
      status: company.stada,
      companyInfo: {
        formOfOperation:
          company.rekstrarform?.map((item) => {
            return {
              type: item.tegund,
              name: item.heiti,
              suffix: item.vidskeyti,
            } as RskCompanyFormOfOperation
          }) ?? [],
        address:
          company.heimilisfang?.map((item) => {
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
    const searchResults = await this.rskCompanyInfoApi.v1FyrirtaekjaskraSearchSearchStringGet(
      {
        searchString: searchTerm,
        limit: limit.toString(),
        offset: decodeBase64(offset),
      },
    )
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
