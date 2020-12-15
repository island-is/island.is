import { Injectable } from '@nestjs/common'
import { AudienceAndScope } from './models/audienceAndScope.model'
import { ClientCredentials } from './models/clientCredentials.model'
import { TestResult } from './models/testResult.model'

@Injectable()
export class DocumentProviderService {
  async registerProvider(nationalId: string): Promise<ClientCredentials> {
    // Return a dummy for now
    const credentials = new ClientCredentials()
    credentials.clientId = '5016d8d5cb6ce0758107b9969ea3c301'
    credentials.clientSecret =
      '7a557951364a960a608735371db61ed8ed320d6bfc59f52fe37fc08e23dbd8d1'
    return credentials
  }

  async registerEndpoint(endpoint: string): Promise<AudienceAndScope> {
    // Return a dummy for now
    const audienceAndScope = new AudienceAndScope()
    audienceAndScope.audience =
      'https://test-skjalaveita-island-is.azurewebsites.net'
    audienceAndScope.scope =
      'https://test-skjalaveita-island-is.azurewebsites.net/api/v1/customer/.default'
    return audienceAndScope
  }

  async runEndpointTests(
    recipient: string,
    documentId: string,
  ): Promise<TestResult[]> {
    // Return a dummy for now
    const list: TestResult[] = []
    const result1 = new TestResult()
    result1.id = 'getDocumentIndexfromMailbox'
    result1.isValid = true
    result1.message = 'Skjal fannst fyrir skráða kennitölu.'
    list.push(result1)

    const result2 = new TestResult()
    result2.id = 'getDocumentFromEndpoint'
    result2.isValid = false
    result2.message = 'Ekki tókst að sækja skjal til skjalaveitu.'
    list.push(result2)

    return list
  }
}
