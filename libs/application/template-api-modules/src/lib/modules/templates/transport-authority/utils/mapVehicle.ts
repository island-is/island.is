import { User } from '@island.is/auth-nest-tools'
import {
  CurrentVehiclesWithMilageAndNextInspDto,
  VehicleSearchApi,
} from '@island.is/clients/vehicles'
import {
  OwnerChangeValidation,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  OperatorChangeValidation,
  VehicleOperatorsClient,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  PlateOrderValidation,
  VehiclePlateOrderingClient,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import {
  VehicleDebtStatus,
  VehicleServiceFjsV1Client,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  MileageReadingApi,
  MileageReadingDto,
} from '@island.is/clients/vehicles-mileage'
import { AuthMiddleware } from '@island.is/auth-nest-tools'

interface MapVehicleDeps {
  vehicleServiceFjsV1Client?: VehicleServiceFjsV1Client
  vehicleOperatorsClient?: VehicleOperatorsClient
  vehiclePlateOrderingClient?: VehiclePlateOrderingClient
  vehicleOwnerChangeClient?: VehicleOwnerChangeClient
  mileageReadingApi?: MileageReadingApi
  vehiclesApi?: VehicleSearchApi
}

export const mapVehicle = async (
  auth: User,
  vehicle: CurrentVehiclesWithMilageAndNextInspDto,
  fetchExtraData: boolean,
  deps: MapVehicleDeps,
) => {
  let validation:
    | OwnerChangeValidation
    | OperatorChangeValidation
    | PlateOrderValidation
    | undefined
  let debtStatus: VehicleDebtStatus | undefined
  let mileageReadings: MileageReadingDto[] | undefined

  if (fetchExtraData) {
    // Get owner change validation
    if (deps.vehicleOwnerChangeClient) {
      validation =
        await deps.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
          auth,
          vehicle.permno || '',
        )
    }

    // Get operator change validation
    if (deps.vehicleOperatorsClient) {
      validation =
        await deps.vehicleOperatorsClient.validateVehicleForOperatorChange(
          auth,
          vehicle.permno || '',
        )
    }

    // Get plate order validation
    if (deps.vehiclePlateOrderingClient && deps.vehiclesApi) {
      const vehiclesApiWithAuth = deps.vehiclesApi.withMiddleware(
        new AuthMiddleware(auth),
      )
      const vehicleInfo = await vehiclesApiWithAuth.basicVehicleInformationGet({
        clientPersidno: auth.nationalId,
        permno: vehicle.permno || '',
        regno: undefined,
        vin: undefined,
      })

      validation =
        await deps.vehiclePlateOrderingClient.validateVehicleForPlateOrder(
          auth,
          vehicle.permno || '',
          vehicleInfo?.platetypefront || '',
          vehicleInfo?.platetyperear || '',
        )
    }

    // Get mileage reading
    if (deps.mileageReadingApi) {
      const mileageReadingApiWithAuth = deps.mileageReadingApi.withMiddleware(
        new AuthMiddleware(auth),
      )

      mileageReadings = await mileageReadingApiWithAuth.getMileageReading({
        permno: vehicle.permno || '',
      })
    }

    // Get debt status
    if (deps.vehicleServiceFjsV1Client) {
      debtStatus = await deps.vehicleServiceFjsV1Client.getVehicleDebtStatus(
        auth,
        vehicle.permno || '',
      )
    }
  }

  return {
    permno: vehicle.permno || undefined,
    make: vehicle.make || undefined,
    color: vehicle.colorName || undefined,
    role: vehicle.role || undefined,
    validationErrorMessages: validation?.hasError
      ? validation.errorMessages
      : null,
    requireMileage: vehicle.requiresMileageRegistration,
    mileageReading: mileageReadings?.[0]?.mileage?.toString() ?? '',
    isDebtLess: debtStatus?.isDebtLess,
  }
}
