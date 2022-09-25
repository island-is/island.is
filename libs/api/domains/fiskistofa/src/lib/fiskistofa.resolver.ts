import { FiskistofaClientService } from '@island.is/clients/fiskistofa'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { FiskistofaGetQuotaTypesForCalendarYearInput } from './dto/getQuotaTypesForCalendarYear.input'
import { FiskistofaGetQuotaTypesForTimePeriodInput } from './dto/getQuotaTypesForTimePeriod.input'
import { FiskistofaGetShipsInput } from './dto/getShips.input'
import { FiskistofaGetShipStatusForCalendarYearInput } from './dto/getShipStatusForCalendarYear.input'
import { FiskistofaGetShipStatusForTimePeriodInput } from './dto/getShipStatusForTimePeriod.input'
import { FiskistofaGetSingleShipInput } from './dto/getSingleShip.input'
import { FiskistofaUpdateShipQuotaStatusForTimePeriodInput } from './dto/updateShipQuotaStatusForTimePeriod.input'
import { FiskistofaUpdateShipStatusForCalendarYearInput } from './dto/updateShipStatusForCalendarYear.input'
import { FiskistofaUpdateShipStatusForTimePeriodInput } from './dto/updateShipStatusForTimePeriod.input'
import { FiskistofaQuotaStatus } from './models/quotaStatus'
import { FiskistofaQuotaType } from './models/quotaType'
import { FiskistofaShipBasicInfo } from './models/shipBasicInfo'
import {
  FiskistofaExtendedShipStatusInformation,
  FiskistofaExtendedShipStatusInformationUpdate,
  FiskistofaShipStatusInformation,
} from './models/shipStatusInformation'
import { FiskistofaSingleShip } from './models/singleShip'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class FiskistofaResolver {
  constructor(
    private readonly fiskistofaClientService: FiskistofaClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaExtendedShipStatusInformation)
  fiskistofaGetShipStatusForTimePeriod(
    @Args('input') input: FiskistofaGetShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForTimePeriod(input)
  }

  @Query(() => FiskistofaExtendedShipStatusInformationUpdate)
  fiskistofaUpdateShipStatusForTimePeriod(
    @Args('input') input: FiskistofaUpdateShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForTimePeriod(input)
  }

  @Query(() => FiskistofaQuotaStatus)
  fiskistofaUpdateShipQuotaStatusForTimePeriod(
    @Args('input') input: FiskistofaUpdateShipQuotaStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipQuotaStatusForTimePeriod(
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaShipStatusInformation)
  fiskistofaGetShipStatusForCalendarYear(
    @Args('input') input: FiskistofaGetShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForCalendarYear(input)
  }

  @Query(() => FiskistofaShipStatusInformation)
  fiskistofaUpdateShipStatusForCalendarYear(
    @Args('input') input: FiskistofaUpdateShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [FiskistofaQuotaType])
  fiskistofaGetQuotaTypesForTimePeriod(
    @Args('input') input: FiskistofaGetQuotaTypesForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [FiskistofaQuotaType])
  fiskistofaGetQuotaTypesForCalendarYear(
    @Args('input') input: FiskistofaGetQuotaTypesForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [FiskistofaShipBasicInfo])
  fiskistofaGetShips(@Args('input') input: FiskistofaGetShipsInput) {
    return this.fiskistofaClientService.getShips(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaSingleShip)
  fiskistofaGetSingleShip(@Args('input') input: FiskistofaGetSingleShipInput) {
    return this.fiskistofaClientService.getSingleShip(input)
  }
}
