import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetQuotaTypesForCalendarYearInput } from './dto/getQuotaTypesForCalendarYear.input'
import { GetQuotaTypesForTimePeriodInput } from './dto/getQuotaTypesForTimePeriod.input'
import { GetShipsInput } from './dto/getShips.input'
import { GetShipStatusForCalendarYearInput } from './dto/getShipStatusForCalendarYear.input'
import { GetShipStatusForTimePeriodInput } from './dto/getShipStatusForTimePeriod.input'
import { GetUpdatedShipStatusForCalendarYearInput } from './dto/getUpdatedShipStatusForCalendarYear.input'
import { GetUpdatedShipStatusForTimePeriodInput } from './dto/getUpdatedShipStatusForTimePeriod.input'

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
  getShipStatusForTimePeriod(
    @Args('input') input: GetShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => ExtendedShipStatusInformationUpdate)
  getUpdatedShipStatusForTimePeriod(
    @Args('input') input: GetUpdatedShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getUpdatedShipStatusForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => ShipStatusInformation)
  getShipStatusForCalendarYear(
    @Args('input') input: GetShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => ShipStatusInformation)
  getUpdatedShipStatusForCalendarYear(
    @Args('input') input: GetUpdatedShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getUpdatedShipStatusForCalendarYear(
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => [QuotaType])
  getQuotaTypesForTimePeriod(
    @Args('input') input: GetQuotaTypesForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [QuotaType])
  getQuotaTypesForCalendarYear(
    @Args('input') input: GetQuotaTypesForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [ShipBasicInfo])
  getShips(@Args('input') input: GetShipsInput) {
    return this.fiskistofaClientService.getShips(input)
  }
}
