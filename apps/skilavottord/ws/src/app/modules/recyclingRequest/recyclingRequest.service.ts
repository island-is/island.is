import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/sequelize'
import format from 'date-fns/format'
import { lastValueFrom } from 'rxjs'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { User } from '../auth'
import { environment } from '../../../environments'
import { FjarsyslaService } from '../fjarsysla'
import { RecyclingPartnerService } from '../recyclingPartner'
import { VehicleInformation } from '../samgongustofa'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
  RecyclingRequestResponse,
  RequestErrors,
  RequestStatus,
} from './recyclingRequest.model'
import { VehicleService, VehicleModel } from '../vehicle'
import { IcelandicTransportAuthorityServices } from '../../services/icelandicTransportAuthority.services'
import { ApiVersion } from '../../utils/const'
import { getShortPermno } from '../../utils/skilavottordUtils'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private httpService: HttpService,
    private fjarsyslaService: FjarsyslaService,
    @Inject(forwardRef(() => RecyclingPartnerService))
    private recyclingPartnerService: RecyclingPartnerService,
    private vehicleService: VehicleService,
    private icelandicTransportAuthorityServices: IcelandicTransportAuthorityServices,
  ) {}

  async deRegisterVehicle(
    vehiclePermno: string,
    disposalStation: string,
    vehicle: VehicleModel,
  ) {
    const disposalStationId =
      await this.recyclingPartnerService.getPayingPartnerId(disposalStation)

    try {
      const { restAuthUrl, restDeRegUrl, restUsername, restPassword } =
        environment.samgongustofa
      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)
      const headerAuthRequest = {
        'Content-Type': 'application/json',
        'Api-version': ApiVersion.REGISTRATIONS,
      }

      // TODO: saved jToken and use it in next 7 days ( until it expires )
      const authRes = await lastValueFrom(
        this.httpService.post(restAuthUrl, jsonAuthBody, {
          headers: headerAuthRequest,
        }),
      )
      if (authRes.status > 299 || authRes.status < 200) {
        const errorMessage = `Authentication failed for deRegisterService: ${authRes.statusText}`
        this.logger.error(errorMessage)
        throw new Error(errorMessage)
      }

      // DeRegisterd vehicle
      const jToken = authRes.data['jwtToken']
      const jsonDeRegBody = JSON.stringify({
        permno: vehiclePermno,
        deRegisterDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        disposalStation: disposalStationId,
        explanation: 'Rafrænt afskráning',
        mileage: vehicle.mileage ?? 0,
        plateCount: vehicle.plateCount,
        lost: vehicle.plateLost ? 1 : 0,
      })

      this.logger.info(
        `car-recycling: Degregistering vehicle ${getShortPermno(
          vehiclePermno,
        )} from Samgongustofa`,
        {
          disposalStationId,
          mileage: vehicle.mileage ?? 0,
          plateCount: vehicle.plateCount,
          lost: vehicle.plateLost ? 1 : 0,
        },
      )

      const headerDeRegRequest = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jToken,
        'Api-version': ApiVersion.REGISTRATIONS,
      }

      const deRegRes = await lastValueFrom(
        this.httpService.post(restDeRegUrl, jsonDeRegBody, {
          headers: headerDeRegRequest,
        }),
      )

      if (deRegRes.status < 300 && deRegRes.status >= 200) {
        return true
      } else {
        throw new Error(
          `Failed on deregisterd on deRegisterVehicle with status: ${deRegRes.statusText}`,
        )
      }
    } catch (error) {
      if (error?.config) {
        error.config.data = undefined
      }
      this.logger.error(`Failed to deregister vehicle`, { error })
      throw new Error(
        `Failed to deregister vehicle ${getShortPermno(vehiclePermno)}`,
      )
    }
  }

  async findAll(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestModel.findAll()
    return res
  }

  async findUserRecyclingRequestWithPermno(
    vehicle: VehicleInformation,
  ): Promise<RecyclingRequestModel[]> {
    const userRecyclingRequests = await this.findAllWithPermno(vehicle.permno)
    if (userRecyclingRequests.length > 0) {
      return [userRecyclingRequests[0]]
    }

    return []
  }

  // Find all a vehicle's requests
  async findAllWithPermno(permno: string): Promise<RecyclingRequestModel[]> {
    try {
      const res = await this.recyclingRequestModel.findAll({
        where: { vehicleId: permno },
        order: [['createdAt', 'DESC']],
      })
      return res
    } catch (err) {
      throw new Error(`Failed on findAllwithPermno request with error: ${err}`)
    }
  }

  // Find all a vehicle's requests
  async getVehicleInfoToDeregistered(
    user: User,
    permno: string,
  ): Promise<VehicleModel> {
    // We are only logging the last 3 chars in the vehicle number
    const loggedPermno = getShortPermno(permno)

    try {
      // Check 'pendingRecycle' status
      const resRequestType = await this.findAllWithPermno(permno)
      if (resRequestType.length > 0) {
        if (
          resRequestType[0]['dataValues']['requestType'] != 'pendingRecycle'
        ) {
          throw new Error(
            `Lastest requestType of vehicle's number ${loggedPermno} is not 'pendingRecycle' but is: ${resRequestType[0]['dataValues']['requestType']}`,
          )
        }
      } else {
        this.logger.warn(
          `car-recycling: Could not find any requestType for vehicle's number: ${loggedPermno} in database from partner ${user.partnerId}`,
        )
        throw new NotFoundException(
          `Could not find any requestType for vehicle's number: ${loggedPermno} in database from partner ${user.partnerId}`,
          'NOT_FOUND',
        )
      }

      // Get vehicle's information
      const res = await this.vehicleService.findByVehicleId(permno)
      if (!res) {
        throw new Error(
          `Could not find any vehicle's information for vehicle's number: ${loggedPermno} in database`,
        )
      }
      return res
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err
      }

      throw new Error(
        `Failed on getVehicleInfoToDeregistered request from partner ${user.partnerId} with error: ${err}`,
      )
    }
  }

  // Create new RecyclingRequest for citizen and recyclingPartner.
  // partnerId could be null, when it's the request is for citizen
  async createRecyclingRequest(
    user: User,
    requestType: RecyclingRequestTypes,
    permno: string,
  ): Promise<typeof RecyclingRequestResponse> {
    const nameOfRequestor = user.name
    const partnerId = user.partnerId
    const errors = new RequestErrors()

    // We are only logging the last 3 chars in the vehicle number
    const loggedPermno = getShortPermno(permno)

    this.logger.info(`car-recycling: Recycling request ${loggedPermno}`, {
      requestType: requestType,
    })

    try {
      // nameOfRequestor and partnerId are not required arguments
      // But nameOfRequestor and partnerId could not both be null at the same time
      if (!nameOfRequestor && !partnerId) {
        if (!nameOfRequestor) {
          this.logger.error(`car-recycling: nameOfRequestor is missing`)
        } else {
          this.logger.error(`car-recycling: partnerId is missing`)
        }

        errors.operation = 'Checking arguments'
        errors.message = `Not all required fields are filled. Please contact admin.`
        return errors
      }

      // If requestType is 'deregistered'
      // partnerId could not be null when create requestType for recyclingPartner.
      if (requestType === 'deregistered' && !partnerId) {
        this.logger.error(
          `car-recycling: If requestType is deregistered partnerId could not be null when create requestType for recyclingPartner`,
        )

        errors.operation = 'Checking partnerId'
        errors.message = `Not all required fields are filled. Please contact admin.`
        return errors
      }

      // If requestType is not 'pendingRecycle', 'cancelled' or 'deregistered'
      if (
        !(
          requestType === 'pendingRecycle' ||
          requestType === 'cancelled' ||
          requestType === 'deregistered'
        )
      ) {
        this.logger.error(
          `car-recycling: RequestType is not 'pendingRecycle', 'cancelled' or 'deregistered'`,
        )

        errors.operation = 'Checking requestType'
        errors.message = `RequestType is incorrect. Please contact admin.`
        return errors
      }

      // Initalise new RecyclingRequest
      const newRecyclingRequest = new RecyclingRequestModel()
      newRecyclingRequest.vehicleId = permno
      newRecyclingRequest.requestType = requestType
      if (nameOfRequestor) {
        newRecyclingRequest.nameOfRequestor = nameOfRequestor
      }
      // is partnerId null?
      if (partnerId) {
        newRecyclingRequest.recyclingPartnerId = partnerId
        const partner = await this.recyclingPartnerService.findOne(partnerId)
        if (!partner) {
          this.logger.error(
            `car-recycling: The recycling station is not in the recycling station list`,
            {
              partnerId,
            },
          )

          errors.operation = 'Checking partner'
          errors.message = `Your station is not in the recycling station list. Please contact admin.`
          return errors
        }
        newRecyclingRequest.nameOfRequestor = partner['companyName']
      }

      // Checking if 'permno' is already in the database
      const vehicle = await this.vehicleService.findByVehicleId(permno)
      if (!vehicle) {
        this.logger.error(
          `car-recycling: Citizen has not accepted to recycle the vehicle`,
        )
        errors.operation = 'Checking vehicle'
        errors.message = `Citizen has not accepted to recycle the vehicle.`
        return errors
      }

      // Here is a bit tricky
      // Only Developer and RecyclingCompany may deregistered vehicle
      // 0. Check if the registered owner is the current owner
      // 1. Check whether lastest vehicle's requestType is 'pendingRecycle' or 'handOver'
      // 2. Set requestType to 'handOver'
      // 3. Then deregistered the vehicle from Samgongustofa
      // 4. Set requestType to 'deregistered'
      // 5. Then call fjarsysla for payment
      // 6. Set requestType to 'paymentInitiated'
      // If we encounter error then update requestType to 'paymentFailed'
      // If we encounter error with 'partnerId' then there is no request saved
      if (requestType == 'deregistered') {
        // 0. We need to be sure that the current owner is registered in our database
        await this.icelandicTransportAuthorityServices.checkIfCurrentUser(
          permno,
        )

        // 1. Check 'pendingRecycle'/'handOver' requestType
        const resRequestType = await this.findAllWithPermno(permno)
        if (!requestType || resRequestType.length == 0) {
          this.logger.error(
            `car-recycling: Citizen has not accepted to deregistered the vehicle.`,
          )

          errors.operation = 'Checking vehicle status'
          errors.message = `Citizen has not accepted to recycle the vehicle.`
          return errors
        } else {
          if (
            !['pendingRecycle', 'handOver'].includes(
              resRequestType[0]['dataValues']['requestType'],
            )
          ) {
            this.logger.error(
              `car-recycling: Citizen has not accepted to recycle the vehicle.`,
            )

            errors.operation = 'Checking vehicle status'
            errors.message = `Citizen has not accepted to recycle the vehicle.`
            return errors
          }
        }

        // 2. Update requestType to 'handOver'
        try {
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = RecyclingRequestTypes.handOver
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
        } catch (err) {
          this.logger.error(
            `car-recycling: Could not start deregistered process.`,
            {
              permno: loggedPermno,
              newRecyclingRequest,
            },
          )

          errors.operation = 'handOver'
          errors.message = `Could not start deregistered process. Please try again later.`
          return errors
        }

        // 3. deregistered vehicle from Samgongustofa
        try {
          // partnerId 000 is Rafræn afskráning in Samgongustofa's system
          // Samgongustofa wants to use it ('000') instead of Recycling partnerId for testing

          await this.deRegisterVehicle(permno, partnerId, vehicle)
        } catch (err) {
          // Saved requestType back to 'pendingRecycle'
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = RecyclingRequestTypes.pendingRecycle
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
          this.logger.error(err.message)
          this.logger.error(
            `car-recycling: Deregistered process failed. ${loggedPermno}`,
            {
              requestType,
              recyclingPartnerId: newRecyclingRequest.recyclingPartnerId,
            },
          )
          errors.operation = 'deregistered'
          errors.message = `deregistered process failed. Please try again later.`

          return errors
        }

        // 4. Update requestType to 'deregistered'
        let getGuId = new RecyclingRequestModel()
        try {
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = RecyclingRequestTypes.deregistered
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          getGuId = await req.save()
        } catch (err) {
          // Log error and continue to payment
          this.logger.error(
            `car-recycling: Failed on inserting requestType 'deregistered' for vehicle's number: ${loggedPermno},
            )} in database with error: ${err} but we continue to payment.`,
          )
        }

        // 5. Call Fjarsysla for payment
        try {
          // Need to send vehicleOwner's nationalId on fjarsysla API
          const vehicle = await this.vehicleService.findByVehicleId(permno)
          if (!vehicle) {
            const req = new RecyclingRequestModel()
            req.vehicleId = newRecyclingRequest.vehicleId
            req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
            req.requestType = RecyclingRequestTypes.paymentFailed
            req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
            await req.save()

            this.logger.error(
              `car-recycling: Vehicle ${loggedPermno} has been successful deregistered but payment process failed.`,
              {
                requestType,
                recyclingPartnerId: newRecyclingRequest.recyclingPartnerId,
              },
            )

            errors.operation = 'paymentFailed'
            errors.message = `Vehicle has been successful deregistered but payment process failed. Please contact admin.`
            return errors
          }
          let guid = `Skilagjald ökutækis: ${permno}`
          if (getGuId?.id) {
            guid = getGuId.id
          }

          this.logger.info(
            `car-recycling: Payment for vehicle ${loggedPermno}  from Fjarsyslan`,
          )

          await this.fjarsyslaService.getFjarsysluRest(
            vehicle.ownerNationalId,
            permno,
            guid,
          )
        } catch (err) {
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = RecyclingRequestTypes.paymentFailed
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()

          this.logger.error(
            `car-recycling: Vehicle ${loggedPermno} has been successful deregistered but payment process failed.`,
            {
              requestType,
              recyclingPartnerId: newRecyclingRequest.recyclingPartnerId,
            },
          )

          errors.operation = 'paymentFailed'
          errors.message = `Vehicle has been successful deregistered but payment process failed. Please contact admin.`

          return errors
        }

        // 6. Update requestType to 'paymentInitiated'
        try {
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = RecyclingRequestTypes.paymentInitiated
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
        } catch (err) {
          delete err.data
          // Payment succeed but we could not log it in database
          this.logger.error(
            `car-recycling: Failed on inserting requestType 'paymentInitiated' for vehicle's number: ${loggedPermno}
            )} in database with error, but payment has succeed.`,
            { error: err },
          )
        }
      }
      // requestType: 'pendingRecycle' or 'cancelled'
      else {
        await newRecyclingRequest.save()
      }

      const status = new RequestStatus()
      status.status = true

      return status
    } catch (err) {
      delete err.data
      this.logger.error(
        `car-recycling: Something went wrong while saving request for ${loggedPermno}`,
        {
          error: err,
        },
      )

      errors.operation = 'general'
      errors.message = `Something went wrong. Please try again later.`

      return errors
    }
  }
}
