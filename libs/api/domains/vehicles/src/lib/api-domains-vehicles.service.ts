import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PdfApi,
  VehicleSearchDto,
  PublicVehicleSearchApi,
  PersidnoLookupResultDto,
} from '@island.is/clients/vehicles'
import {
  GetMileageReadingRequest,
  MileageReadingApi,
} from '@island.is/clients/vehicles-mileage'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { VehicleMileageDetail } from '../models/getVehicleMileage.model'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VehicleSearchApi) private vehiclesApi: VehicleSearchApi,
    @Inject(MileageReadingApi) private mileageReadingApi: MileageReadingApi,
    @Inject(PdfApi) private vehiclesPDFApi: PdfApi,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehiclesForUser(
    auth: User,
    showDeregistered: boolean,
    showHistory: boolean,
    nextCursor?: string,
  ): Promise<PersidnoLookupResultDto> {
    return await this.getVehiclesWithAuth(auth).vehicleHistoryGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: showDeregistered,
      showHistory: showHistory,
      cursor: nextCursor,
    })
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
  ): Promise<VehicleSearchDto | null> {
    const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
      search,
    })
    const { data } = res
    if (!data) return null
    return data[0]
  }

  async getPublicVehicleSearch(search: string) {
    const data = await this.publicVehiclesApi.publicVehicleSearchGet({
      search,
    })
    return data
  }

  async getSearchLimit(auth: User): Promise<number | null> {
    const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
    if (!res) return null
    return res
  }

  async getVehicleDetail(
    auth: User,
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null> {
    const res = await this.getVehiclesWithAuth(auth).basicVehicleInformationGet(
      {
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      },
    )

    if (!res) return null

    return basicVehicleInformationMapper(res, auth.nationalId)
  }

  async getVehicleMileage(
    auth: User,
    input: GetMileageReadingRequest,
  ): Promise<VehicleMileageDetail[] | null> {
    const res = await this.getMileageWithAuth(auth).getMileageReading({
      permno: input.permno,
    })
    if (!res) return null

    return res
  }
}
