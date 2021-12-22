import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { Homestay } from './models/homestay'
import { SyslumennAuction } from './models/syslumennAuction'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { OperatingLicense } from './models/operatingLicense'
import { CertificateInfoRepsonse } from './models/certificateInfo'
import { DistrictCommissionersAgenciesRepsonse } from './models/districtCommissionersAgencies'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'

const cacheTime = process.env.CACHE_TIME || 300

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Directive(cacheControlDirective())
  @Query(() => [Homestay])
  @BypassAuth()
  getHomestays(@Args('input') input: GetHomestaysInput): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
  }

  // Note: We don't cache the Auction data, as it's prone to changes only minutes before the auction takes place.
  @Query(() => [SyslumennAuction])
  @BypassAuth()
  getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    return this.syslumennService.getSyslumennAuctions()
  }

  @Directive(cacheControlDirective())
  @Query(() => [OperatingLicense])
  @BypassAuth()
  getOperatingLicenses(): Promise<OperatingLicense[]> {
    return this.syslumennService.getOperatingLicenses()
  }

  @Query(() => CertificateInfoRepsonse)
  @Scopes(ApiScope.internal)
  getSyslumennCertificateInfo(
    @CurrentUser() user: User,
  ): Promise<CertificateInfoRepsonse> {
    return this.syslumennService.getCertificateInfo(user.nationalId)
  }

  @Query(() => [DistrictCommissionersAgenciesRepsonse])
  @BypassAuth()
  getSyslumennDistrictCommissionersAgencies(): Promise<
    DistrictCommissionersAgenciesRepsonse[]
  > {
    return this.syslumennService.getDistrictCommissionersAgencies()
  }
}
