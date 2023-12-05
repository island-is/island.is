import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { EnergyFundsAnswers } from '@island.is/application/templates/energy-funds'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { coreErrorMessages } from '@island.is/application/core'
import { EnergyFundsClientService } from '@island.is/clients/energy-funds'
import format from 'date-fns/format'
import { VehiclesCurrentVehicle } from './types'

@Injectable()
export class EnergyFundsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly energyFundsClientService: EnergyFundsClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ENERGY_FUNDS)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getVehicleGrant = async (auth: User, vehicle: VehicleMiniDto) => {
    return await this.energyFundsClientService.getCatalogValueForVehicle(
      auth,
      vehicle,
    )
  }

  async getCurrentVehiclesWithDetails({ auth }: TemplateApiModuleActionProps) {
    const results = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    const onlyElectricVehicles = results.filter(
      (x) => x.fuelCode && parseInt(x.fuelCode) === 3,
    )

    // Validate that user has at least 1 vehicle that fulfills requirements
    if (!onlyElectricVehicles || !onlyElectricVehicles.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.electricVehicleListEmptyOwner,
          summary: coreErrorMessages.electricVehicleListEmptyOwner,
        },
        400,
      )
    }

    return await Promise.all(
      onlyElectricVehicles?.map(async (vehicle) => {
        let vehicleGrantPriceAmount: number | undefined
        let vehicleGrantItemCode: string | undefined
        let hasReceivedSubsidy: boolean | undefined

        // Only validate if fewer than 5 items
        if (onlyElectricVehicles.length < 5) {
          const vehicleGrant = await this.getVehicleGrant(auth, vehicle)
          vehicleGrantPriceAmount = vehicleGrant?.priceAmount
          vehicleGrantItemCode = vehicleGrant?.itemCode

          // Get subsidy status
          hasReceivedSubsidy =
            await this.energyFundsClientService.checkVehicleSubsidyAvilability(
              auth,
              vehicle.vin || '',
            )
        }

        return {
          permno: vehicle.permno,
          vin: vehicle.vin,
          make: vehicle.make,
          color: vehicle.color,
          role: vehicle.role,
          firstRegistrationDate: vehicle.firstRegistrationDate,
          newRegistrationDate: vehicle.newRegistrationDate,
          fuelCode: vehicle.fuelCode,
          vehicleRegistrationCode: vehicle.vehicleRegistrationCode,
          importCode: vehicle.importCode,
          vehicleGrant: vehicleGrantPriceAmount,
          vehicleGrantItemCode: vehicleGrantItemCode,
          hasReceivedSubsidy: hasReceivedSubsidy,
        }
      }),
    )
  }

  async submitApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const applicationAnswers = application.answers as EnergyFundsAnswers
    const currentVehicleList = application.externalData?.currentVehicles
      ?.data as Array<VehiclesCurrentVehicle>
    const currentvehicleDetails = currentVehicleList.filter(
      (x) => x.permno === applicationAnswers.selectVehicle.plate,
    )[0]

    const answers = {
      nationalId: auth.nationalId,
      vIN: applicationAnswers?.selectVehicle.vin,
      carNumber: applicationAnswers?.selectVehicle.plate,
      carType: currentvehicleDetails.make || '',
      itemcode: currentvehicleDetails.vehicleGrantItemCode || '',
      purchasePrice: applicationAnswers?.vehicleDetails.price
        ? parseInt(applicationAnswers?.vehicleDetails.price)
        : 0,
      registrationDate: format(
        new Date(currentvehicleDetails.firstRegistrationDate ?? ''),
        'yyyy-MM-dd',
      ),
      subsidyAmount: currentvehicleDetails.vehicleGrant ?? 0,
    }

    await this.energyFundsClientService.submitEnergyFundsApplication(auth, {
      subsidyInput: answers,
    })
  }
}
