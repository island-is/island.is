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
import { VehiclesBulkMileageRegistrationRequestCollection } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestsCollection.model'
import { LOG_CATEGORY } from '../constants'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FetchError } from '@island.is/clients/middlewares'
import { VehiclesBulkMileageRegistrationRequestVehicleCollection } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestVehicleCollection.model'
import { VehiclesBulkMileageReadingResponse } from '../models/v3/bulkMileage/bulkMileageReadingResponse.model'

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
      await this.getMileageWithAuth(auth)
        .requestbulkmileagereadingPostRaw({
          postBulkMileageReadingModel: {
            reportingPersidno: auth.nationalId,
            originCode: input.originCode,
            mileageData: input.mileageData.map((m) => ({
              permno: m.vehicleId,
              mileage: m.mileageNumber,
            })),
          },
        })
        .then((res) => {
          return res.value()
        })
        .catch((e) => {
          if (e instanceof FetchError && e.status === 429) {
            this.logger.warn(
              'Too many bulk mileage registration requests happening at once',
              {
                category: LOG_CATEGORY,
                error: e,
              },
            )
            return {
              guid: '123',
              errorMessage:
                'Too many bulk mileage registration requests at once. Wait a few minutes',
            }
          }
          throw e
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
      vehicleId: res.guid,
      errorMessage: res.errorMessage ?? undefined,
    }
  }

  async getBulkMileageReadingRequests(
    auth: User,
  ): Promise<VehiclesBulkMileageRegistrationRequestCollection | null> {
    const res = await this.getMileageWithAuth(
      auth,
    ).getbulkmileagereadingrequestsPersidnoGet({ persidno: auth.nationalId })

    return {
      requests: res
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

  async getBulkMileageReadingRequestById(
    auth: User,
    input: GetbulkmileagereadingrequeststatusGuidGetRequest['guid'],
  ): Promise<VehiclesBulkMileageRegistrationRequestVehicleCollection> {
    const data = await this.getMileageWithAuth(
      auth,
    ).getbulkmileagereadingrequeststatusGuidGet({ guid: input })

    return {
      vehicles: data
        .map((d) => {
          if (!d.guid || !d.permno) {
            return null
          }
          return {
            guid: d.guid,
            permNo: d.permno,
            mileage: d.mileage ?? undefined,
            returnCode: d.returnCode ?? undefined,
            errors: d.errors
              ? d.errors?.map((e) => ({
                  code: e.errorCode ?? undefined,
                  message: e.errorText ?? undefined,
                }))
              : undefined,
          }
        })
        .filter(isDefined),
    }
  }
}
