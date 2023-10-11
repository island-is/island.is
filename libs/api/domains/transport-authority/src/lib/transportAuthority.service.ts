import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehiclePlateRenewalClient } from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import {
  OwnerChangeAnswers,
  OperatorChangeAnswers,
  CheckTachoNetInput,
} from './graphql/dto'
import {
  OwnerChangeValidation,
  OperatorChangeValidation,
  CheckTachoNetExists,
  VehicleOwnerchangeChecksByPermno,
  VehicleOperatorChangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
} from './graphql/models'
import { ApolloError } from 'apollo-server-express'
import { CoOwnerChangeAnswers } from './graphql/dto/coOwnerChangeAnswers.input'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehiclePlateRenewalClient: VehiclePlateRenewalClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async checkTachoNet(
    user: User,
    input: CheckTachoNetInput,
  ): Promise<CheckTachoNetExists> {
    const hasActiveCard =
      await this.digitalTachographDriversCardClient.checkIfHasActiveCardInTachoNet(
        user,
        input,
      )

    return { exists: hasActiveCard }
  }

  async getVehicleOwnerchangeChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehicleOwnerchangeChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching information for vehicles where he is either owner or co-owner
    // (mainly debt status info that is sensitive)
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
    const debtStatus =
      await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(auth, permno)

    // Get owner change validation
    const ownerChangeValidation =
      await this.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
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

  async validateApplicationForOwnerChange(
    user: User,
    answers: OwnerChangeAnswers,
  ): Promise<OwnerChangeValidation | null> {
    const sellerSsn = answers?.seller?.nationalId
    const sellerEmail = answers?.seller?.email
    const buyerSsn = answers?.buyer?.nationalId
    const buyerEmail = answers?.buyer?.email

    // Note: Since we dont have application.created here, we will just use
    // the current timestamp
    const todayStr = new Date().toISOString()

    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    if (user.nationalId !== sellerSsn && user.nationalId !== buyerSsn) {
      return null
    }

    const filteredBuyerCoOwnerAndOperator =
      answers?.buyerCoOwnerAndOperator?.filter(
        ({ wasRemoved }) => wasRemoved !== 'true',
      )
    const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const result =
      await this.vehicleOwnerChangeClient.validateAllForOwnerChange(user, {
        permno: answers?.pickVehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: sellerEmail,
        },
        buyer: {
          ssn: buyerSsn,
          email: buyerEmail,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        dateOfPurchaseTimestamp: todayStr.substring(11, todayStr.length),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        mileage: answers?.vehicle?.salePrice
          ? Number(answers?.vehicle?.salePrice) || 0
          : null,
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
      })

    return result
  }

  async validateApplicationForCoOwnerChange(
    user: User,
    answers: CoOwnerChangeAnswers,
  ): Promise<OwnerChangeValidation | null> {
    const permno = answers?.pickVehicle?.plate
    const ownerSsn = answers?.owner?.nationalId
    const ownerEmail = answers?.owner?.email

    // Note: Since we dont have application.created here, we will just use
    // the current timestamp
    const todayStr = new Date().toISOString()

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      user,
      permno,
    )

    const currentOwnerChange =
      await this.vehicleOwnerChangeClient.getNewestOwnerChange(user, permno)

    const filteredOldCoOwners = answers?.ownerCoOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewCoOwners = answers?.coOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredCoOwners = [
      ...(filteredOldCoOwners ? filteredOldCoOwners : []),
      ...(filteredNewCoOwners ? filteredNewCoOwners : []),
    ]

    const result =
      await this.vehicleOwnerChangeClient.validateAllForOwnerChange(user, {
        permno: permno,
        seller: {
          ssn: ownerSsn,
          email: ownerEmail,
        },
        buyer: {
          ssn: ownerSsn,
          email: ownerEmail,
        },
        dateOfPurchase: new Date(),
        dateOfPurchaseTimestamp: todayStr.substring(11, todayStr.length),
        saleAmount: currentOwnerChange?.saleAmount,
        insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
        operators: currentOperators?.map((operator) => ({
          ssn: operator.ssn || '',
          // Note: It should be ok that the email we send in is empty, since we dont get
          // the email when fetching current operators, and according to them (SGS), they
          // are not using the operator email in their API (not being saved in their DB)
          email: null,
          isMainOperator: operator.isMainOperator || false,
        })),
        coOwners: filteredCoOwners.map((x) => ({
          ssn: x.nationalId,
          email: x.email,
        })),
      })

    return result
  }

  async getVehicleOperatorChangeChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehicleOperatorChangeChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching information for vehicles where he is either owner or co-owner
    // (mainly debt status info that is sensitive)
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
    const debtStatus =
      await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(auth, permno)

    // Get owner change validation
    const operatorChangeValidation =
      await this.vehicleOperatorsClient.validateVehicleForOperatorChange(
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

  async validateApplicationForOperatorChange(
    user: User,
    answers: OperatorChangeAnswers,
  ): Promise<OperatorChangeValidation | null> {
    // No need to continue with this validation in user is not owner
    // (only time application data changes is on state change from that role)
    const ownerSsn = answers?.owner?.nationalId
    if (user.nationalId !== ownerSsn) {
      return null
    }

    const permno = answers?.pickVehicle?.plate

    const filteredOldOperators = answers?.oldOperators?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewOperators = answers?.operators?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredOperators = [
      ...(filteredOldOperators ? filteredOldOperators : []),
      ...(filteredNewOperators ? filteredNewOperators : []),
    ]

    const operators = filteredOperators.map((operator) => ({
      ssn: operator.nationalId,
      isMainOperator:
        filteredOperators.length > 1
          ? operator.nationalId === answers?.mainOperator?.nationalId
          : true,
    }))

    const result =
      await this.vehicleOperatorsClient.validateAllForOperatorChange(
        user,
        permno,
        operators,
      )

    return result
  }

  async getVehiclePlateOrderChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehiclePlateOrderChecksByPermno | null | ApolloError> {
    // Get basic information about vehicle
    const vehicleInfo = await this.vehiclesApiWithAuth(
      auth,
    ).basicVehicleInformationGet({
      clientPersidno: auth.nationalId,
      permno: permno,
      regno: undefined,
      vin: undefined,
    })

    // Get validation
    const validation = await this.vehiclePlateOrderingClient.validatePlateOrder(
      auth,
      permno,
      vehicleInfo?.platetypefront || '',
      vehicleInfo?.platetyperear || '',
    )

    return {
      validationErrorMessages: validation?.hasError
        ? validation.errorMessages
        : null,
    }
  }

  async getMyPlateOwnershipChecksByRegno(
    auth: User,
    regno: string,
  ): Promise<VehicleOperatorChangeChecksByPermno | null | ApolloError> {
    // Get validation
    const validation =
      await this.vehiclePlateRenewalClient.validatePlateOwnership(auth, regno)

    return {
      validationErrorMessages: validation?.hasError
        ? validation.errorMessages
        : null,
    }
  }

  async getPlateAvailability(regno: string) {
    return this.vehiclePlateRenewalClient.getPlateAvailability(regno)
  }
}
