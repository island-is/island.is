import { Injectable } from '@nestjs/common'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import { GetBulkMileageVehicleListInput } from '../../dto/getBulkMileageVehicleList.input'
import isSameDay from 'date-fns/isSameDay'
import { ISLAND_IS_ORIGIN_CODE } from '../vehicles.constants'
import { MileageReadingDto } from '../../dto/mileageReading.dto'
import { BulkVehicleList } from '../../dto/bulkVehicleList.dto'
import { PostBulkVehicleMileageInput } from '../../dto/postBulkVehicleMileageReading.input'
import { VehiclesService } from './api-domains-vehicles.service'

@Injectable()
export class BulkMileageService {
  constructor(
    private vehiclesApi: VehicleSearchApi,
    private mileageReadingApi: MileageReadingApi,
    private oldService: VehiclesService,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async postMileageReading(
    user: User,
    input: PostBulkVehicleMileageInput,
  ): Promise<boolean> {
    const isAllowed = await this.oldService.isAllowedMileageRegistration(
      user,
      input.permNo,
    )
    if (!isAllowed) {
      return false
    }

    const res = await this.getMileageWithAuth(user).rootPost({
      postMileageReadingModel: {
        permno: input.permNo,
        originCode: input.originCode,
        mileage: input.mileage,
      },
    })

    return !!res
  }

  async checkIfAuthorizedForVehicle(
    user: User,
    permNo: string,
  ): Promise<boolean> {
    return await this.getVehiclesWithAuth(user)
      .basicVehicleInformationGet({
        clientPersidno: user.nationalId,
        permno: permNo,
      })
      .catch(() => {
        return false
      })
      .then(() => {
        return true
      })
  }

  async getUserVehiclesPagedResponse(
    user: User,
    input: GetBulkMileageVehicleListInput,
  ): Promise<BulkVehicleList> {
    const pagedResponse = await this.getVehiclesWithAuth(
      user,
    ).currentvehicleswithmileageandinspGet(input)

    return {
      pageNumber: pagedResponse.pageNumber,
      pageSize: pagedResponse.pageSize,
      totalPages: pagedResponse.totalPages,
      totalRecords: pagedResponse.totalRecords,
      vehicles:
        pagedResponse?.data
          ?.map((d) => {
            if (!d.make || !d.permno) {
              return null
            }
            return {
              title: d.make,
              permNo: d.permno,
              vehicleMileageRegistration: {
                canRegisterMileage: !!d.canRegisterMilage,
              },
            }
          })
          .filter(isDefined) ?? [],
    }
  }

  checkIfIsEditing = (
    latestRegistrationDate: Date,
    registrationOriginCode: string,
  ) => {
    const today = new Date()
    return (
      isSameDay(latestRegistrationDate, today) &&
      registrationOriginCode == ISLAND_IS_ORIGIN_CODE
    )
  }

  async getBulkMileageReadings(user: User, permNos: Array<string>) {
    const promises = Promise.allSettled(
      permNos.map((p) => this.getMileageReadings(user, p)),
    )
    const mileages: Array<MileageReadingDto> = []
    for (const resultArray of await promises) {
      if (resultArray.status === 'fulfilled' && resultArray.value) {
        mileages.push(resultArray.value)
      }
    }

    return mileages
  }

  async getMileageReadings(
    user: User,
    permNo: string,
  ): Promise<MileageReadingDto | null> {
    if (!this.checkIfAuthorizedForVehicle(user, permNo)) {
      return null
    }

    const data = await this.getMileageWithAuth(user).getMileageReading({
      permno: permNo,
    })

    if (data.length <= 0) {
      return null
    }
    const latestRegistration = data?.[0]

    return {
      isEditing:
        latestRegistration.readDate && latestRegistration.originCode
          ? this.checkIfIsEditing(
              latestRegistration.readDate,
              latestRegistration.originCode,
            )
          : false,
      readings: data.map((reading) => ({
        date: reading.readDate ?? undefined,
        origin: reading.originCode ?? undefined,
        mileage: reading.mileage ?? undefined,
      })),
    }
  }
}
