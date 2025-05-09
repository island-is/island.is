import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { BypassAuth } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { VehiclesList, VehiclesListV2 } from '../models/usersVehicles.model'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail, VehiclesExcel } from '../models/getVehicleDetail.model'
import { VehiclesVehicleSearch } from '../models/getVehicleSearch.model'
import { GetPublicVehicleSearchInput } from '../dto/getPublicVehicleSearchInput'
import { VehiclesPublicVehicleSearch } from '../models/getPublicVehicleSearch.model'
import {
  GetVehiclesForUserInput,
  GetVehiclesListV2Input,
} from '../dto/getVehiclesForUserInput'
import { GetVehicleSearchInput } from '../dto/getVehicleSearchInput'
import { VehiclesService } from '../services/vehicles.service'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Scopes(ApiScope.vehicles)
  @Directive(
    '@deprecated(reason: "Too slow. Use VehiclesListV2 when possible.")',
  )
  @Query(() => VehiclesList, {
    name: 'vehiclesList',
    nullable: true,
    deprecationReason: 'Too slow. Use VehiclesListV2 when possible.',
  })
  @Audit()
  async getVehicleList(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input?: GetVehiclesForUserInput,
  ) {
    if (input) {
      const res = await this.vehiclesService.getVehiclesForUser(user, input)
      const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`
      return {
        vehicleList: res.data,
        paging: {
          pageNumber: res.pageNumber,
          pageSize: res.pageSize,
          totalPages: res.totalPages,
          totalRecords: res.totalRecords,
        },
        downloadServiceURL: !input?.type ? downloadServiceURL : null,
      }
    } else {
      const res = await this.vehiclesService.getVehiclesForUserOldService(
        user,
        false,
        false,
      )
      const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`
      return { ...res?.data, downloadServiceURL }
    }
  }

  @Scopes(ApiScope.vehicles, ApiScope.carRecycling)
  @Query(() => VehiclesListV2, { name: 'vehiclesListV2', nullable: true })
  @Audit()
  async getVehicleListV2(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: GetVehiclesListV2Input,
  ) {
    const res = await this.vehiclesService.getVehiclesListV2(user, input)
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`
    return {
      vehicleList: res.data?.map((vehicle) => {
        return {
          ...vehicle,
          canRegisterMileage: vehicle.canRegisterMilage,
        }
      }),
      downloadServiceURL,
      paging: {
        pageNumber: res.pageNumber,
        pageSize: res.pageSize,
        totalPages: res.totalPages,
        totalRecords: res.totalRecords,
      },
    }
  }

  @Scopes(ApiScope.vehicles)
  @Query(() => VehiclesExcel, { name: 'getExcelVehicles', nullable: true })
  async getExcelVehicles(@CurrentUser() user: User) {
    const res = await this.vehiclesService.getExcelVehiclesForUser(user)
    return { ...res }
  }

  @Scopes(ApiScope.vehicles, ApiScope.samgongustofaVehicles)
  @Query(() => VehiclesDetail, { name: 'vehiclesDetail', nullable: true })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    const data = await this.vehiclesService.getVehicleDetail(user, {
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/history/${input.permno}`
    return { ...data, downloadServiceURL }
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => Number, {
    name: 'vehiclesSearchLimit',
    nullable: true,
  })
  @Audit()
  async getVehiclesSearchLimit(@CurrentUser() user: User) {
    return await this.vehiclesService.getSearchLimit(user)
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => VehiclesVehicleSearch, {
    name: 'vehiclesSearch',
    nullable: true,
  })
  @Audit()
  async getVehicleSearch(
    @Args('input') input: GetVehicleSearchInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehiclesSearch(user, input.search)
  }

  @BypassAuth()
  @CacheControl(defaultCache)
  @Query(() => VehiclesPublicVehicleSearch, { nullable: true })
  async getPublicVehicleSearch(
    @Args('input') input: GetPublicVehicleSearchInput,
  ) {
    return await this.vehiclesService.getPublicVehicleSearch(input.search)
  }
}
