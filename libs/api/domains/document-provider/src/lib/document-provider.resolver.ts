import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ClientCredentials } from './models/clientCredentials.model'
import { AudienceAndScope } from './models/audienceAndScope.model'
import { DocumentProviderService } from './document-provider.service'
import { TestResult } from './models/testResult.model'
import { RunEndpointTestsInput } from './dto/runEndpointTests.input'
import { RegisterEndpointInput } from './dto/registerEndpoint.input'
import { RegisterProviderInput } from './dto/registerProvider.input'

@Resolver()
export class DocumentProviderResolver {
  constructor(private documentProviderService: DocumentProviderService) {}

  @Mutation(() => ClientCredentials)
  async registerProvider(
    @Args('input') input: RegisterProviderInput,
  ): Promise<ClientCredentials> {
    return this.documentProviderService.registerProvider(input.nationalId)
  }

  @Mutation(() => AudienceAndScope)
  async registerEndpoint(
    @Args('input') input: RegisterEndpointInput,
  ): Promise<AudienceAndScope> {
    return this.documentProviderService.registerEndpoint(input.endpoint)
  }

  @Mutation(() => [TestResult])
  async runEndpointTests(
    @Args('input') input: RunEndpointTestsInput,
  ): Promise<TestResult[]> {
    return this.documentProviderService.runEndpointTests(
      input.recipient,
      input.documentId,
    )
  }
}
