import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import {
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  VehiclePlateOrderingClient,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehiclePlateRenewalClient } from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import {
  BasicVehicleInformationDto,
  VehicleSearchApi,
} from '@island.is/clients/vehicles'
import {
  OwnerChangeAnswers,
  OperatorChangeAnswers,
  CheckTachoNetInput,
  PlateOrderAnswers,
} from './graphql/dto'
import {
  OwnerChangeValidation,
  OperatorChangeValidation,
  CheckTachoNetExists,
  VehicleOwnerchangeChecksByPermno,
  VehicleOperatorChangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  PlateOrderValidation,
  BasicVehicleInformation,
  ExemptionValidation,
} from './graphql/models'
import { ApolloError } from 'apollo-server-express'
import { CoOwnerChangeAnswers } from './graphql/dto/coOwnerChangeAnswers.input'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { ExemptionForTransportationClient } from '@island.is/clients/transport-authority/exemption-for-transportation'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehiclePlateRenewalClient: VehiclePlateRenewalClient,
    private readonly exemptionForTransportationClient: ExemptionForTransportationClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mileageReadingApiWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
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

  private async fetchVehicleDataForOwnerCoOwner(auth: User, permno: string) {
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      permno: permno,
      showOwned: true,
      showCoowned: true,
      showOperated: false,
    })
    if (!result || !result.data || result.data.length === 0) {
      throw Error(
        'Did not find the vehicle with that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }

    const vehicle = result.data[0]

    return { vehicle }
  }

  private async fetchVehicleDataAndMileageForOwnerCoOwner(
    auth: User,
    permno: string,
  ) {
    const vehicle = await this.fetchVehicleDataForOwnerCoOwner(auth, permno)

    // Get mileage reading
    const mileageReadings = await this.mileageReadingApiWithAuth(
      auth,
    ).getMileageReading({ permno: permno })

    return { ...vehicle, mileageReadings }
  }

  async getVehicleOwnerchangeChecksByPermno(
    auth: User,
    permno: string,
  ): Promise<VehicleOwnerchangeChecksByPermno | null | ApolloError> {
    // Make sure user is only fetching information for vehicles where he is either owner or co-owner
    // (mainly debt status info that is sensitive)
    const { vehicle, mileageReadings } =
      await this.fetchVehicleDataAndMileageForOwnerCoOwner(auth, permno)

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
      basicVehicleInformation: {
        permno: vehicle.permno,
        // Note: subModel (vehcom+speccom) has already been added to this field
        make: vehicle.make,
        color: vehicle.colorName,
        requireMileage: vehicle.requiresMileageRegistration,
        mileageReading: mileageReadings?.[0]?.mileage?.toString() ?? '',
      },
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

    const mileage = answers?.vehicleMileage?.value

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
        mileage: mileage ? Number(mileage) || 0 : null,
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

    const mileage = answers?.vehicleMileage?.value

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
        mileage: mileage ? Number(mileage) || 0 : null,
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
    const { vehicle, mileageReadings } =
      await this.fetchVehicleDataAndMileageForOwnerCoOwner(auth, permno)

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
      basicVehicleInformation: {
        color: vehicle.colorName,
        // Note: subModel (vehcom+speccom) has already been added to this field
        make: vehicle.make,
        permno: vehicle.permno,
        requireMileage: vehicle.requiresMileageRegistration,
        mileageReading: mileageReadings?.[0]?.mileage?.toString() ?? '',
      },
    }
  }

  async validateApplicationForOperatorChange(
    user: User,
    answers: OperatorChangeAnswers,
  ): Promise<OperatorChangeValidation | null> {
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

    const mileage = answers?.vehicleMileage?.value

    const result =
      await this.vehicleOperatorsClient.validateAllForOperatorChange(
        user,
        permno,
        operators,
        mileage ? Number(mileage) || 0 : null,
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
    const validation =
      await this.vehiclePlateOrderingClient.validateVehicleForPlateOrder(
        auth,
        permno,
        vehicleInfo?.platetypefront || '',
        vehicleInfo?.platetyperear || '',
      )

    return {
      validationErrorMessages: validation?.hasError
        ? validation.errorMessages
        : null,
      basicVehicleInformation: {
        color: vehicleInfo.color,
        make: `${vehicleInfo.make} ${this.getVehicleSubModel(vehicleInfo)}`,
        permno: vehicleInfo.permno,
      },
    }
  }

  private getVehicleSubModel(vehicle: BasicVehicleInformationDto) {
    return [vehicle.vehcom, vehicle.speccom].filter(Boolean).join(' ')
  }

  async validateApplicationForPlateOrder(
    user: User,
    answers: PlateOrderAnswers,
  ): Promise<PlateOrderValidation | null> {
    const YES = 'yes'

    const includeRushFee =
      answers?.plateDelivery?.includeRushFee?.includes(YES) || false

    // Check if used selected delivery method: Pick up at delivery station
    const deliveryStationTypeCode =
      answers?.plateDelivery?.deliveryStationTypeCode
    let deliveryStationType: string
    let deliveryStationCode: string
    if (
      answers.plateDelivery?.deliveryMethodIsDeliveryStation === YES &&
      deliveryStationTypeCode
    ) {
      // Split up code+type (was merged when we fetched that data)
      deliveryStationType = deliveryStationTypeCode.split('_')[0]
      deliveryStationCode = deliveryStationTypeCode.split('_')[1]
    } else {
      // Otherwise we will default to option "Pick up at Samgöngustofa"
      deliveryStationType = SGS_DELIVERY_STATION_TYPE
      deliveryStationCode = SGS_DELIVERY_STATION_CODE
    }

    const result =
      await this.vehiclePlateOrderingClient.validateAllForPlateOrder(
        user,
        answers?.pickVehicle?.plate,
        answers?.plateSize?.frontPlateSize?.[0] || '',
        answers?.plateSize?.rearPlateSize?.[0] || '',
        deliveryStationType,
        deliveryStationCode,
        includeRushFee,
      )

    return result
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

  async getMyBasicVehicleInfoByPermno(
    auth: User,
    permno: string,
  ): Promise<BasicVehicleInformation | null | ApolloError> {
    const { vehicle } = await this.fetchVehicleDataForOwnerCoOwner(auth, permno)

    return {
      permno: vehicle.permno,
      // Note: subModel (vehcom+speccom) has already been added to this field
      make: vehicle.make,
      color: vehicle.colorName,
    }
  }

  async getBasicVehicleInfoByPermno(
    auth: User,
    permno: string,
  ): Promise<BasicVehicleInformation | null> {
    try {
      const vehicle = await this.vehiclesApiWithAuth(
        auth,
      ).basicVehicleInformationGet({
        clientPersidno: auth.nationalId,
        permno: permno,
      })

      const model = vehicle.make
      const subModel = vehicle.vehcom ?? ''

      return {
        permno: vehicle.permno,
        make: `${model} ${subModel}`,
        color: vehicle.color,
        numberOfAxles: vehicle.technical?.axle?.axleno || 0,
        vehicleHasMilesOdometer: vehicle.vehicleHasMilesOdometer
          ? vehicle.vehicleHasMilesOdometer
          : false,
      }
    } catch (e) {
      return null
    }
  }

  async getVehicleExemptionValidation(
    auth: User,
    permno: string,
    isTrailer: boolean,
  ): Promise<ExemptionValidation | null> {
    return await this.exemptionForTransportationClient.validateForExemption(
      auth,
      permno,
      isTrailer,
    )
  }
}
