import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { GetOperatingLicensesInput } from './dto/getOperatingLicenses.input'
import { Homestay } from './models/homestay'
import { SyslumennAuction } from './models/syslumennAuction'
import { SyslumennService } from './syslumenn.service'
import { PaginatedOperatingLicenses } from './models/paginatedOperatingLicenses'

const cacheTime = process.env.CACHE_TIME || 300

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Directive(cacheControlDirective())
  @Query(() => [Homestay])
  getHomestays(@Args('input') input: GetHomestaysInput): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
  }

  // Note: We don't cache the Auction data, as it's prone to changes only minutes before the auction takes place.
  @Query(() => [SyslumennAuction])
  getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    return this.syslumennService.getSyslumennAuctions()
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedOperatingLicenses)
  getOperatingLicenses(
    @Args('input') input: GetOperatingLicensesInput,
  ): Promise<PaginatedOperatingLicenses> {
    return this.syslumennService.getOperatingLicenses(
      input.searchBy,
      input.pageNumber,
      input.pageSize,
    )
  }
}
