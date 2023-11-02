import { Inject, Injectable } from '@nestjs/common'
import { RskCompany } from './models/rskCompany.model'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { RskCompanySearchItems } from './models/rskCompanySearchItems.model'
import { decodeBase64, toBase64 } from './rsk-company-info.utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { User } from '@island.is/auth-nest-tools'
import { RskCompanyRelatedParty } from './models/rskCompanyRelatedParty.model'

@Injectable()
export class RskCompanyInfoService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly companyRegistryClient: CompanyRegistryClientService,
    private readonly rskRelationshipsClient: RskRelationshipsClient,
  ) {}

  async getCompanyInformationWithExtra(
    nationalId: string,
  ): Promise<RskCompany | null> {
    this.logger.debug(`Service getting company by nationalId ${nationalId}`)
    const company = await this.companyRegistryClient.getCompany(nationalId)
    if (!company) {
      return null
    }
    this.logger.debug(`Company in service ${company.toString()}`)
    return {
      ...company,
      companyInfo: {
        ...company,
      },
    }
  }

  async companyInformationSearch(
    searchTerm: string,
    limit: number,
    cursor?: string,
  ): Promise<RskCompanySearchItems> {
    const offset = cursor ? decodeBase64(cursor) : '0'
    const searchResults = await this.companyRegistryClient.searchCompanies({
      searchString: searchTerm,
      limit,
      offset: parseInt(offset, 10) || 0,
    })

    const resultOffset = searchResults.offset
    const endCursor = toBase64((resultOffset + searchResults.count).toString())

    return {
      data: searchResults.items,
      pageInfo: {
        endCursor: endCursor,
        hasNextPage: searchResults.hasMore,
      },
    }
  }

  /**
   * Search for legal entities by name or national id
   */
  async getLegalEntityRelationships(
    user: User,
    nationalId: string,
  ): Promise<RskCompanyRelatedParty[] | null> {
    const legalEntityRelationships =
      await this.rskRelationshipsClient.getLegalEntityRelationships(
        user,
        nationalId,
      )

    if (!legalEntityRelationships?.relationships) return null

    return legalEntityRelationships.relationships.map((t) => ({
      name: t.name ?? '',
      nationalId: t.nationalId ?? '',
      type: t.type ?? '',
    }))
  }
}
