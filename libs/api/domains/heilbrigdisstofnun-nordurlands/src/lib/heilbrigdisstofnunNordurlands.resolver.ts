import { HeilbrigdisstofnunNordurlandsClientService } from '@island.is/clients/heilbrigdisstofnun-nordurlands'
import { Directive, Resolver } from '@nestjs/graphql'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class HeilbrigdisstofnunNordurlandsResolver {
  constructor(
    private readonly heilbrigdisstofnunNordurlandsClientService: HeilbrigdisstofnunNordurlandsClientService,
  ) {}

  @Directive(cacheControlDirective())
  getResources() {
    return this.heilbrigdisstofnunNordurlandsClientService.getResources()
  }
}
