import { Directive, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { TaxiClient } from '@island.is/clients/transport-authority/taxi'
import { TaxiDriver, TaxiDriversResponse } from '../models/taxiDrivers.model'

const cacheControlDirective = (ms = 3600) => `@cacheControl(maxAge: ${ms})`

@Resolver(() => TaxiDriver)
export class TaxiDriversResolver {
  constructor(private readonly taxiClient: TaxiClient) {}

  @Directive(cacheControlDirective())
  @Query(() => TaxiDriversResponse)
  @BypassAuth()
  async getTaxiDriversWithWorkPermit(): Promise<TaxiDriversResponse> {
    const drivers = await this.taxiClient.getDriversWithWorkPermit()
    return { drivers: drivers ?? [] }
  }

  @Directive(cacheControlDirective())
  @Query(() => TaxiDriversResponse)
  @BypassAuth()
  async getTaxiDriversWithOperatingLicence(): Promise<TaxiDriversResponse> {
    const drivers = await this.taxiClient.getDriversWithOperatingLicence()
    return { drivers: drivers ?? [] }
  }
}
