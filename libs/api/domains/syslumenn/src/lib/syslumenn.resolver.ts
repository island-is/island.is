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
import { VehicleRegistration } from './models/vehicleRegistration'
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
import { GetVehicleInput } from './dto/getVehicle.input'
import { RegistryPerson } from './models/registryPerson'
import { GetRegistryPersonInput } from './dto/getRegistryPerson.input'
import { JourneymanLicencesResponse } from './models/journeymanLicence'
import { ProfessionRightsResponse } from './models/professionRights'
import { ManyPropertyDetail } from './models/manyPropertyDetail'
import { GetElectronicIDInput } from './dto/getElectronicID.input'
import { BurningPermitsResponse } from './models/burningPermits'
import { ReligiousOrganizationsResponse } from './models/religiousOrganizations'
import { DrivingInstructorsResponse } from './models/drivingInstructors'

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

  @Query(() => VehicleRegistration)
  syslumennGetVehicle(
    @Args('input') input: GetVehicleInput,
  ): Promise<VehicleRegistration> {
    return this.syslumennService.getVehicle(input.vehicleId)
  }

  @Directive(cacheControlDirective())
  @Query(() => RegistryPerson)
  @BypassAuth()
  syslumennGetRegistryPerson(
    @Args('input') input: GetRegistryPersonInput,
  ): Promise<RegistryPerson> {
    const person = this.syslumennService.getRegistryPerson(input.nationalId)
    return person
  }

  @Query(() => PropertyDetail, { nullable: true })
  @Scopes(ApiScope.assets)
  searchForProperty(
    @Args('input') input: SearchForPropertyInput,
  ): Promise<PropertyDetail> {
    return this.syslumennService.getPropertyDetails(input.propertyNumber)
  }

  @Query(() => ManyPropertyDetail, { nullable: true })
  @Scopes(ApiScope.assets)
  searchForAllProperties(
    @Args('input') input: SearchForPropertyInput,
  ): Promise<ManyPropertyDetail> {
    return this.syslumennService.getAllPropertyDetails(
      input.propertyNumber,
      input.propertyType ?? '0',
    )
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

  @Directive(cacheControlDirective())
  @Query(() => JourneymanLicencesResponse)
  @BypassAuth()
  async getJourneymanLicences(): Promise<JourneymanLicencesResponse> {
    const licences = await this.syslumennService.getJourneymanLicences()
    return { licences }
  }

  @Directive(cacheControlDirective())
  @Query(() => ProfessionRightsResponse)
  @BypassAuth()
  async getProfessionRights(): Promise<ProfessionRightsResponse> {
    const professionRights = await this.syslumennService.getProfessionRights()
    return { list: professionRights }
  }

  @Directive(cacheControlDirective())
  @Query(() => Boolean)
  @BypassAuth()
  async getSyslumennElectronicIDStatus(
    @Args('input') input: GetElectronicIDInput,
  ): Promise<boolean> {
    return this.syslumennService.hasElectronicID(input.nationalId)
  }

  @Directive(cacheControlDirective())
  @Query(() => BurningPermitsResponse)
  @BypassAuth()
  async getBurningPermits(): Promise<BurningPermitsResponse> {
    const burningPermits = await this.syslumennService.getBurningPermits()
    return { list: burningPermits }
  }

  @Directive(cacheControlDirective())
  @Query(() => ReligiousOrganizationsResponse)
  @BypassAuth()
  async getReligiousOrganizations(): Promise<ReligiousOrganizationsResponse> {
    const items = await this.syslumennService.getReligiousOrganizations()
    return { list: items }
  }

  @Directive(cacheControlDirective())
  @Query(() => DrivingInstructorsResponse)
  @BypassAuth()
  async getSyslumennDrivingInstructors(): Promise<DrivingInstructorsResponse> {
    const items = await this.syslumennService.getDrivingInstructors()
    return { list: items }
  }
}
