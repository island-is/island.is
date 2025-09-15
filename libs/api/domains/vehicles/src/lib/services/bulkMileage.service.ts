import { Inject, Injectable } from '@nestjs/common'
import {
  GetbulkmileagereadingrequeststatusGuidGetRequest,
  MileageReadingApi,
} from '@island.is/clients/vehicles-mileage'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import {
  PostVehicleBulkMileageFileInput,
  PostVehicleBulkMileageInput,
} from '../dto/postBulkVehicleMileage.input'
import { isDefined } from '@island.is/shared/utils'
import type { Locale } from '@island.is/shared/types'
import { LOG_CATEGORY } from '../constants'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FileStorageService } from '@island.is/file-storage'
import { VehiclesBulkMileageReadingResponse } from '../models/v3/bulkMileage/bulkMileageReadingResponse.model'
import { VehiclesBulkMileageRegistrationJobHistory } from '../models/v3/bulkMileage/bulkMileageRegistrationJobHistory.model'
import { VehiclesBulkMileageRegistrationRequestStatus } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestStatus.model'
import { VehiclesBulkMileageRegistrationRequestOverview } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestOverview.model'
import { FetchError } from '@island.is/clients/middlewares'
import { IntlService } from '@island.is/cms-translations'
import { errorCodeMessageMap } from './errorCodes'
import {
  parseBufferToMileageRecord,
  getFileTypeFromUrl,
} from '../utils/parseFileToMileage'

const namespaces = ['api.bulk-vehicle-mileage']

@Injectable()
export class BulkMileageService {
  constructor(
    private mileageReadingApi: MileageReadingApi,
    private readonly intlService: IntlService,
    private readonly fileStorageService: FileStorageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async prepareDownload(file: string): Promise<string> {
    if (!file) {
      return ''
    }

    const objUrl = this.fileStorageService.getObjectUrl(file)
    const signedUrl = await this.fileStorageService.generateSignedUrl(objUrl)
    return signedUrl
  }

  private async postBulkMileageReading(
    auth: User,
    input: PostVehicleBulkMileageInput,
  ): Promise<VehiclesBulkMileageReadingResponse | null> {
    if (!input) {
      return null
    }

    try {
      const res = await this.getMileageWithAuth(
        auth,
      ).requestbulkmileagereadingPost({
        postBulkMileageReadingModel: {
          originCode: input.originCode,
          mileageData: input.mileageData,
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
      }
    } catch (e) {
      const error: Error = e
      if (error instanceof FetchError && error.status === 429) {
        return {
          requestId: undefined,
          errorCode: 429,
          errorMessage: error.statusText,
        }
      }
      throw e
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
    locale: Locale,
    input: GetbulkmileagereadingrequeststatusGuidGetRequest['guid'],
  ): Promise<VehiclesBulkMileageRegistrationRequestOverview> {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)
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
            errors: d.errors?.map((e) => {
              const warningSerial =
                e.warningSerial === -1 ? 999 : e.warningSerial

              return {
                code: e.errorCode ?? undefined,
                message: e.errorText ?? undefined,
                warningSerialCode: e.warningSerial,
                warningText: warningSerial
                  ? formatMessage(errorCodeMessageMap[warningSerial])
                  : undefined,
              }
            }),
          }
        })
        .filter(isDefined),
    }
  }

  async postBulkMileageFile(
    auth: User,
    input: PostVehicleBulkMileageFileInput,
  ): Promise<VehiclesBulkMileageReadingResponse | null> {
    const uploadUrl = await this.prepareDownload(input.fileUrl)

    // Download the file from S3 using the signed URL
    let file: Buffer | null = null
    try {
      const response = await fetch(uploadUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      file = Buffer.from(arrayBuffer)
    } catch (error) {
      this.logger.error('Failed to download file from S3', {
        category: LOG_CATEGORY,
        error: error.message,
        uploadUrl,
      })
      throw new Error('Failed to download file from S3')
    }

    if (!file || file.length === 0) {
      this.logger.error('Downloaded file is empty or null', {
        category: LOG_CATEGORY,
        uploadUrl,
      })
      throw new Error('Downloaded file is empty')
    }
    const type = input.fileType || getFileTypeFromUrl(input.fileUrl)

    const records = await parseBufferToMileageRecord(
      file,
      type as 'csv' | 'xlsx',
    )

    if (!Array.isArray(records)) {
      if (records.code === 1) {
        this.logger.debug(
          `'Fastanúmersdálk vantar eða er skrifaður rangt. Dálkanafn þarf að vera eitt af eftirfarandi; "permno", "vehicleid", "bilnumer","okutaeki","fastanumer"'`,
        )
      } else if (records.code === 2) {
        this.logger.debug(
          `'Kílómetrastöðudálkur er ekki réttur. Dálkanafn þarf að vera "mileage"'`,
        )
      } else {
        this.logger.debug(
          `'Óþekkt villa við að vinna úr skrá. Vinsamlegast reyndu aftur.'`,
        )
      }
      return null
    }

    if (!records.length) {
      this.logger.info('Upphleðsla mistókst. Engin gögn í skjali')
      return null
    }

    try {
      const res = await this.postBulkMileageReading(auth, {
        originCode: input.originCode || 'ISLAND.IS',
        mileageData: records,
      })

      this.logger.info('Bulk mileage file processed successfully', {
        category: LOG_CATEGORY,
        recordCount: records.length,
        fileSize: file.length,
      })
      return res
    } catch (error) {
      this.logger.error('Failed to process bulk mileage records', {
        category: LOG_CATEGORY,
        error: error.message,
        recordCount: records.length,
      })
      throw error
    }
  }
}
