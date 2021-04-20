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
  UpdateOrganisationInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
  CreateContactInput,
  CreateHelpdeskInput,
} from './dto'
import { OrganisationsApi, ProvidersApi } from '../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  if (error.response?.data) {
    throw new ApolloError(error.response.data, error.status)
  } else {
    throw new ApolloError('Failed to resolve request', error.status)
  }
}

@Injectable()
export class DocumentProviderService {
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

  providersApiWithAuth(authorization: Auth) {
    return this.providersApi.withMiddleware(new AuthMiddleware(authorization))
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

  async organisationExists(
    nationalId: string,
    authorization: Auth,
  ): Promise<boolean> {
    const organisation = await this.organisationsApiWithAuth(authorization)
      .organisationControllerFindByNationalId({ nationalId })
      .catch(() => {
        //Find returns 404 error if organisation is not found. Do nothing.
      })

    return !organisation ? false : true
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

  async isLastModifierOfOrganisation(
    organisationNationalId: string,
    authorization: Auth,
  ): Promise<boolean> {
    return await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerIsLastModifierOfOrganisation({
      nationalId: organisationNationalId,
    })
  }

  //-------------------- PROVIDER --------------------------

  async createProviderOnTest(
    nationalId: string,
    clientName: string,
    authorization: Auth,
  ): Promise<ClientCredentials> {
    // return new ClientCredentials(
    //   '5016d8d5cb6ce0758107b9969ea3c301',
    //   '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1',
    //   'd6a4d279-6243-46d1-81c0-d98b825959bc',
    // )

    const isLastModifier = await this.isLastModifierOfOrganisation(
      nationalId,
      authorization,
    )

    if (!isLastModifier) {
      throw new ApolloError(
        'Forbidden. User is not last modifier of organisation.',
        '403',
      )
    }

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
    xroad: boolean,
  ): Promise<AudienceAndScope> {
    // return new AudienceAndScope(
    //   'https://test-skjalaveita-island-is.azurewebsites.net',
    //   'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    // )

    const result = await this.documentProviderClientTest
      .updateEndpoint(providerId, endpoint, xroad)
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
    authorization: Auth,
  ): Promise<ClientCredentials> {
    // return new ClientCredentials(
    //   '5016d8d5cb6ce0758107b9969ea3c301',
    //   '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1',
    //   'd6a4d279-6243-46d1-81c0-d98b825959bc',
    // )

    const isLastModifier = await this.isLastModifierOfOrganisation(
      nationalId,
      authorization,
    )

    if (!isLastModifier) {
      throw new ApolloError(
        'Forbidden. User is not last modifier of organisation.',
        '403',
      )
    }

    const result = await this.documentProviderClientProd
      .createClient(nationalId, clientName)
      .catch(handleError)

    const credentials = new ClientCredentials(
      result.clientId,
      result.clientSecret,
      result.providerId,
    )

    // Get the current organisation from nationalId
    const organisation = await this.getOrganisation(nationalId, authorization)

    if (!organisation) {
      throw new ApolloError('Could not find organisation.')
    }

    // Create provider for organisation
    const dto = {
      createProviderDto: {
        externalProviderId: credentials.providerId,
        organisationId: organisation.id,
      },
    }

    const provider = await this.providersApiWithAuth(
      authorization,
    ).providerControllerCreateProvider(dto)

    if (!provider) {
      throw new ApolloError('Could not create provider.')
    }

    return credentials
  }

  async updateEndpoint(
    endpoint: string,
    providerId: string,
    xroad: boolean,
    authorization: Auth,
  ): Promise<AudienceAndScope> {
    // return new AudienceAndScope(
    //   'https://test-skjalaveita-island-is.azurewebsites.net',
    //   'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    // )

    const result = await this.documentProviderClientProd
      .updateEndpoint(providerId, endpoint, xroad)
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

    const updatedProvider = await this.providersApiWithAuth(
      authorization,
    ).providerControllerUpdateProvider(dto)

    if (!updatedProvider) {
      throw new ApolloError('Could not update provider.')
    }

    return audienceAndScope
  }
}
