import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { logger } from '@island.is/logging'

import { AudienceAndScope, ClientCredentials, TestResult } from './models'
import { DocumentProviderClientTest } from './client/documentProviderClientTest'
import { DocumentProviderClientProd } from './client/documentProviderClientProd'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error.response.message)
}

@Injectable()
export class DocumentProviderService {
  constructor(
    private documentProviderClientTest: DocumentProviderClientTest,
    private documentProviderClientProd: DocumentProviderClientProd,
  ) {}

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
    return credentials
  }

  async updateEndpoint(
    endpoint: string,
    providerId: string,
  ): Promise<AudienceAndScope> {
    // return new AudienceAndScope(
    //   'https://test-skjalaveita-island-is.azurewebsites.net',
    //   'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    // )

    const result = await this.documentProviderClientProd
      .updateEndpoint(providerId, endpoint)
      .catch(handleError)

    const audienceAndScope = new AudienceAndScope(result.audience, result.scope)
    return audienceAndScope
  }
}
