import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { EmailRecipient, EmailRole } from './types'
import { join } from 'path'
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

export const pathToAsset = (file: string) => {
  return join(
    __dirname,
    `./transport-authority-transfer-of-vehicle-ownership-assets/${file}`,
  )
}

export const getAllRoles = (): EmailRole[] => {
  return [
    EmailRole.seller,
    EmailRole.sellerCoOwner,
    EmailRole.buyer,
    EmailRole.buyerCoOwner,
    EmailRole.buyerOperator,
  ]
}

export const getRoleNameById = (roleId: EmailRole): string | undefined => {
  switch (roleId) {
    case EmailRole.seller:
      return 'Seljandi'
    case EmailRole.sellerCoOwner:
      return 'Meðeigandi seljanda'
    case EmailRole.buyer:
      return 'Kaupandi'
    case EmailRole.buyerCoOwner:
      return 'Meðeigandi kaupanda'
    case EmailRole.buyerOperator:
      return 'Umráðamaður kaupanda'
    default:
      undefined
  }
}

export const getApplicationPruneDateStr = (
  applicationCreated: Date,
): string => {
  const expiresAfterDays = 7
  const date = new Date(applicationCreated)
  date.setDate(date.getDate() + expiresAfterDays)

  return (
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear()
  )
}

export const getRecipients = (
  answers: TransferOfVehicleOwnershipAnswers,
  roles: Array<EmailRole>,
): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Seller
  if (roles.includes(EmailRole.seller) && answers.seller) {
    recipientList.push({
      ssn: answers.seller.nationalId,
      name: answers.seller.name,
      email: answers.seller.email,
      phone: answers.seller.phone,
      role: EmailRole.seller,
      approved: true,
    })
  }

  // Seller's co-owners
  const sellerCoOwners = answers.sellerCoOwner
  if (roles.includes(EmailRole.sellerCoOwner) && sellerCoOwners) {
    for (let i = 0; i < sellerCoOwners.length; i++) {
      recipientList.push({
        ssn: sellerCoOwners[i].nationalId,
        name: sellerCoOwners[i].name,
        email: sellerCoOwners[i].email,
        phone: sellerCoOwners[i].phone,
        role: EmailRole.sellerCoOwner,
        approved: sellerCoOwners[i].approved,
      })
    }
  }

  // Buyer
  if (roles.includes(EmailRole.buyer) && answers.buyer) {
    recipientList.push({
      ssn: answers.buyer.nationalId,
      name: answers.buyer.name,
      email: answers.buyer.email,
      phone: answers.buyer.phone,
      role: EmailRole.buyer,
      approved: answers.buyer.approved,
    })
  }

  const filteredBuyerCoOwnerAndOperator =
    answers?.buyerCoOwnerAndOperator?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )

  // Buyer's co-owners
  const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'coOwner',
  )
  if (roles.includes(EmailRole.buyerCoOwner) && buyerCoOwners) {
    for (let i = 0; i < buyerCoOwners.length; i++) {
      recipientList.push({
        ssn: buyerCoOwners[i].nationalId || '',
        name: buyerCoOwners[i].name || '',
        email: buyerCoOwners[i].email,
        phone: buyerCoOwners[i].phone,
        role: EmailRole.buyerCoOwner,
        approved: buyerCoOwners[i].approved,
      })
    }
  }

  // Buyer's operators
  const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'operator',
  )
  if (roles.includes(EmailRole.buyerOperator) && buyerOperators) {
    for (let i = 0; i < buyerOperators.length; i++) {
      recipientList.push({
        ssn: buyerOperators[i].nationalId || '',
        name: buyerOperators[i].name || '',
        email: buyerOperators[i].email,
        phone: buyerOperators[i].phone,
        role: EmailRole.buyerOperator,
        approved: buyerOperators[i].approved,
      })
    }
  }

  return recipientList
}

export const getRecipientBySsn = (
  answers: TransferOfVehicleOwnershipAnswers,
  ssn: string,
): EmailRecipient | undefined => {
  // Seller
  if (answers.seller?.nationalId === ssn) {
    return {
      ssn: answers.seller.nationalId,
      name: answers.seller.name,
      email: answers.seller.email,
      phone: answers.seller.phone,
      role: EmailRole.seller,
      approved: true,
    }
  }

  // Seller's co-owners
  const sellerCoOwners = answers.sellerCoOwner
  if (sellerCoOwners) {
    for (let i = 0; i < sellerCoOwners.length; i++) {
      if (sellerCoOwners[i].nationalId === ssn) {
        return {
          ssn: sellerCoOwners[i].nationalId,
          name: sellerCoOwners[i].name,
          email: sellerCoOwners[i].email,
          phone: sellerCoOwners[i].phone,
          role: EmailRole.sellerCoOwner,
          approved: sellerCoOwners[i].approved,
        }
      }
    }
  }

  // Buyer
  if (answers.buyer?.nationalId === ssn) {
    return {
      ssn: answers.buyer.nationalId,
      name: answers.buyer.name,
      email: answers.buyer.email,
      phone: answers.buyer.phone,
      role: EmailRole.buyer,
      approved: answers.buyer.approved,
    }
  }

  const filteredBuyerCoOwnerAndOperator =
    answers?.buyerCoOwnerAndOperator?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )

  // Buyer's co-owners
  const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'coOwner',
  )
  if (buyerCoOwners) {
    for (let i = 0; i < buyerCoOwners.length; i++) {
      if (buyerCoOwners[i].nationalId === ssn) {
        return {
          ssn: buyerCoOwners[i].nationalId || '',
          name: buyerCoOwners[i].name || '',
          email: buyerCoOwners[i].email,
          phone: buyerCoOwners[i].phone,
          role: EmailRole.buyerCoOwner,
          approved: buyerCoOwners[i].approved,
        }
      }
    }
  }

  // Buyer's operators
  const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'operator',
  )
  if (buyerOperators) {
    for (let i = 0; i < buyerOperators.length; i++) {
      if (buyerOperators[i].nationalId === ssn) {
        return {
          ssn: buyerOperators[i].nationalId || '',
          name: buyerOperators[i].name || '',
          email: buyerOperators[i].email,
          phone: buyerOperators[i].phone,
          role: EmailRole.buyerOperator,
          approved: buyerOperators[i].approved,
        }
      }
    }
  }
}

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
