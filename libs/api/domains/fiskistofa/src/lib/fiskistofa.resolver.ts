import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetQuotaTypesForCalendarYear } from './dto/getQuotaTypesForCalendarYear.input'
import { GetQuotaTypesForTimePeriod } from './dto/getQuotaTypesForTimePeriod.input'
import { GetShipsInput } from './dto/getShips.input'
import { GetShipStatusForCalendarYear } from './dto/getShipStatusForCalendarYear.input'
import { GetShipStatusForTimePeriod } from './dto/getShipStatusForTimePeriod.input'
import { GetUpdatedShipStatusForCalendarYear } from './dto/getUpdatedShipStatusForCalendarYear.input'
import { GetUpdatedShipStatusForTimePeriod } from './dto/getUpdatedShipStatusForTimePeriod.input'

import { QuotaType } from './models/fish'
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
  getShipStatusForTimePeriod(@Args('input') input: GetShipStatusForTimePeriod) {
    return this.fiskistofaClientService.getShipStatusForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => ExtendedShipStatusInformationUpdate)
  getUpdatedShipStatusForTimePeriod(
    @Args('input') input: GetUpdatedShipStatusForTimePeriod,
  ) {
    return this.fiskistofaClientService.getUpdatedShipStatusForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getShipStatusForCalendarYear(
    @Args('input') input: GetShipStatusForCalendarYear,
  ) {
    return this.fiskistofaClientService.getShipStatusForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => ShipStatusInformation)
  getUpdatedShipStatusForCalendarYear(
    @Args('input') input: GetUpdatedShipStatusForCalendarYear,
  ) {
    return this.fiskistofaClientService.getUpdatedShipStatusForCalendarYear(
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => [QuotaType])
  getQuotaTypesForTimePeriod(@Args('input') input: GetQuotaTypesForTimePeriod) {
    return this.fiskistofaClientService.getQuotaTypesForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [QuotaType])
  getQuotaTypesForCalendarYear(
    @Args('input') input: GetQuotaTypesForCalendarYear,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [ShipBasicInfo])
  getShips(@Args('input') input: GetShipsInput) {
    return this.fiskistofaClientService.getShips(input)
  }
}
