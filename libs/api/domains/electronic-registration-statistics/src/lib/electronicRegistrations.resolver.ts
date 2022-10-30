import { ElectronicRegistrationsClientService } from '@island.is/clients/electronic-registration-statistics'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetBrokenDownElectronicRegistrationStatisticsInput } from './dto/getBrokenDownElectronicRegistrationStatistics.input'
import { BrokenDownRegistrationStatistic } from './models/brokenDownRegistrationStatistic'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class ElectronicRegistrationsResolver {
  constructor(
    private readonly electronicRegistrationsClientService: ElectronicRegistrationsClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => [BrokenDownRegistrationStatistic])
  getBrokenDownElectronicRegistrationStatistics(
    @Args('input') input: GetBrokenDownElectronicRegistrationStatisticsInput,
  ) {
    return this.electronicRegistrationsClientService.getBrokenDownElectronicRegistrationStatistics(
      input,
    )
  }
}
