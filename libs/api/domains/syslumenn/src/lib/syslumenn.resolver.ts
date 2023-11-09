import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { GetOperatingLicensesInput } from './dto/getOperatingLicenses.input'
import { Homestay } from './models/homestay'
import { OperatingLicensesCSV } from './models/operatingLicensesCSV'
import { SyslumennAuction } from './models/syslumennAuction'
import { RealEstateAgent } from './models/realEstateAgent'
import { Lawyer } from './models/lawyer'
import { Broker } from './models/broker'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { PaginatedOperatingLicenses } from './models/paginatedOperatingLicenses'
import { CertificateInfoResponse } from './models/certificateInfo'
import { DistrictCommissionerAgencies } from './models/districtCommissionerAgencies'
import { AssetName } from './models/assetName'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { PropertyDetail } from '@island.is/api/domains/assets'
import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { SearchForPropertyInput } from './dto/searchForProperty.input'
import { EstateRelations } from './models/relations'
import { AlcoholLicence } from './models/alcoholLicence'
import { TemporaryEventLicence } from './models/temporaryEventLicence'
import { MasterLicencesResponse } from './models/masterLicence'

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
  @Query(() => [RealEstateAgent])
  @BypassAuth()
  getRealEstateAgents(): Promise<RealEstateAgent[]> {
    return this.syslumennService.getRealEstateAgents()
  }

  @Directive(cacheControlDirective())
  @Query(() => [Lawyer])
  @BypassAuth()
  getLawyers(): Promise<Lawyer[]> {
    return this.syslumennService.getLawyers()
  }

  @Directive(cacheControlDirective())
  @Query(() => [Broker])
  @BypassAuth()
  getBrokers(): Promise<Broker[]> {
    return this.syslumennService.getBrokers()
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedOperatingLicenses)
  @BypassAuth()
  getOperatingLicenses(
    @Args('input') input: GetOperatingLicensesInput,
  ): Promise<PaginatedOperatingLicenses> {
    return this.syslumennService.getOperatingLicenses(
      input.searchBy,
      input.pageNumber,
      input.pageSize,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => OperatingLicensesCSV)
  @BypassAuth()
  getOperatingLicensesCSV(): Promise<OperatingLicensesCSV> {
    return this.syslumennService.getOperatingLicensesCSV()
  }

  @Directive(cacheControlDirective())
  @Query(() => [AlcoholLicence])
  @BypassAuth()
  getAlcoholLicences(): Promise<AlcoholLicence[]> {
    return this.syslumennService.getAlcoholLicences()
  }

  @Directive(cacheControlDirective())
  @Query(() => [TemporaryEventLicence])
  @BypassAuth()
  getTemporaryEventLicences(): Promise<TemporaryEventLicence[]> {
    return this.syslumennService.getTemporaryEventLicences()
  }

  @Query(() => CertificateInfoResponse)
  getSyslumennCertificateInfo(
    @CurrentUser() user: User,
  ): Promise<CertificateInfoResponse | null> {
    return this.syslumennService.getCertificateInfo(user.nationalId)
  }

  @Query(() => [DistrictCommissionerAgencies])
  @BypassAuth()
  getSyslumennDistrictCommissionersAgencies(): Promise<
    DistrictCommissionerAgencies[]
  > {
    return this.syslumennService.getDistrictCommissionersAgencies()
  }

  @Query(() => [AssetName])
  @BypassAuth()
  getRealEstateAddress(
    @Args('input') realEstateId: string,
  ): Promise<Array<AssetName>> {
    return this.syslumennService.getRealEstateAddress(realEstateId)
  }

  @Query(() => [AssetName])
  @BypassAuth()
  getVehicleType(
    @Args('input') licenseNumber: string,
  ): Promise<Array<AssetName>> {
    return this.syslumennService.getVehicleType(licenseNumber)
  }

  @Query(() => PropertyDetail, { nullable: true })
  @Scopes(ApiScope.assets)
  searchForProperty(
    @Args('input') input: SearchForPropertyInput,
  ): Promise<PropertyDetail> {
    return this.syslumennService.getPropertyDetails(input.propertyNumber)
  }

  @Directive(cacheControlDirective())
  @Query(() => EstateRelations)
  getSyslumennEstateRelations(): Promise<EstateRelations> {
    return this.syslumennService.getEstateRelations()
  }

  @Directive(cacheControlDirective())
  @Query(() => MasterLicencesResponse)
  @BypassAuth()
  async getMasterLicences(): Promise<MasterLicencesResponse> {
    const licences = await this.syslumennService.getMasterLicences()
    return { licences }
  }
}
