import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { MileageReadingApi } from '../../gen/fetch'
import { GetMileageReadingInput } from './inputs/getMileageReadings.input'
import {
  MileageHistoryDto,
  mapMileageReadingsDto,
} from './dtos/mileageReading.dto'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class VehiclesMileageClientService {
  constructor(
    private readonly mileageReadingApi: MileageReadingApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private getMileageWithAuth = (user: User) => {
    return this.mileageReadingApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )
  }

  getMileageHistory = async (
    user: User,
    input: GetMileageReadingInput,
  ): Promise<MileageHistoryDto | null> => {
    const res = await this.getMileageWithAuth(user).getMileageReading({
      permno: input.vehicleId,
      includeDeleted: false,
    })

    const samplePermno = res.length > 0 ? res[0].permno : undefined

    if (!samplePermno) {
      this.logger.warn('Mileage response has no vehicle id, invalid response')
      return null
    }

    return {
      vehicleId: samplePermno,
      registrationHistory: mapMileageReadingsDto(res),
    }
  }
}
