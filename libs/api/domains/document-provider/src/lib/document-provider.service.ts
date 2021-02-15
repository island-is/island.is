import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { logger } from '@island.is/logging'

import {
  AudienceAndScope,
  ClientCredentials,
  Contact,
  TestResult,
  Organisation,
  Helpdesk,
} from './models'
import { DocumentProviderClientTest } from './client/documentProviderClientTest'
import { DocumentProviderClientProd } from './client/documentProviderClientProd'
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
} from './dto'
import { OrganisationsApi, ProvidersApi } from '../../gen/fetch'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class DocumentProviderService {
  constructor(
    private documentProviderClientTest: DocumentProviderClientTest,
    private documentProviderClientProd: DocumentProviderClientProd,
    private organisationsApi: OrganisationsApi,
    private providersApi: ProvidersApi,
  ) {}

  async getOrganisations(): Promise<Organisation[]> {
    return await this.organisationsApi
      .organisationControllerGetOrganisations()
      .catch(handleError)
  }

  async getOrganisation(nationalId: string): Promise<Organisation> {
    return await this.organisationsApi
      .organisationControllerFindByNationalId({ nationalId })
      .catch(handleError)
  }

  async createOrganisation(
    input: CreateOrganisationInput,
  ): Promise<Organisation> {
    const createOrganisationDto = { ...input }

    return await this.organisationsApi
      .organisationControllerCreateOrganisation({ createOrganisationDto })
      .catch(handleError)
  }

  async updateOrganisation(
    id: string,
    organisation: UpdateOrganisationInput,
  ): Promise<Organisation> {
    const dto = {
      id,
      updateOrganisationDto: { ...organisation },
    }

    return await this.organisationsApi
      .organisationControllerUpdateOrganisation(dto)
      .catch(handleError)
  }

  async updateAdministrativeContact(
    organisationId: string,
    contactId: string,
    contact: UpdateContactInput,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      administrativeContactId: contactId,
      updateContactDto: { ...contact },
    }

    return await this.organisationsApi
      .organisationControllerUpdateAdministrativeContact(dto)
      .catch(handleError)
  }

  async updateTechnicalContact(
    organisationId: string,
    contactId: string,
    contact: UpdateContactInput,
  ): Promise<Contact> {
    const dto = {
      id: organisationId,
      technicalContactId: contactId,
      updateContactDto: { ...contact },
    }

    return await this.organisationsApi
      .organisationControllerUpdateTechnicalContact(dto)
      .catch(handleError)
  }

  async updateHelpdesk(
    organisationId: string,
    helpdeskId: string,
    helpdesk: UpdateHelpdeskInput,
  ): Promise<Helpdesk> {
    const dto = {
      id: organisationId,
      helpdeskId: helpdeskId,
      updateHelpdeskDto: { ...helpdesk },
    }

    return await this.organisationsApi
      .organisationControllerUpdateHelpdesk(dto)
      .catch(handleError)
  }

  //-------------------- PROVIDER --------------------------

  async createProviderOnTest(
    nationalId: string,
    clientName: string,
  ): Promise<ClientCredentials> {
    // return new ClientCredentials(
    //   '5016d8d5cb6ce0758107b9969ea3c301',
    //   '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1',
    //   'd6a4d279-6243-46d1-81c0-d98b825959bc',
    // )

    const result = await this.documentProviderClientTest
      .createClient(nationalId, clientName)
      .catch(handleError)

    const credentials = new ClientCredentials(
      result.clientId,
      result.clientSecret,
      result.providerId,
    )
    return credentials
  }

  async updateEndpointOnTest(
    endpoint: string,
    providerId: string,
  ): Promise<AudienceAndScope> {
    // return new AudienceAndScope(
    //   'https://test-skjalaveita-island-is.azurewebsites.net',
    //   'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    // )

    const result = await this.documentProviderClientTest
      .updateEndpoint(providerId, endpoint)
      .catch(handleError)

    const audienceAndScope = new AudienceAndScope(result.audience, result.scope)
    return audienceAndScope
  }

  async runEndpointTests(
    recipient: string,
    documentId: string,
    providerId: string,
  ): Promise<TestResult[]> {
    //return [new TestResult('getMessageFromMailbox', true, 'Skjal fannst.')]

    const results = await this.documentProviderClientTest
      .runTests(providerId, recipient, documentId)
      .catch(handleError)

    return results.map((result) => {
      return new TestResult(result.id, result.isValid, result.message)
    })
  }

  async createProvider(
    nationalId: string,
    clientName: string,
  ): Promise<ClientCredentials> {
    // return new ClientCredentials(
    //   '5016d8d5cb6ce0758107b9969ea3c301',
    //   '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1',
    //   'd6a4d279-6243-46d1-81c0-d98b825959bc',
    // )

    const result = await this.documentProviderClientProd
      .createClient(nationalId, clientName)
      .catch(handleError)

    const credentials = new ClientCredentials(
      result.clientId,
      result.clientSecret,
      result.providerId,
    )

    // Get the current organisation from nationalId
    const organisation = await this.getOrganisation(nationalId)

    if (!organisation) {
      throw new ApolloError('Could not find organisation.')
    }

    // Create provider for organisation
    const createProviderDto = {
      externalProviderId: credentials.providerId,
      organisationId: organisation.id,
    }

    const provider = await this.providersApi.providerControllerCreateProvider({
      createProviderDto,
    })

    if (!provider) {
      throw new ApolloError('Could not create provider.')
    }

    return credentials
  }

  async updateEndpoint(
    endpoint: string,
    providerId: string,
    xroad = false,
  ): Promise<AudienceAndScope> {
    // return new AudienceAndScope(
    //   'https://test-skjalaveita-island-is.azurewebsites.net',
    //   'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    // )

    const result = await this.documentProviderClientProd
      .updateEndpoint(providerId, endpoint)
      .catch(handleError)

    const audienceAndScope = new AudienceAndScope(result.audience, result.scope)

    // Find provider by externalProviderId
    const provider = await this.providersApi.providerControllerFindByExternalId(
      { id: providerId },
    )

    // Update the provider
    const dto = {
      id: provider.id,
      updateProviderDto: {
        endpoint,
        endpointType: 'REST',
        apiScope: audienceAndScope.scope,
        xroad,
      },
    }

    const updatedProvider = await this.providersApi.providerControllerUpdateProvider(
      dto,
    )

    if (!updatedProvider) {
      throw new ApolloError('Could not update provider.')
    }

    return audienceAndScope
  }
}
