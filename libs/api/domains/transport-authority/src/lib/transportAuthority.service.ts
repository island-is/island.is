import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import { OwnerChangeAnswers, CheckTachoNetInput } from './graphql/dto'
import {
  OwnerChangeValidation,
  CheckTachoNetExists,
  VehiclesCurrentVehicleWithOwnerchangeChecks,
  VehicleOwnerchangeChecksByPermno,
  VehiclesCurrentVehicleWithOperatorChangeChecks,
  VehicleOperatorChangeChecksByPermno,
  VehiclesCurrentVehicleWithPlateOrderChecks,
  VehiclePlateOrderChecksByPermno,
} from './graphql/models'
import { ApolloError } from 'apollo-server-express'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async validateApplicationForOwnerChange(
    user: User,
    answers: OwnerChangeAnswers,
  ): Promise<OwnerChangeValidation | null> {
    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    const sellerSsn = answers?.seller?.nationalId
    const buyerSsn = answers?.buyer?.nationalId
    if (user.nationalId !== sellerSsn && user.nationalId !== buyerSsn) {
      return null
    }

    const buyerCoOwners = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const result = await this.vehicleOwnerChangeClient.validateAllForOwnerChange(
      user,
      {
        permno: answers?.pickVehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: answers?.seller?.email,
        },
        buyer: {
          ssn: buyerSsn,
          email: answers?.buyer?.email,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        insuranceCompanyCode: answers?.insurance?.value || '',
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId,
          email: coOwner.email,
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId,
          email: operator.email,
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers?.buyerMainOperator?.nationalId
              : true,
        })),
      },
    )

    return result
  }

  async checkTachoNet(
    user: User,
    input: CheckTachoNetInput,
  ): Promise<CheckTachoNetExists> {
    const hasActiveCard = await this.digitalTachographDriversCardClient.checkIfHasActiveCardInTachoNet(
      user,
      input,
    )

    return { exists: hasActiveCard }
  }

  async getCurrentVehiclesWithOwnerchangeChecks(
    auth: User,
    showOwned: boolean,
    showCoOwned: boolean,
    showOperated: boolean,
  ): Promise<
    VehiclesCurrentVehicleWithOwnerchangeChecks[] | null | ApolloError
  > {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    if (showOperated) {
      throw Error(
        'You can only fetch the debt status for vehicles where you are either owner or co-owner',
      )
    }

    return await Promise.all(
      (
        await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
          persidNo: auth.nationalId,
          showOwned: showOwned,
          showCoowned: showCoOwned,
          showOperated: showOperated,
        })
      )?.map(async (vehicle: VehicleMiniDto) => {
        // Get debt status
        const debtStatus = await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(
          auth,
          vehicle.permno || '',
        )

        // Get owner change validation
        const ownerChangeValidation = await this.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
          auth,
          vehicle.permno || '',
        )

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          isDebtLess: debtStatus.isDebtLess,
          validationErrorMessages: ownerChangeValidation?.hasError
            ? ownerChangeValidation.errorMessages
            : null,
        }
      }),
    )
  }

  async getVehicleOwnerchangeChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehicleOwnerchangeChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    const myVehicles = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: true,
      showOperated: false,
    })
    const isOwnerOrCoOwner = !!myVehicles?.find(
      (vehicle: VehicleMiniDto) => vehicle.permno === permno,
    )
    if (!isOwnerOrCoOwner) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }

    // Get debt status
    const debtStatus = await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(
      auth,
      permno,
    )

    // Get owner change validation
    const ownerChangeValidation = await this.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
      auth,
      permno,
    )

    return {
      isDebtLess: debtStatus.isDebtLess,
      validationErrorMessages: ownerChangeValidation?.hasError
        ? ownerChangeValidation.errorMessages
        : null,
    }
  }

  async getCurrentVehiclesWithOperatorChangeChecks(
    auth: User,
    showOwned: boolean,
    showCoOwned: boolean,
    showOperated: boolean,
  ): Promise<
    VehiclesCurrentVehicleWithOperatorChangeChecks[] | null | ApolloError
  > {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    if (showOperated) {
      throw Error(
        'You can only fetch the debt status for vehicles where you are either owner or co-owner',
      )
    }

    return await Promise.all(
      (
        await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
          persidNo: auth.nationalId,
          showOwned: showOwned,
          showCoowned: showCoOwned,
          showOperated: showOperated,
        })
      )?.map(async (vehicle: VehicleMiniDto) => {
        // Get debt status
        const debtStatus = await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(
          auth,
          vehicle.permno || '',
        )

        // Get owner change validation
        const operatorChangeValidation = await this.vehicleOperatorsClient.validateVehicleForOperatorChange(
          auth,
          vehicle.permno || '',
        )

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          isDebtLess: debtStatus.isDebtLess,
          validationErrorMessages: operatorChangeValidation?.hasError
            ? operatorChangeValidation.errorMessages
            : null,
        }
      }),
    )
  }

  async getVehicleOperatorChangeChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehicleOperatorChangeChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    const myVehicles = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: true,
      showOperated: false,
    })
    const isOwnerOrCoOwner = !!myVehicles?.find(
      (vehicle: VehicleMiniDto) => vehicle.permno === permno,
    )
    if (!isOwnerOrCoOwner) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }

    // Get debt status
    const debtStatus = await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(
      auth,
      permno,
    )

    // Get owner change validation
    const operatorChangeValidation = await this.vehicleOperatorsClient.validateVehicleForOperatorChange(
      auth,
      permno,
    )

    return {
      isDebtLess: debtStatus.isDebtLess,
      validationErrorMessages: operatorChangeValidation?.hasError
        ? operatorChangeValidation.errorMessages
        : null,
    }
  }

  async getCurrentVehiclesWithPlateOrderChecks(
    auth: User,
    showOwned: boolean,
    showCoOwned: boolean,
    showOperated: boolean,
  ): Promise<
    VehiclesCurrentVehicleWithPlateOrderChecks[] | null | ApolloError
  > {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    if (showOperated) {
      throw Error(
        'You can only fetch the debt status for vehicles where you are either owner or co-owner',
      )
    }

    return await Promise.all(
      (
        await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
          persidNo: auth.nationalId,
          showOwned: showOwned,
          showCoowned: showCoOwned,
          showOperated: showOperated,
        })
      )?.map(async (vehicle: VehicleMiniDto) => {
        // Get debt status
        const exists = await this.vehiclePlateOrderingClient.checkIfPlateOrderExists(
          auth,
          vehicle.permno || '',
        )

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          duplicateOrderExists: exists,
        }
      }),
    )
  }

  async getVehiclePlateOrderChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehiclePlateOrderChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching debt status for vehicles where he is either owner or co-owner
    const myVehicles = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: true,
      showOperated: false,
    })
    const isOwnerOrCoOwner = !!myVehicles?.find(
      (vehicle: VehicleMiniDto) => vehicle.permno === permno,
    )
    if (!isOwnerOrCoOwner) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }

    // Get debt status
    const exists = await this.vehiclePlateOrderingClient.checkIfPlateOrderExists(
      auth,
      permno,
    )

    return {
      duplicateOrderExists: exists || false,
    }
  }
}
