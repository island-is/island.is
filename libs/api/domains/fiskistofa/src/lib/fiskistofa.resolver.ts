import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetQuotaTypesForCalendarYearInput } from './dto/getQuotaTypesForCalendarYear.input'
import { GetQuotaTypesForTimePeriodInput } from './dto/getQuotaTypesForTimePeriod.input'
import { GetShipsInput } from './dto/getShips.input'
import { GetShipStatusForCalendarYearInput } from './dto/getShipStatusForCalendarYear.input'
import { GetShipStatusForTimePeriodInput } from './dto/getShipStatusForTimePeriod.input'
import { GetSingleShipInput } from './dto/getSingleShip.input'
import { UpdateShipQuotaStatusForTimePeriodInput } from './dto/updateShipQuotaStatusForTimePeriod.input'
import { UpdateShipStatusForCalendarYearInput } from './dto/updateShipStatusForCalendarYear.input'
import { UpdateShipStatusForTimePeriodInput } from './dto/updateShipStatusForTimePeriod.input'
import { QuotaStatus } from './models/quotaStatus'
import { QuotaType } from './models/quotaType'
import { ShipBasicInfo } from './models/shipBasicInfo'
import {
  ExtendedShipStatusInformation,
  ExtendedShipStatusInformationUpdate,
  ShipStatusInformation,
} from './models/shipStatusInformation'
import { SingleShip } from './models/singleShip'

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
  updateShipStatusForTimePeriod(
    @Args('input') input: UpdateShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Mutation(() => QuotaStatus)
  updateShipQuotaStatusForTimePeriod(
    @Args('input') input: UpdateShipQuotaStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipQuotaStatusForTimePeriod(
      input,
    )
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
  updateShipStatusForCalendarYear(
    @Args('input') input: UpdateShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForCalendarYear(input)
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

  @Directive(cacheControlDirective())
  @Query(() => SingleShip)
  getSingleShip(@Args('input') input: GetSingleShipInput) {
    return this.fiskistofaClientService.getSingleShip(input)
  }
}
