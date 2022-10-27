import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { FiskistofaClientService } from '@island.is/clients/fiskistofa'

import { FiskistofaGetQuotaTypesForCalendarYearInput } from './dto/getQuotaTypesForCalendarYear.input'
import { FiskistofaGetQuotaTypesForTimePeriodInput } from './dto/getQuotaTypesForTimePeriod.input'
import { FiskistofaGetShipsInput } from './dto/getShips.input'
import { FiskistofaGetShipStatusForCalendarYearInput } from './dto/getShipStatusForCalendarYear.input'
import { FiskistofaGetShipStatusForTimePeriodInput } from './dto/getShipStatusForTimePeriod.input'
import { FiskistofaGetSingleShipInput } from './dto/getSingleShip.input'
import { FiskistofaUpdateShipQuotaStatusForTimePeriodInput } from './dto/updateShipQuotaStatusForTimePeriod.input'
import { FiskistofaUpdateShipStatusForCalendarYearInput } from './dto/updateShipStatusForCalendarYear.input'
import { FiskistofaUpdateShipStatusForTimePeriodInput } from './dto/updateShipStatusForTimePeriod.input'

import { FiskistofaQuotaStatusResponse } from './models/quotaStatus'
import { FiskistofaQuotaTypeResponse } from './models/quotaType'
import { FiskistofaShipBasicInfo } from './models/shipBasicInfo'
import { FiskistofaSingleShipResponse } from './models/singleShip'
import {
  FiskistofaExtendedShipStatusInformationResponse,
  FiskistofaShipStatusInformationResponse,
  FiskistofaExtendedShipStatusInformationUpdateResponse,
} from './models/shipStatusInformation'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class FiskistofaResolver {
  constructor(
    private readonly fiskistofaClientService: FiskistofaClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaExtendedShipStatusInformationResponse)
  fiskistofaGetShipStatusForTimePeriod(
    @Args('input') input: FiskistofaGetShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForTimePeriod(input)
  }

  @Query(() => FiskistofaExtendedShipStatusInformationUpdateResponse)
  fiskistofaUpdateShipStatusForTimePeriod(
    @Args('input') input: FiskistofaUpdateShipStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForTimePeriod(input)
  }

  @Query(() => FiskistofaQuotaStatusResponse)
  fiskistofaUpdateShipQuotaStatusForTimePeriod(
    @Args('input') input: FiskistofaUpdateShipQuotaStatusForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.updateShipQuotaStatusForTimePeriod(
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaShipStatusInformationResponse)
  fiskistofaGetShipStatusForCalendarYear(
    @Args('input') input: FiskistofaGetShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.getShipStatusForCalendarYear(input)
  }

  @Query(() => FiskistofaShipStatusInformationResponse)
  fiskistofaUpdateShipStatusForCalendarYear(
    @Args('input') input: FiskistofaUpdateShipStatusForCalendarYearInput,
  ) {
    return this.fiskistofaClientService.updateShipStatusForCalendarYear(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaQuotaTypeResponse)
  fiskistofaGetQuotaTypesForTimePeriod(
    @Args('input') input: FiskistofaGetQuotaTypesForTimePeriodInput,
  ) {
    return this.fiskistofaClientService.getQuotaTypesForTimePeriod(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => FiskistofaQuotaTypeResponse)
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
  @Query(() => FiskistofaSingleShipResponse)
  fiskistofaGetSingleShip(@Args('input') input: FiskistofaGetSingleShipInput) {
    return this.fiskistofaClientService.getSingleShip(input)
  }
}
