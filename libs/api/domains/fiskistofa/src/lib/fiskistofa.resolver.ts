import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetAflamarkInformationForShipInput } from './dto/getAflamarkInformationForShip.input'
import { GetDeilistofnaInformationForShipInput } from './dto/getDeilistofnaInformationForShip.input'
import { GetUpdatedAflamarkInformationForShipInput } from './dto/getUpdatedAflamarkInformationForShip.input'
import { GetUpdatedDeilistofnaInformationForShipInput } from './dto/getUpdatedDeilistofnaInformationForShip.input'
import {
  ExtendedShipStatusInformation,
  ShipStatusInformation,
} from './models/shipStatusInformation'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class FiskistofaResolver {
  constructor(
    private readonly fiskistofaClientService: FiskistofaClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => ExtendedShipStatusInformation)
  getShipStatusInformation(
    @Args('input') input: GetAflamarkInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getAflamarkInformationForShip(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => ExtendedShipStatusInformation)
  getUpdatedShipStatusInformation(
    @Args('input') input: GetUpdatedAflamarkInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getUpdatedAflamarkInformationForShip(
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getDeilistofnaInformationForShip(
    @Args('input') input: GetDeilistofnaInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getDeilistofnaInformationForShip(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getUpdatedDeilistofnaInformationForShip(
    @Args('input') input: GetUpdatedDeilistofnaInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getDeilistofnaInformationForShip(input)
  }
}
