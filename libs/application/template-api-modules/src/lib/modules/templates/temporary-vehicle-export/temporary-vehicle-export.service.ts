import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  CurrentVehiclesWithMilageAndNextInspDto,
  VehicleSearchApi,
} from '@island.is/clients/vehicles'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { FetchError } from '@island.is/clients/middlewares'
import { RskKilometragjaldReimbursementClient } from '@island.is/clients/rsk/kilometragjald-reimbursement'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ArrivalSubmission,
  EligibleVehicle,
  EligibleVehiclesResponse,
  MileageOriginCode,
  RegisteredMileage,
  SkatturinnSubmission,
  getArrivalMileage,
  getDepartureDate,
  getDepartureMileage,
  getSelectedPermno,
  m,
  toDate,
  usesLatestMileage,
} from '@island.is/application/templates/temporary-vehicle-export'
import format from 'date-fns/format'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { AttachmentS3Service } from '../../shared/services'

const VEHICLES_PAGE_SIZE = 100

// Only vehicles that pay the kilometre fee and whose mileage the user is
// allowed to register are relevant for the exemption
const eligibleVehiclesFilter = {
  showOwned: true,
  showCoowned: true,
  showOperated: true,
  onlyMileageRequiredVehicles: true,
  onlyMileageRegisterableVehicles: true,
}

@Injectable()
export class TemporaryVehicleExportService extends BaseTemplateApiService {
  constructor(
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly mileageReadingApi: MileageReadingApi,
    private readonly attachmentService: AttachmentS3Service,
    private readonly reimbursementClient: RskKilometragjaldReimbursementClient,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.TEMPORARY_VEHICLE_EXPORT)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mileageApiWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getEligibleVehicles({
    auth,
  }: TemplateApiModuleActionProps): Promise<EligibleVehiclesResponse> {
    const api = this.vehiclesApiWithAuth(auth)
    const vehicles: EligibleVehicle[] = []

    let page = 1
    let totalPages = 1
    do {
      const result = await api.currentvehicleswithmileageandinspGet({
        ...eligibleVehiclesFilter,
        page,
        pageSize: VEHICLES_PAGE_SIZE,
      })
      vehicles.push(...(result.data ?? []).flatMap(toEligibleVehicle))
      totalPages = result.totalPages ?? 1
      page++
    } while (page <= totalPages)

    if (vehicles.length === 0) {
      throw new TemplateApiError(
        {
          title: m.prerequisites.noEligibleVehicles,
          summary: m.prerequisites.noEligibleVehicles,
        },
        400,
      )
    }

    return { vehicles }
  }

