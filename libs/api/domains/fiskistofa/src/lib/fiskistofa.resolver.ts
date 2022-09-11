import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetAflamarkInformationForShipInput } from './dto/getAflamarkInformationForShip.input'
import { GetDeilistofnaInformationForShipInput } from './dto/getDeilistofnaInformationForShip.input'
import { GetShipsInput } from './dto/getShips.input'
import { GetUpdatedAflamarkInformationForShipInput } from './dto/getUpdatedAflamarkInformationForShip.input'
import { GetUpdatedDeilistofnaInformationForShipInput } from './dto/getUpdatedDeilistofnaInformationForShip.input'
import { Fish } from './models/fish'
import { ShipBasicInfo } from './models/shipBasicInfo'
import {
  ExtendedShipStatusInformation,
  ExtendedShipStatusInformationUpdate,
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
  getAflamarkInformationForShip(
    @Args('input') input: GetAflamarkInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getAflamarkInformationForShip(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => ExtendedShipStatusInformationUpdate)
  getUpdatedAflamarkInformationForShip(
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
  @Mutation(() => ShipStatusInformation)
  getUpdatedDeilistofnaInformationForShip(
    @Args('input') input: GetUpdatedDeilistofnaInformationForShipInput,
  ) {
    return this.fiskistofaClientService.getDeilistofnaInformationForShip(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [Fish])
  getAllFishes() {
    return this.fiskistofaClientService.getAllFishes()
  }

  @Directive(cacheControlDirective())
  @Query(() => [ShipBasicInfo])
  getShips(@Args('input') input: GetShipsInput) {
    return this.fiskistofaClientService.getShips(input)
  }
}
