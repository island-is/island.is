import { Inject, Injectable } from '@nestjs/common'

import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  RecyclingFundClientService,
  CreateXRoadRecyclingRequestDtoRequestTypeEnum,
} from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  VehicleDto,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { User } from '@island.is/auth-nest-tools'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

// The registration number is the only thing identifying a vehicle to the fund,
// and the schema allows it to be absent. Recording the rest of an application
// while quietly dropping such a vehicle would report a recycling that never
// happened, so refuse the submission instead.
const requirePermno = (vehicle: VehicleDto): string => {
  if (!vehicle?.permno) {
    throw new Error('car-recycling: Vehicle is missing a registration number')
  }
  return vehicle.permno
}

// message and stack are non-enumerable on an Error, so logging one as a nested
// property yields an empty object. FetchError adds the status and the body.
const describeError = (error: unknown) => ({
  ...(error as object),
  message: (error as Error)?.message,
  stack: (error as Error)?.stack,
})

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly recyclingFundService: RecyclingFundClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  // Skilavottorð now runs on Úrvinnslusjóður's own servers. Every call below
  // reaches them over X-Road, and a failure throws: the client raises on any
  // non-2xx, and the service answers a refused request with 400. Letting that
  // propagate fails the application, so the citizen is told to try again rather
  // than being shown a submission that was never recorded.

  async createOwner(application: ApplicationWithAttachments, auth: User) {
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    await this.recyclingFundService.createOwner(auth, applicantName)
  }

  async createVehicle(auth: User, vehicle: VehicleDto) {
    const permno = requirePermno(vehicle)

    let mileage = 0
    let modelYear = null

    // If mileage is provided, convert it to a number and remove thousand separators
    if (vehicle.mileage) {
      const parsed = +vehicle.mileage.trim().replace(/[.,\s]/g, '')
      mileage = Number.isFinite(parsed) ? parsed : 0
    }

    // If no mileage is provided, use the latest mileage
    if (mileage === 0) {
      mileage = vehicle.latestMileage || 0
    }

    // Support the newRegistrationDate, for now, to keep backwards compatibility
    if (vehicle.newRegistrationDate) {
      modelYear = new Date(vehicle.newRegistrationDate)
    } else if (vehicle.modelYear) {
      modelYear = new Date(vehicle.modelYear, 0, 1)
    }

    await this.recyclingFundService.createVehicle(
      auth,
      permno,
      mileage,
      vehicle.vin || '',
      vehicle.make || '',
      modelYear,
      vehicle.color || '',
    )
  }

  async recycleVehicle(
    auth: User,
    fullName: string,
    vehicle: VehicleDto,
    recyclingRequestType: CreateXRoadRecyclingRequestDtoRequestTypeEnum,
  ) {
    const permno = requirePermno(vehicle)

    await this.recyclingFundService.recycleVehicle(
      auth,
      fullName.trim(),
      permno,
      recyclingRequestType,
    )
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
      application.answers,
    )

    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    try {
      await this.createOwner(application, auth)

      // Withdrawals are recorded before selections, matching the order the
      // citizen made them. The two lists never share a vehicle: the overview
      // moves one out of the other whenever either is chosen.
      await Promise.all(
        canceledVehicles.map((vehicle) =>
          this.withVehicleContext(vehicle, () =>
            this.recycleVehicle(
              auth,
              applicantName,
              vehicle,
              CreateXRoadRecyclingRequestDtoRequestTypeEnum.Cancelled,
            ),
          ),
        ),
      )

      await Promise.all(
        selectedVehicles.map((vehicle) =>
          this.withVehicleContext(vehicle, async () => {
            await this.createVehicle(auth, vehicle)
            await this.recycleVehicle(
              auth,
              applicantName,
              vehicle,
              CreateXRoadRecyclingRequestDtoRequestTypeEnum.PendingRecycle,
            )
          }),
        ),
      )

      return true
    } catch (error) {
      this.logger.error(
        `car-recycling: Error occurred when recycling vehicle(s)`,
        { error: describeError(error) },
      )

      throw new Error(`Error occurred when recycling vehicle(s)`)
    }
  }

  // Which vehicle failed is the first thing an operator needs, and it travels
  // only in the request body, so nothing downstream can report it.
  private async withVehicleContext<T>(
    vehicle: VehicleDto,
    work: () => Promise<T>,
  ): Promise<T> {
    try {
      return await work()
    } catch (error) {
      this.logger.error(
        `car-recycling: Failed on vehicle ${vehicle.permno?.slice(-3)}`,
        { error: describeError(error) },
      )
      throw error
    }
  }
}