  async registerDepartureMileage({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<RegisteredMileage> {
    const permno = getSelectedPermno(application.answers)
    const mileage = getDepartureMileage(application.answers)

    if (usesLatestMileage(application.answers)) {
      return this.verifyLatestMileage(auth, permno, mileage)
    }

    return this.registerMileage(
      auth,
      permno,
      mileage,
      MileageOriginCode.DEPARTURE,
    )
  }

  /**
   * Registers the arrival mileage at Samgöngustofa and then sends the trip to
   * Skatturinn. Skatturinn is not called if the registration fails.
   */
  async submitArrival(
    props: TemplateApiModuleActionProps,
  ): Promise<ArrivalSubmission> {
    const mileage = await this.registerArrivalMileage(props)
    const skatturinn = await this.submitToSkatturinn(props)
    return { mileage, skatturinn }
  }

  private async registerArrivalMileage({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<RegisteredMileage> {
    const permno = getSelectedPermno(application.answers)
    const departureMileage = getDepartureMileage(application.answers)
    const mileage = getArrivalMileage(application.answers)

    if (
      mileage !== undefined &&
      departureMileage !== undefined &&
      mileage < departureMileage
    ) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.mileageLowerThanDeparture,
        },
        400,
      )
    }

    return this.registerMileage(
      auth,
      permno,
      mileage,
      MileageOriginCode.ARRIVAL,
    )
  }

  private async submitToSkatturinn({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<SkatturinnSubmission> {
    const { answers } = application
    const permno = getSelectedPermno(answers)
    const departureDate = toIsoDate(getDepartureDate(answers))
    const departureMileage = getDepartureMileage(answers)
    const arrivalDate = toIsoDate(
      getValueViaPath<string>(answers, 'arrival.date'),
    )
    const arrivalMileage = getArrivalMileage(answers)

    if (
      !permno ||
      !departureDate ||
      departureMileage === undefined ||
      !arrivalDate ||
      arrivalMileage === undefined
    ) {
      throw new TemplateApiError(
        {
          title: m.errors.submitToSkatturinnFailed,
          summary: m.errors.missingTripInformation,
        },
        400,
      )
    }

    const files = await this.attachmentService.getFiles(application, [
      'proofOfTravel',
    ])
    if (files.length === 0 || files.some((file) => !file.fileContent)) {
      throw new TemplateApiError(
        {
          title: m.errors.submitToSkatturinnFailed,
          summary: m.errors.proofOfTravelUnreadable,
        },
        400,
      )
    }

    try {
      const reimbursement = await this.reimbursementClient.submitApplication(
        auth,
        {
          fastnr: permno,
          departureDate,
          departureMileage,
          useExistingMileageRegistration: usesLatestMileage(answers),
          arrivalDate,
          arrivalMileage,
          files: files.map((file) => ({
            fileName: file.fileName,
            content: Buffer.from(file.fileContent, 'base64'),
          })),
        },
      )
      return { id: reimbursement.id, status: reimbursement.status }
    } catch (error) {
      this.logger.error('Temporary vehicle export: Skatturinn submit failed', {
        applicationId: application.id,
        error,
      })
      throw new TemplateApiError(
        {
          title: m.errors.submitToSkatturinnFailed,
          summary: m.errors.tryAgainLater,
        },
        500,
      )
    }
  }

  /**
   * Used instead of registering a departure reading when the applicant uses
   * the latest reading at Samgöngustofa. Makes sure no newer reading has been
   * registered since the application fetched it.
   */
  private async verifyLatestMileage(
    auth: Auth,
    permno: string | undefined,
    mileage: number | undefined,
  ): Promise<RegisteredMileage> {
    if (!permno || mileage === undefined) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: 'Missing permno or latest mileage in application answers',
        },
        400,
      )
    }

    const vehicle = await this.getEligibleVehicle(auth, permno)
    if (!vehicle) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.vehicleNotFound,
        },
        400,
      )
    }

    if (vehicle.latestMileage !== mileage) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.latestMileageChanged,
        },
        400,
      )
    }

    return { permno, mileage, readDate: vehicle.latestMileageReadDate }
  }

  /**
   * Registers a mileage reading at Samgöngustofa with the given origin code.
   * Samgöngustofa keeps one reading per vehicle per day, so if a reading has
   * already been registered today (e.g. a retry or a reading from Mínar
   * síður) it is updated instead, keeping the origin code of this application.
   */
  private async registerMileage(
    auth: Auth,
    permno: string | undefined,
    mileage: number | undefined,
    originCode: MileageOriginCode,
  ): Promise<RegisteredMileage> {
    if (!permno || mileage === undefined) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: 'Missing permno or mileage in application answers',
        },
        400,
      )
    }

    const vehicle = await this.getEligibleVehicle(auth, permno)
    if (!vehicle) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.vehicleNotFound,
        },
        400,
      )
    }

    if (
      vehicle.latestMileage !== undefined &&
      mileage < vehicle.latestMileage
    ) {
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.mileageLowerThanLatest,
        },
        400,
      )
    }

    const api = this.mileageApiWithAuth(auth)
    try {
      const response = await api.rootPostRaw({
        postMileageReadingModel: { permno, mileage, originCode },
      })

      if (response.raw.status !== 200) {
        const reading = await response.value()
        return {
          permno,
          mileage,
          originCode,
          readDate: reading.readDate?.toISOString(),
        }
      }

      const [latestReading] = await api.getMileageReading({ permno })
      if (!latestReading?.internalId) {
        throw new Error('Could not find the existing reading to update')
      }
      await api.rootPut({
        putMileageReadingModel: {
          permno,
          internalId: latestReading.internalId,
          mileage,
          originCode,
        },
      })
      return {
        permno,
        mileage,
        originCode,
        readDate: latestReading.readDate?.toISOString(),
      }
    } catch (error) {
      this.logger.error(
        'Temporary vehicle export: registering mileage at Samgöngustofa failed',
        { originCode, error },
      )
      const reason = getSamgongustofaErrorMessage(error)
      if (reason) {
        throw new TemplateApiError(
          { title: m.errors.mileageRejected, summary: reason },
          400,
        )
      }
      throw new TemplateApiError(
        {
          title: m.errors.registerMileageFailed,
          summary: m.errors.tryAgainLater,
        },
        500,
      )
    }
  }

  private async getEligibleVehicle(
    auth: Auth,
    permno: string,
  ): Promise<EligibleVehicle | undefined> {
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      ...eligibleVehiclesFilter,
      permno,
    })
    const wanted = permno.trim().toUpperCase()
    return (result.data ?? [])
      .flatMap(toEligibleVehicle)
      .find((vehicle) => vehicle.permno.trim().toUpperCase() === wanted)
  }
}

/**
 * Samgöngustofa explains a rejected reading in `Errors[].errorMess`, e.g. when
 * the mileage rises more than is allowed per day since the last reading
 */
const getSamgongustofaErrorMessage = (error: unknown): string | undefined => {
  if (!(error instanceof FetchError)) {
    return undefined
  }
  const body = error.body as
    | { Errors?: Array<{ errorMess?: string | null }> | null }
    | undefined
  const messages = (body?.Errors ?? [])
    .map((item) => item.errorMess?.trim())
    .filter((message): message is string => !!message)
  return messages.length > 0 ? messages.join(' ') : undefined
}

const toIsoDate = (value?: string): string | undefined => {
  const date = toDate(value)
  return date ? format(date, 'yyyy-MM-dd') : undefined
}

const toEligibleVehicle = (
  vehicle: CurrentVehiclesWithMilageAndNextInspDto,
): EligibleVehicle[] =>
  vehicle.permno
    ? [
        {
          permno: vehicle.permno,
          make: vehicle.make ?? undefined,
          color: vehicle.colorName ?? undefined,
          latestMileage: vehicle.latestMileage ?? undefined,
          latestMileageReadDate:
            vehicle.latestMileageReadDate?.toISOString() ?? undefined,
        },
      ]
    : []
