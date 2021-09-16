import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/sequelize'
import format from 'date-fns/format'
import { lastValueFrom } from 'rxjs'

import {
  RecyclingRequestModel,
  RecyclingRequestUnion,
  RequestErrors,
  RequestStatus,
} from './model/recycling.request.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FjarsyslaService } from '../fjarsysla/models/fjarsysla.service'
import { RecyclingPartnerService } from '../recycling.partner/recycling.partner.service'
import { VehicleService } from '../vehicle/vehicle.service'
import { environment } from '../../../environments'
import { VehicleModel } from '../vehicle/model/vehicle.model'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private httpService: HttpService,
    @Inject(FjarsyslaService)
    private fjarsyslaService: FjarsyslaService,
    @Inject(RecyclingPartnerService)
    private recycllingPartnerService: RecyclingPartnerService,
    @Inject(VehicleService)
    private vehicleService: VehicleService,
  ) {}

  async deRegisterVehicle(vehiclePermno: string, disposalStation: string) {
    try {
      this.logger.info(
        `---- Starting deRegisterVehicle call on ${vehiclePermno} ----`,
      )
      const {
        restAuthUrl,
        restDeRegUrl,
        restUsername,
        restPassword,
      } = environment.samgongustofa

      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
      }
      // TODO: saved jToken and use it in next 7 days ( until it expires )
      const authRes = await lastValueFrom(
        this.httpService.post(restAuthUrl, jsonAuthBody, {
          headers: headerAuthRequest,
        }),
      )

      if (authRes.status > 299 || authRes.status < 200) {
        this.logger.error(authRes.statusText)
        throw new Error(authRes.statusText)
      }
      // DeRegisterd vehicle
      const jToken = authRes.data['jwtToken']

      this.logger.info(
        'Finished Authentication request and starting deRegister request',
      )

      const jsonDeRegBody = JSON.stringify({
        permno: vehiclePermno,
        deRegisterDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        disposalstation: disposalStation,
        explanation: 'Rafrænt afskráning',
      })

      const headerDeRegRequest = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jToken,
      }

      this.logger.info(`RestUrl: ${restDeRegUrl}`)
      this.logger.info(`RestHeader: ${headerDeRegRequest}`)
      this.logger.info(`RestBody: ${jsonDeRegBody}`)
      const deRegRes = await lastValueFrom(
        this.httpService.post(restDeRegUrl, jsonDeRegBody, {
          headers: headerDeRegRequest,
        }),
      )
      if (deRegRes.status < 300 && deRegRes.status >= 200) {
        this.logger.info(
          `---- Finished deRegisterVehicle call on ${vehiclePermno} ----`,
        )
        return true
      } else {
        this.logger.info(deRegRes.statusText)
        throw new Error(deRegRes.statusText)
      }
    } catch (err) {
      this.logger.error(
        `Failed on deregistered vehicle ${vehiclePermno} with: ${err}`,
      )
      throw new Error(
        `Failed on deregistered vehicle ${vehiclePermno} because: ${err}`,
      )
    }
  }

  async findAll(): Promise<RecyclingRequestModel[]> {
    this.logger.info('---- Starting findAll Recycling request ----')
    const res = await this.recyclingRequestModel.findAll()
    return res
  }

  // Find all a vehicle's requests
  async findAllWithPermno(permno: string): Promise<RecyclingRequestModel[]> {
    this.logger.info(
      `---- Starting findAllWithPermno Recycling request for ${permno} ----`,
    )
    try {
      const res = await this.recyclingRequestModel.findAll({
        where: { vehicleId: permno },
        order: [['createdAt', 'DESC']],
      })

      this.logger.info(
        `---- Finished findAllWithPermno Recycling request for ${permno} ----`,
      )
      return res
    } catch (err) {
      this.logger.error(
        `Getting error when trying to findAllWithPermno: ${permno}`,
      )
      throw new Error(err)
    }
  }

  // Find all a vehicle's requests
  async getVehicleInfoToDeregistered(permno: string): Promise<VehicleModel> {
    this.logger.info(
      `---- Starting getVehicleInfoToDeregistered request for ${permno} ----`,
    )
    try {
      // Check 'pendingRecycle' status
      this.logger.info(`Getting lastest requestType on vehicle: ${permno}`)
      const resRequestType = await this.findAllWithPermno(permno)
      if (resRequestType.length > 0) {
        if (
          resRequestType[0]['dataValues']['requestType'] != 'pendingRecycle'
        ) {
          this.logger.error(
            `Lastest requestType of vehicle's number ${permno} is not 'pendingRecycle' but is: ${resRequestType[0]['dataValues']['requestType']}`,
          )
          throw new Error(
            `Lastest requestType of vehicle's number ${permno} is not 'pendingRecycle' but is: ${resRequestType[0]['dataValues']['requestType']}`,
          )
        }
      } else {
        this.logger.error(
          `Could not find any requestType for vehicle's number: ${permno} in database`,
        )
        throw new Error(
          `Could not find any requestType for vehicle's number: ${permno} in database`,
        )
      }

      // Get vehicle's information
      this.logger.info(`Getting vehicle's information for vehicle: ${permno}`)
      const res = await this.vehicleService.findByVehicleId(permno)
      if (!res) {
        this.logger.error(
          `Could not find any vehicle's information for vehicle's number: ${permno} in database`,
        )
        throw new Error(
          `Could not find any vehicle's information for vehicle's number: ${permno} in database`,
        )
      }

      this.logger.info(
        `---- Finished getVehicleInfoToDeregistered request for ${permno} ----`,
      )
      return res
    } catch (err) {
      this.logger.error(
        `Getting error when trying to getVehicleInfoToDeregistered: ${permno}`,
      )
      throw new Error(err)
    }
  }

  // Create new RecyclingRequest for citizen and recycling partner.
  // partnerId could be null, when it's the request is for citizen
  async createRecyclingRequest(
    requestType: string,
    permno: string,
    nameOfRequestor: string,
    partnerId: string,
  ): Promise<typeof RecyclingRequestUnion> {
    const errors = new RequestErrors()
    try {
      this.logger.info(
        `---- Starting update requestType for ${permno} to requestType: ${requestType} ----`,
      )
      // nameOfRequestor and partnerId are not required arguments
      // But partnerId and partnerId could not both be null at the same time
      if (!nameOfRequestor && !partnerId) {
        this.logger.error(
          `partnerId and nameOfRequestor could not be null at the same time.`,
        )
        errors.operation = 'Checking arguments'
        errors.message = `Not all required fields are filled. Please contact admin.`
        return errors
      }
      // If requestType is 'deregistered'
      // partnerId could not be null when create requestType for recycling partner.
      if (requestType == 'deregistered' && !partnerId) {
        this.logger.error(
          `partnerId could not be null when create requestType 'deregistered' for recylcing partner`,
        )
        errors.operation = 'Checking partnerId'
        errors.message = `Not all required fields are filled. Please contact admin.`
        return errors
      }

      // If requestType is not 'pendingRecycle', 'cancelled' or 'deregistered'
      if (
        !(
          requestType == 'pendingRecycle' ||
          requestType == 'cancelled' ||
          requestType == 'deregistered'
        )
      ) {
        this.logger.error(
          `requestType have to be 'pendingRecycle', 'cancelled' or 'deregistered'`,
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
        const partner = await this.recycllingPartnerService.findByPartnerId(
          partnerId,
        )
        if (!partner) {
          this.logger.error(
            `Could not find Partner from partnerId: ${partnerId}`,
          )
          errors.operation = 'Checking partner'
          errors.message = `Your station is not in the recycling station list. Please contact admin.`
          return errors
        }
        newRecyclingRequest.nameOfRequestor = partner['companyName']
      }

      // Checking if 'permno' is already in the database
      const isVehicle = await this.vehicleService.findByVehicleId(permno)
      if (!isVehicle) {
        this.logger.error(`Vehicle ${permno} has not been saved in database`)
        errors.operation = 'Checking vehicle'
        errors.message = `Citizen has not accepted to recycle the vehicle.`
        return errors
      }

      // Here is a bit tricky
      // 1. Check if lastest vehicle's requestType is 'pendingRecycle'
      // 2. Set requestType to 'handOver'
      // 3. Then deregistered the vehicle from Samgongustofa
      // 4. Set requestType to 'deregistered'
      // 5. Then call fjarsysla for payment
      // 6. Set requestType to 'paymentInitiated'
      // If we encounter error then update requestType to 'paymentFailed'
      // If we encounter error with 'partnerId' then there is no request saved
      if (requestType == 'deregistered') {
        // 1. Check 'pendingRecycle' requestType
        this.logger.info(`Check "pendingRecycle" status on vehicle: ${permno}`)
        const resRequestType = await this.findAllWithPermno(permno)
        if (!requestType || resRequestType.length == 0) {
          this.logger.error(
            `Could not find any requestType for vehicle's number: ${permno} in database`,
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
              `Lastest requestType of vehicle's number ${permno} is not 'pendingRecycle' but is: ${resRequestType[0]['dataValues']['requestType']}`,
            )
            errors.operation = 'Checking vehicle status'
            errors.message = `Citizen has not accepted to recycle the vehicle.`
            return errors
          }
        }

        // 2. Update requestType to 'handOver'
        try {
          this.logger.info(
            `create requestType: handOver for ${permno} for partnerId: ${partnerId}`,
          )
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = 'handOver'
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
        } catch (err) {
          this.logger.error(
            `Getting error while inserting requestType 'handOver' for vehicle's number: ${permno} in database with error: ${err}`,
          )
          errors.operation = 'handOver'
          errors.message = `Could not start deregistered process. Please try again later.`
          return errors
        }

        // 3. deregistered vehicle from Samgongustofa
        try {
          this.logger.info(
            `start deregistered vehicle ${permno} for partnerId: ${partnerId}`,
          )
          // partnerId 000 is Rafræn afskráning in Samgongustofa's system
          // Samgongustofa wants to use it ('000') instead of Recycling partnerId for testing
          await this.deRegisterVehicle(permno, partnerId)
        } catch (err) {
          this.logger.error(
            `Getting error while deregistered vehicle: ${permno} on Samgongustofa with error: ${err}`,
          )
          // Saved requestType back to 'pendingRecycle'
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = 'pendingRecycle'
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
          errors.operation = 'deregistered'
          errors.message = `deregistered process failed. Please try again later.`
          return errors
        }

        // 4. Update requestType to 'deregistered'
        let getGuId = new RecyclingRequestModel()
        try {
          this.logger.info(
            `create requestType: deregistered for ${permno} for partnerId: ${partnerId}`,
          )
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = 'deregistered'
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          getGuId = await req.save()
        } catch (err) {
          // Log error and continue to payment
          this.logger.error(
            `Getting error while inserting requestType 'deregistered' for vehicle's number: ${permno} in database with error: ${err}`,
          )
        }

        // 5. Call Fjarsysla for payment
        try {
          this.logger.info(
            `start payment on vehicle ${permno} for partnerId: ${partnerId}`,
          )
          // Need to send vehicleOwner's nationalId on fjarsysla API
          const vehicle = await this.vehicleService.findByVehicleId(permno)
          if (!vehicle) {
            this.logger.error(
              `Could not find vehicleOwner's nationalId for vehicle's number: ${permno}`,
            )
            const req = new RecyclingRequestModel()
            req.vehicleId = newRecyclingRequest.vehicleId
            req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
            req.requestType = 'paymentFailed'
            req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
            await req.save()
            errors.operation = 'paymentFailed'
            errors.message = `Vehicle has been successful deregistered but payment process failed. Please contact admin.`
            return errors
          }
          let guid = `Skilagjald ökutækis: ${permno}`
          if (getGuId?.id) {
            guid = getGuId.id
          }
          await this.fjarsyslaService.getFjarsysluRest(
            vehicle.ownerNationalId,
            permno,
            guid,
          )
        } catch (err) {
          this.logger.error(
            `Getting error while calling payment process for vehicle's number: ${permno} in database with error: ${err}`,
          )
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = 'paymentFailed'
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
          errors.operation = 'paymentFailed'
          errors.message = `Vehicle has been successful deregistered but payment process failed. Please contact admin.`
          return errors
        }

        // 6. Update requestType to 'paymentInitiated'
        try {
          this.logger.info(
            `create requestType: paymentInitiated for ${permno} for partnerId: ${partnerId}`,
          )
          const req = new RecyclingRequestModel()
          req.vehicleId = newRecyclingRequest.vehicleId
          req.nameOfRequestor = newRecyclingRequest.nameOfRequestor
          req.requestType = 'paymentInitiated'
          req.recyclingPartnerId = newRecyclingRequest.recyclingPartnerId
          await req.save()
        } catch (err) {
          this.logger.error(
            `Getting error while inserting requestType 'paymentInitiated' for vehicle's number: ${permno} in database with error: ${err}`,
          )
        }
      }
      // requestType: 'pendingRecycle' or 'cancelled'
      else {
        this.logger.info(`create requestType: ${requestType} for ${permno}`)
        await newRecyclingRequest.save()
      }
      const status = new RequestStatus()
      status.status = true
      this.logger.info(
        `---- Finsihed update requestType for ${permno} to requestType: ${requestType} ----`,
      )
      return status
    } catch (err) {
      this.logger.error(
        `Getting error while creating createRecyclingRquest for requestType: ${requestType}, permno: ${permno}, nameOfRequestor: ${nameOfRequestor}, partnerId: ${partnerId} with: ${err}`,
      )
      errors.operation = 'general'
      errors.message = `Something went wrong. Please try again later.`
      return errors
    }
  }
}
