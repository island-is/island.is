import { Injectable } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { logger } from '@island.is/logging'

import {
  AudienceAndScope,
  ClientCredentials,
  TestResult,
  Organisation,
} from '../models'
import { DocumentProviderClientTest } from '../client/documentProviderClientTest'
import { DocumentProviderClientProd } from '../client/documentProviderClientProd'

import { OrganisationsApi, ProvidersApi } from '../../../gen/fetch'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  if (error.response?.data) {
    throw new GraphQLError(error.response.data, {
      extensions: { code: error.status },
    })
  } else {
    throw new GraphQLError('Failed to resolve request', {
      extensions: { code: error.status },
    })
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

  //-------------------- PROVIDER --------------------------

  async createProviderOnTest(
    nationalId: string,
    clientName: string,
    authorization: Auth,
  ): Promise<ClientCredentials> {
    await this.checkIfLastModifier(nationalId, authorization)

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
    nationalId: string,
    endpoint: string,
    providerId: string,
    xroad: boolean,
    authorization: Auth,
  ): Promise<AudienceAndScope> {
    await this.checkIfLastModifier(nationalId, authorization)

    const result = await this.documentProviderClientTest
      .updateEndpoint(providerId, endpoint, xroad)
      .catch(handleError)

    const audienceAndScope = new AudienceAndScope(result.audience, result.scope)
    return audienceAndScope
  }

  async runEndpointTests(
    nationalId: string,
    recipient: string,
    documentId: string,
    providerId: string,
    authorization: Auth,
  ): Promise<TestResult[]> {
    await this.checkIfLastModifier(nationalId, authorization)

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
    await this.checkIfLastModifier(nationalId, authorization)

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
      throw new GraphQLError('Could not find organisation.')
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
      throw new GraphQLError('Could not create provider.')
    }

    return credentials
  }

  async updateEndpoint(
    nationalId: string,
    endpoint: string,
    providerId: string,
    xroad: boolean,
    authorization: Auth,
  ): Promise<AudienceAndScope> {
    await this.checkIfLastModifier(nationalId, authorization)

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
      throw new GraphQLError('Could not update provider.')
    }

    return audienceAndScope
  }

  //-------------------- HELPER FUNCTIONS --------------------------

  async checkIfLastModifier(
    organisationNationalId: string,
    authorization: Auth,
  ): Promise<void> {
    const isLastModifier = await this.organisationsApiWithAuth(
      authorization,
    ).organisationControllerIsLastModifierOfOrganisation({
      nationalId: organisationNationalId,
    })

    if (!isLastModifier) {
      throw new GraphQLError(
        'Forbidden. User is not last modifier of organisation.',
        { extensions: { code: '403' } },
      )
    }
  }
}
