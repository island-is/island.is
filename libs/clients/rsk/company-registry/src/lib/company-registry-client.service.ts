import { Inject, Injectable } from '@nestjs/common'

import { handle404 } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { CompanyItem, DefaultApi, SearchCompanyItem } from './gen/fetch'
import {
  CompanyAddressType,
  CompanyExtendedInfo,
  CompanySearchResults,
  SearchRequest,
} from './types'

@Injectable()
export class CompanyRegistryClientService {
  constructor(
    private api: DefaultApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  public async getCompany(
    companyId: string,
  ): Promise<CompanyExtendedInfo | null> {
    const company = await this.api.ssidGet({ ssid: companyId }).catch(handle404)

    return company ? this.formatCompanyExtendedInfo(company) : null
  }

  public async searchCompanies(
    input: SearchRequest,
  ): Promise<CompanySearchResults> {
    const searchResults = await this.api.searchSearchStringGet(input)
    const formattedSearchResults =
      searchResults.items?.map(this.formatCompanyInfo(input.searchString)) ?? []

    return {
      items: formattedSearchResults,
      hasMore: searchResults.hasMore ?? false,
      count: searchResults.count ?? 0,
      limit: searchResults.limit ?? 0,
      offset: searchResults.offset ?? 0,
    }
  }

  private formatCompanyExtendedInfo(company: CompanyItem): CompanyExtendedInfo {
    const addresses =
      company.heimilisfang?.map((item) => ({
        type: item.gerd as CompanyAddressType,
        streetAddress: item.heimilisfang,
        postalCode: item.postnumer,
        locality: item.stadur,
        municipalityNumber: item.sveitarfelaganumer,
        isPostbox: item.erPostholf === '1',
        region: item.byggd,
        country: item.land,
      })) ?? []
    return {
      nationalId: company.kennitala,
      name: company.nafn,
      dateOfRegistration: company.skrad ? new Date(company.skrad) : undefined,
      status: company.stada,
      formOfOperation:
        company.rekstrarform?.map((item) => ({
          type: item.tegund,
          name: item.heiti,
        })) ?? [],
      addresses,
      address: addresses.find(
        (address) => address.type === CompanyAddressType.address,
      ),
      legalDomicile: addresses.find(
        (address) => address.type === CompanyAddressType.legalDomicile,
      ),
      relatedParty:
        company.tengdirAdilar?.map((item) => ({
          type: item.tegund,
          nationalId: item.kennitala,
          name: item.nafn,
        })) ?? [],
      vat:
        company.virdisaukaskattur?.map((item) => ({
          vatNumber: item.vskNumer,
          dateOfRegistration: new Date(item.skrad),
          dateOfDeregistration: item.afskraning
            ? new Date(item.afskraning)
            : undefined,
          classification: item.flokkun?.map((classification) => ({
            type: classification.gerd,
            classificationSystem: classification.flokkunarkerfi,
            number: classification.numer,
            name: classification.heiti,
          })),
        })) ?? [],
      lastUpdated: company.sidastUppfaert
        ? new Date(company.sidastUppfaert)
        : undefined,
    }
  }

  private formatCompanyInfo(query: string) {
    return (item: SearchCompanyItem) => {
      if (item.nafn == null || item.kennitala == null || item.stada == null) {
        this.logger.warn(
          `Unexpected null field in company registry search results`,
          {
            query,
            item,
          },
        )
      }
      return {
        name: item.nafn ?? '',
        status: item.stada ?? '',
        dateOfRegistration: item.skrad ? new Date(item.skrad) : undefined,
        nationalId: item.kennitala ?? '',
        vatNumber: item.vskNumer,
        lastUpdated: item.sidastUppfaert
          ? new Date(item.sidastUppfaert)
          : undefined,
      }
    }
  }
}
