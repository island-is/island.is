import { HeilbrigdisstofnunNordurlandsClientService } from '@island.is/clients/heilbrigdisstofnun-nordurlands'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetResourcesInput } from './dto/getResources.input'
import { Resource } from './models/resource'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class HeilbrigdisstofnunNordurlandsResolver {
  constructor(
    private readonly heilbrigdisstofnunNordurlandsClientService: HeilbrigdisstofnunNordurlandsClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => [Resource])
  getResources(@Args('input') input: GetResourcesInput) {
    return this.heilbrigdisstofnunNordurlandsClientService.getResources(
      input.personSsn,
    )
  }
}
