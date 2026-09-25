import { Directive, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { TaxiClient } from '@island.is/clients/transport-authority/taxi'
import { TaxiStation, TaxiStationsResponse } from '../models/taxiStations.model'

const cacheControlDirective = (ms = 3600) => `@cacheControl(maxAge: ${ms})`

@Resolver(() => TaxiStation)
export class TaxiStationsResolver {
  constructor(private readonly taxiClient: TaxiClient) {}

  @Directive(cacheControlDirective())
  @Query(() => TaxiStationsResponse)
  @BypassAuth()
  async getTaxiStations(): Promise<TaxiStationsResponse> {
    const stations = await this.taxiClient.getValidStations()
    return { stations: stations ?? [] }
  }
}
