import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { Homestay } from './models/homestay'
import { SyslumennAuction } from './models/syslumennAuction'
import { SyslumennService } from './syslumenn.service'

const cacheTime = process.env.CACHE_TIME || 5

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
}
