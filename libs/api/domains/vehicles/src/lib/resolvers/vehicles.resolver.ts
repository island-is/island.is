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
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { VehiclesList, VehiclesListV2 } from '../models/usersVehicles.model'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
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
      return {
        vehicleList: res.data,
        paging: {
          pageNumber: res.pageNumber,
          pageSize: res.pageSize,
          totalPages: res.totalPages,
          totalRecords: res.totalRecords,
        },
        downloadServiceUrls: !input?.type
          ? {
              excel: `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/excel`,
              pdf: `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/pdf`,
            }
          : null,
      }
    } else {
      const res = await this.vehiclesService.getVehiclesForUserOldService(
        user,
        false,
        false,
      )
      const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership`
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
    return {
      vehicleList: res.data?.map((vehicle) => {
        return {
          ...vehicle,
          canRegisterMileage: vehicle.canRegisterMilage,
        }
      }),
      downloadServiceUrls: {
        excel: `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/excel`,
        pdf: `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/pdf/`,
      },
      paging: {
        pageNumber: res.pageNumber,
        pageSize: res.pageSize,
        totalPages: res.totalPages,
        totalRecords: res.totalRecords,
      },
    }
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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @CacheControl(defaultCache)
  @Query(() => VehiclesPublicVehicleSearch, { nullable: true })
  @Audit()
  async getPublicVehicleSearch(
    @Args('input') input: GetPublicVehicleSearchInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getPublicVehicleSearch(user, input.search)
  }
}
