import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Injectable } from '@nestjs/common'
import { DocumentProviderClientTest } from '../client/documentProviderClientTest'
import { DocumentProviderClientProd } from '../client/documentProviderClientProd'
import { OrganisationsApi, ProvidersApi } from '../../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { Contact, Helpdesk, Organisation, ProviderStatistics } from '../models'
import {
  CreateContactInput,
  CreateHelpdeskInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
  UpdateOrganisationInput,
} from '../dto'

const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  if (error.response?.data) {
    throw new ApolloError(error.response.data, error.status)
  } else {
    throw new ApolloError('Failed to resolve request', error.status)
  }
}

@Injectable()
export class AdminDocumentProviderService {
  constructor(
    private documentProviderClientTest: DocumentProviderClientTest,
    private documentProviderClientProd: DocumentProviderClientProd,
    private organisationsApi: OrganisationsApi,
    private providersApi: ProvidersApi,
  ) {}

  organisationsApiWithAuth(authorization: Auth) {
    return this.organisationsApi.withMiddleware(
      new AuthMiddleware(authorization),
    )
  }

  async getOrganisations(authorization: Auth): Promise<Organisation[]> {
    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerGetOrganisations({})
      .catch(handleError)
  }

  async getOrganisation(
    nationalId: string,
    authorization: Auth,
  ): Promise<Organisation> {
    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerFindByNationalId({ nationalId })
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerUpdateOrganisation(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerCreateAdministrativeContact(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerUpdateAdministrativeContact(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerCreateTechnicalContact(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerUpdateTechnicalContact(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerCreateHelpdesk(dto)
      .catch(handleError)
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

    return await this.organisationsApiWithAuth(authorization)
      .organisationControllerUpdateHelpdesk(dto)
      .catch(handleError)
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

    const result = await this.documentProviderClientProd
      .statisticsTotal(providers, fromDate, toDate)
      .catch(handleError)

    return new ProviderStatistics(
      result.published,
      result.notifications,
      result.opened,
    )
  }
}
