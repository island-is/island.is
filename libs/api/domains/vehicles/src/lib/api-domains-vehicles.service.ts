import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PdfApi,
  VehicleSearchDto,
  PublicVehicleSearchApi,
  PersidnoLookupResultDto,
  VehicleDtoListPagedResponse,
} from '@island.is/clients/vehicles'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import {
  GetVehiclesForUserInput,
  VehicleUserTypeEnum,
} from '../dto/getVehiclesForUserInput'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VehicleSearchApi) private vehiclesApi: VehicleSearchApi,
    @Inject(PdfApi) private vehiclesPDFApi: PdfApi,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehiclesForUser(
    auth: User,
    input: GetVehiclesForUserInput,
  ): Promise<VehicleDtoListPagedResponse> {
    return await this.getVehiclesWithAuth(
      auth,
    ).vehicleHistoryRequestedPersidnoGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: input.showDegeristered,
      showHistory: input.showHistory,
      page: input.page,
      pageSize: input.pageSize,
      type: input.type,
    })
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
    page = 1,
    pageSize = 50,
  ): Promise<VehicleDtoListPagedResponse | null> {
    return await this.getVehiclesWithAuth(
      auth,
    ).vehicleHistoryRequestedPersidnoGet({
      requestedPersidno: auth.nationalId,
      permno: `${search}*`,
      page,
      pageSize,
    })
    /*const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
      search,
    })
    const { data } = res
    if (!data) return null
    return data[0]*/
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
}
