import { Resolver, Query, Args, ID } from '@nestjs/graphql'
import { OneSystemsRulingsService } from './oneSystemsRulings.service'
import {
  OneSystemsRulingsResponse,
  OneSystemsRulingPdfResponse,
} from './graphql/models'
import { GetOneSystemsRulingsInput } from './graphql/dto'

@Resolver()
export class OneSystemsRulingsResolver {
  constructor(private readonly rulingsService: OneSystemsRulingsService) {}

  @Query(() => OneSystemsRulingsResponse, { name: 'oneSystemsRulings' })
  async getRulings(
    @Args('input') input: GetOneSystemsRulingsInput,
  ): Promise<OneSystemsRulingsResponse> {
    return this.rulingsService.getRulings(input)
  }

  @Query(() => OneSystemsRulingPdfResponse, { name: 'oneSystemsRulingPdf' })
  async getRulingPdf(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<OneSystemsRulingPdfResponse> {
    return this.rulingsService.getRulingPdf(id)
  }
}
