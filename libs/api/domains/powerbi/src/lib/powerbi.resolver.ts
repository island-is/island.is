import { Args, Query, Resolver } from '@nestjs/graphql'
import { PowerBiEmbedTokenInput } from './dto/powerbiEmbedToken.input'
import { PowerBiEmbedTokenResponse } from './models/powerbiEmbedTokenResponse'

@Resolver()
export class PowerBiResolver {
  @Query(() => PowerBiEmbedTokenResponse)
  powerbiEmbedToken(@Args('input') input: PowerBiEmbedTokenInput) {
    return {
      token: input.something,
    }
  }
}
