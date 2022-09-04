import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetShipStatusInformationInput } from './dto/getShipStatusInformation.input'
import { GetUpdatedShipStatusInformationInput } from './dto/getUpdatedShipStatusInformation.input'
import { ShipStatusInformation } from './models/shipStatusInformation'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class FiskistofaResolver {
  constructor(
    private readonly fiskistofaClientService: FiskistofaClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getShipStatusInformation(
    @Args('input') input: GetShipStatusInformationInput,
  ) {
    return this.fiskistofaClientService.getShipStatusInformation(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getUpdatedShipStatusInformation(
    @Args('input') input: GetUpdatedShipStatusInformationInput,
  ) {
    return this.fiskistofaClientService.getUpdatedShipStatusInformation(input)
  }
}
