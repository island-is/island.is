import { Inject, Injectable } from '@nestjs/common'
import {
  BulkMileageReadingRequestResultDto,
  GetbulkmileagereadingrequeststatusGuidGetRequest,
  MileageReadingApi,
} from '@island.is/clients/vehicles-mileage'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { PostVehicleBulkMileageInput } from '../dto/postBulkVehicleMileage.input'
import { isDefined } from '@island.is/shared/utils'
import { LOG_CATEGORY } from '../constants'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { VehiclesBulkMileageReadingResponse } from '../models/v3/bulkMileage/bulkMileageReadingResponse.model'
import { VehiclesBulkMileageRegistrationJobHistory } from '../models/v3/bulkMileage/bulkMileageRegistrationJobHistory.model'
import { VehiclesBulkMileageRegistrationRequestStatus } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestStatus.model'
import { VehiclesBulkMileageRegistrationRequestOverview } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestOverview.model'

@Injectable()
export class BulkMileageService {
  constructor(
    private mileageReadingApi: MileageReadingApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async postBulkMileageReading(
    auth: User,
    input: PostVehicleBulkMileageInput,
  ): Promise<VehiclesBulkMileageReadingResponse | null> {
    if (!input) {
      return null
    }

    const res: BulkMileageReadingRequestResultDto =
      await this.getMileageWithAuth(auth).requestbulkmileagereadingPost({
        postBulkMileageReadingModel: {
          originCode: input.originCode,
          mileageData: input.mileageData.map((m) => ({
            permno: m.vehicleId,
            mileage: m.mileageNumber,
          })),
        },
      })

    if (!res.guid) {
      this.logger.warn(
        'Missing guid from bulk mileage reading registration response',
        {
          category: LOG_CATEGORY,
        },
      )
      return null
    }

    return {
      requestId: res.guid,
      errorMessage: res.errorMessage ?? undefined,
    }
  }

  async getBulkMileageRegistrationJobHistory(
    auth: User,
  ): Promise<VehiclesBulkMileageRegistrationJobHistory> {
    const res = await this.getMileageWithAuth(
      auth,
    ).getbulkmileagereadingrequestsGet({})

    return {
      history: res
        .map((r) => {
          if (!r.guid) {
            return null
          }

          return {
            guid: r.guid,
            reportingPersonNationalId: r.reportingPersidno ?? undefined,
            reportingPersonName: r.reportingPersidnoName ?? undefined,
            originCode: r.originCode ?? undefined,
            originName: r.originName ?? undefined,
            dateRequested: r.dateInserted ?? undefined,
            dateStarted: r.dateStarted ?? undefined,
            dateFinished: r.dateFinished ?? undefined,
          }
        })
        .filter(isDefined),
    }
  }

  async getBulkMileageRegistrationRequestStatus(
    auth: User,
    input: GetbulkmileagereadingrequeststatusGuidGetRequest['guid'],
  ): Promise<VehiclesBulkMileageRegistrationRequestStatus | null> {
    const data = await this.getMileageWithAuth(
      auth,
    ).getbulkmileagereadingrequeststatusGuidGet({ guid: input })

    if (!data.guid) {
      return null
    }

    return {
      requestId: data.guid,
      jobsSubmitted: data.totalVehicles ?? undefined,
      jobsFinished: data.done ?? undefined,
      jobsRemaining: data.remaining ?? undefined,
      jobsValid: data.processOk ?? undefined,
      jobsErrored: data.processWithErrors ?? undefined,
    }
  }

  async getBulkMileageRegistrationRequestOverview(
    auth: User,
    input: GetbulkmileagereadingrequeststatusGuidGetRequest['guid'],
  ): Promise<VehiclesBulkMileageRegistrationRequestOverview> {
    const data = await this.getMileageWithAuth(
      auth,
    ).getbulkmileagereadingrequestdetailsGuidGet({ guid: input })

    return {
      requests: data
        .map((d) => {
          if (!d.guid || !d.permno) {
            return null
          }
          return {
            guid: d.guid,
            vehicleId: d.permno,
            mileage: d.mileage ?? undefined,
            returnCode: d.returnCode ?? undefined,
            errors: d.errors?.map((e) => ({
              code: e.errorCode ?? undefined,
              message: e.errorText ?? undefined,
            })),
          }
        })
        .filter(isDefined),
    }
  }
}
