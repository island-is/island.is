import { logger } from '@island.is/logging'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DocumentProviderClientProd } from '../client/documentProviderClientProd'
import { OrganisationsApi } from '../../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { Contact, Helpdesk, Organisation, ProviderStatistics } from '../models'
import {
  CreateContactInput,
  CreateHelpdeskInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
  UpdateOrganisationInput,
} from '../dto'
import { DocumentProviderPaperMail } from '../models/PaperMail.model'

const LOG_CATEGORY = 'document-provider-api'

@Injectable()
export class AdminDocumentProviderService {
  constructor(
    private documentProviderClientProd: DocumentProviderClientProd,
    private organisationsApi: OrganisationsApi,
  ) {}

  organisationsApiWithAuth(authorization: Auth) {
    return this.organisationsApi.withMiddleware(
      new AuthMiddleware(authorization),
    )
  }

  async getOrganisations(authorization: Auth): Promise<Organisation[]> {
    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerGetOrganisations({})
  }

  async getOrganisation(
    nationalId: string,
    authorization: Auth,
  ): Promise<Organisation> {
    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerFindByNationalId({ nationalId })
  }

  async updateOrganisation(
    id: string,
    organisation: UpdateOrganisationInput,
    authorization: Auth,
  ): Promise<Organisation> {
    const dto = {
      id,
      updateOrganisationDto: { ...organisation },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerUpdateOrganisation(dto)
  }

  async createAdministrativeContact(
    organisationId: string,
    input: CreateContactInput,
    authorization: Auth,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      createContactDto: { ...input },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerCreateAdministrativeContact(dto)
  }

  async updateAdministrativeContact(
    organisationId: string,
    contactId: string,
    contact: UpdateContactInput,
    authorization: Auth,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      administrativeContactId: contactId,
      updateContactDto: { ...contact },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerUpdateAdministrativeContact(dto)
  }

  async createTechnicalContact(
    organisationId: string,
    input: CreateContactInput,
    authorization: Auth,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      createContactDto: { ...input },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerCreateTechnicalContact(dto)
  }

  async updateTechnicalContact(
    organisationId: string,
    contactId: string,
    contact: UpdateContactInput,
    authorization: Auth,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      technicalContactId: contactId,
      updateContactDto: { ...contact },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerUpdateTechnicalContact(dto)
  }

  async createHelpdesk(
    organisationId: string,
    input: CreateHelpdeskInput,
    authorization: Auth,
  ): Promise<Helpdesk> {
    const dto = {
      id: organisationId,
      createHelpdeskDto: { ...input },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerCreateHelpdesk(dto)
  }

  async updateHelpdesk(
    organisationId: string,
    helpdeskId: string,
    helpdesk: UpdateHelpdeskInput,
    authorization: Auth,
  ): Promise<Helpdesk> {
    const dto = {
      id: organisationId,
      helpdeskId: helpdeskId,
      updateHelpdeskDto: { ...helpdesk },
    }

    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerUpdateHelpdesk(dto)
  }

  async getPaperMailList(): Promise<DocumentProviderPaperMail[]> {
    try {
      const res = await this.documentProviderClientProd.getPaperMailList()

      return res.map((item) => ({
        nationalId: item.kennitala,
        origin: item.origin,
        wantsPaper: item.wantsPaper,
        dateAdded: item.dateAdded ? new Date(item.dateAdded) : undefined,
        dateUpdated: item.dateUpdated ? new Date(item.dateUpdated) : undefined,
      }))
    } catch (e) {
      logger.error('Get paper mail list failed', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw new InternalServerErrorException(`Paper mail list service error`)
    }
  }

  //-------------------- STATISTICS --------------------------

  async getStatisticsTotal(
    authorization: Auth,
    organisationId?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<ProviderStatistics> {
    let providers = undefined

    // Get external provider ids if organisationId is included
    if (organisationId) {
      const orgProviders = await this.organisationsApiWithAuth(
        authorization,
      ).organisationControllerGetOrganisationsProviders({
        id: organisationId,
      })

      // Filter out null values and only set providers if organisation has external providers
      if (orgProviders) {
        const externalProviders = orgProviders
          .filter(
            (item) =>
              item.externalProviderId !== null &&
              item.externalProviderId !== undefined,
          )
          .map((item) => {
            return item.externalProviderId
          })

        if (externalProviders.length > 0) {
          providers = externalProviders as string[]
        }
      }
    }

    const result = await this.documentProviderClientProd.statisticsTotal(
      providers,
      fromDate,
      toDate,
    )

    return new ProviderStatistics(
      result.published,
      result.notifications,
      result.opened,
    )
  }
}
