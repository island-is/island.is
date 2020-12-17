import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'

import { DocumentProviderClient } from './client/documentProviderClient'
import { DocumentProviderRepository } from './document-provider.repository'
import { AudienceAndScope, ClientCredentials, TestResult } from './models'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error.response.message)
}

@Injectable()
export class DocumentProviderService {
  constructor(
    private documentProviderRepository: DocumentProviderRepository,
    private documentProviderClient: DocumentProviderClient,
  ) {}

  async registerProvider(
    nationalId: string,
    clientName: string,
  ): Promise<ClientCredentials> {
    logger.info(`Create client: ${nationalId} - ${clientName}`)

    return new ClientCredentials(
      '5016d8d5cb6ce0758107b9969ea3c301',
      '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1',
    )

    // const currentProvider = await this.documentProviderRepository.getProvider(
    //   nationalId,
    // )

    // if (currentProvider !== null) {
    //   throw new ApolloError('Provider already exists for this organisation.')
    // }

    // const result = await this.documentProviderClient
    //   .createClient(nationalId, clientName)
    //   .catch(handleError)

    // const { providerId } = result
    // await this.documentProviderRepository.saveProvider(nationalId, providerId)

    // const credentials = new ClientCredentials(
    //   result.clientId,
    //   result.clientSecret,
    // )
    // return credentials
  }

  async registerEndpoint(
    nationalId: string,
    endpoint: string,
  ): Promise<AudienceAndScope> {
    logger.info(`Register endpoint: ${nationalId} - ${endpoint}`)

    return new AudienceAndScope(
      'https://test-skjalaveita-island-is.azurewebsites.net',
      'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default',
    )

    // const providerId = await this.documentProviderRepository.getProvider(
    //   nationalId,
    // )

    // if (providerId === null) {
    //   throw new ApolloError('No provider exists for this organisation.')
    // }

    // const result = await this.documentProviderClient
    //   .updateEndpoint(providerId, endpoint)
    //   .catch(handleError)

    // const audienceAndScope = new AudienceAndScope(result.audience, result.scope)
    // return audienceAndScope
  }

  async runEndpointTests(
    nationalId: string,
    recipient: string,
    documentId: string,
  ): Promise<TestResult[]> {
    const providerId = await this.documentProviderRepository.getProvider(
      nationalId,
    )

    if (providerId === null) {
      throw new ApolloError('No provider exists for this organisation.')
    }

    const results = await this.documentProviderClient
      .runTests(providerId, recipient, documentId)
      .catch(handleError)

    return results.map((result) => {
      return new TestResult(result.id, result.isValid, result.message)
    })
  }
}
