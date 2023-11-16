import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PdfApi,
  PublicVehicleSearchApi,
  VehicleDtoListPagedResponse,
  VehicleSearchDto,
} from '@island.is/clients/vehicles'
import {
  GetMileageReadingRequest,
  MileageReadingApi,
  PostMileageReadingModel,
  ReturnTypeMessage,
  RootPostRequest,
} from '@island.is/clients/vehicles-mileage'
import type { Auth, User, AuthMiddleware } from '@island.is/auth-nest-tools'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { VehiclesDetail, VehiclesExcel } from '../models/getVehicleDetail.model'
import { GetVehiclesForUserInput } from '../dto/getVehiclesForUserInput'
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
    input: GetVehiclesForUserInput,
  ): Promise<VehicleDtoListPagedResponse> {
    return await this.getVehiclesWithAuth(
      auth,
    ).vehicleHistoryRequestedPersidnoGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: input.showDeregeristered,
      showHistory: input.showHistory,
      page: input.page,
      pageSize: input.pageSize,
      type: input.type,
      dtFrom: input.dateFrom,
      dtTo: input.dateTo,
      permno: input.permno
        ? input.permno.length < 5
          ? `${input.permno}*`
          : `${input.permno}`
        : undefined,
    })
  }

  async getExcelVehiclesForUser(auth: User): Promise<VehiclesExcel> {
    const res = await this.getVehiclesWithAuth(auth).ownershipReportDataGet({
      ssn: auth.nationalId,
    })

    return {
      persidno: res.persidno ?? undefined,
      name: res.name ?? undefined,
      vehicles: res.vehicles?.map((item) =>
        basicVehicleInformationMapper(item),
      ),
    }
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

    return basicVehicleInformationMapper(res)
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

  async getVehicleMileage(
    auth: User,
    input: GetMileageReadingRequest,
  ): Promise<VehicleMileageDetail[] | null> {
    const res = await this.getMileageWithAuth(auth).getMileageReading({
      permno: input.permno,
    })
    return res
  }

  async postMileageReading(
    auth: User,
    input: RootPostRequest['postMileageReadingModel'],
  ): Promise<PostMileageReadingModel | ReturnTypeMessage[] | null> {
    if (!input) return null

    const res = await this.getMileageWithAuth(auth).rootPost({
      postMileageReadingModel: input,
    })
    return res
  }
}
