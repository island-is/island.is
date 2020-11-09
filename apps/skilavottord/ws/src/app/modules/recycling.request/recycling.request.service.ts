import { Inject, Injectable, HttpService } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { FjarsyslaService } from '../fjarsysla/models/fjarsysla.service'
import { RecyclingPartnerService } from '../recycling.partner/recycling.partner.service'
import { VehicleService } from '../vehicle/vehicle.service'
import { environment } from '../../../environments'

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
        restReportingStation,
      } = environment.samgongustofa

      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
      }

      const authRes = await this.httpService
        .post(restAuthUrl, jsonAuthBody, { headers: headerAuthRequest })
        .toPromise()

      if (authRes.status > 299 || authRes.status < 200) {
        this.logger.error(authRes.statusText)
        throw new Error(authRes.statusText)
      }
      // DeRegisterd vehicle
      const jToken = authRes.data['jwtToken']

      this.logger.info(
        'Finished Authentication request and starting deRegister request',
      )
      const dateNow = new Date()
      const jsonDeRegBody = JSON.stringify({
        permno: vehiclePermno,
        deRegisterDate:
          dateNow.toLocaleDateString() +
          'T' +
          dateNow.toTimeString().split(' ')[0] +
          'Z',
        subCode: 'U',
        plateCount: 0,
        destroyed: 0,
        lost: 0,
        reportingStation: restReportingStation,
        reportingStationType: 'R',
        disposalStation: disposalStation,
        disposalStationType: 'M',
        explanation: 'TODO, what to put here?',
      })

      const headerDeRegRequest = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jToken,
      }

      const deRegRes = await this.httpService
        .post(restDeRegUrl, jsonDeRegBody, { headers: headerDeRegRequest })
        .toPromise()

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
      throw new Error(`Failed on deregistered vehicle ${vehiclePermno}...`)
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

  // Create new RecyclingRequest for citizen and recycling partner.
  // partnerId could be null, when it's the request is for citizen
  async createRecyclingRequest(
    requestType: string,
    permno: string,
    nameOfRequestor: string,
    partnerId: string,
  ): Promise<boolean> {
    try {
      this.logger.info(
        `---- Starting update requestType for ${permno} to requestType: ${requestType} ----`,
      )
      // nameOfRequestor and partnerId are not required arguments
      // But partnerId and partnerId could not both be null at the same time
      if (!nameOfRequestor && !partnerId) {
        this.logger.error(
          `partnerId and nameOfRequestor could not all be at the same time.`,
        )
        throw new Error(
          `partnerId and nameOfRequestor could not all be at the same time.`,
        )
      }
      // If requestType is 'deregistered'
      // partnerId could not be null when create requestType for recycling partner.
      if (requestType == 'deregistered' && !partnerId) {
        this.logger.error(
          `partnerId could not both be null when create requestType 'deregistered' for recylcing partner`,
        )
        throw new Error(
          `partnerId could not both be null when create requestType 'deregistered' for recylcing partner`,
        )
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
          throw new Error(`Could not find Partner from partnerId: ${partnerId}`)
        }
        newRecyclingRequest.nameOfRequestor = partner['companyName']
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
        try {
          // 1. Check 'pendingRecycle' requestType
          const resRequestType = await this.findAllWithPermno(permno)
          if (resRequestType.length > 0) {
            if (
              resRequestType[0]['dataValues']['requestType'] != 'pendingRecycle'
            ) {
              throw new Error(
                `Lastest requestType of vehicle's number ${permno} is not 'pendingRecycle' but is: ${resRequestType[0]['dataValues']['requestType']}`,
              )
            }
            throw new Error(
              `Could not find any requestType for vehicle's number: ${permno} in database`,
            )
          }

          // 2. Update requestType to 'handOver'
          this.logger.info(
            `create requestType: handOver for ${permno} for partnerId: ${partnerId}`,
          )
          newRecyclingRequest.requestType = 'handOver'
          await newRecyclingRequest.save()

          // 3. deregistered vehicle from Samgongustofa
          this.logger.info(
            `start deregistered vehicle ${permno} for partnerId: ${partnerId}`,
          )
          // partnerId 000 is Rafræn afskráning in Samgongustofa's system
          // Samgongustofa wants to use it ('000') instead of Recycling partnerId
          await this.deRegisterVehicle(permno, '000')

          // 4. Update requestType to 'deregistered'
          this.logger.info(
            `create requestType: deregistered for ${permno} for partnerId: ${partnerId}`,
          )
          newRecyclingRequest.requestType = 'deregistered'
          await newRecyclingRequest.save()

          // 5. Call Fjarsysla for payment
          this.logger.info(
            `start payment on vehicle ${permno} for partnerId: ${partnerId}`,
          )
          // Need to send vehicleOwner's nationalId on fjarsysla API
          const vehicle = await this.vehicleService.findByVehicleId(permno)
          if (!vehicle) {
            throw new Error(
              `Could not find vehicleOwner's nationalId for vehicle's number: ${permno}`,
            )
          }
          await this.fjarsyslaService.getFjarsysluRest(
            vehicle.ownerNationalId,
            permno,
          )

          // 6. Update requestType to 'paymentInitiated'
          this.logger.info(
            `create requestType: paymentInitiated for ${permno} for partnerId: ${partnerId}`,
          )
          newRecyclingRequest.requestType = 'paymentInitiated'
          await newRecyclingRequest.save()
        } catch (err) {
          // If we encounter any error then update requestType to 'paymentFailed'
          newRecyclingRequest.requestType = 'paymentFailed'
          await newRecyclingRequest.save()
          this.logger.error(
            `Getting error while trying to deregistered permno: ${permno} for partnerId: ${partnerId} with: ${err}`,
          )
          throw new Error(
            `Getting error while trying to deregistered permno: ${permno} for partnerId: ${partnerId}`,
          )
        }
      }
      // requestType: 'pendingRecycle' or 'cancelled'
      else {
        this.logger.info(`create requestType: ${requestType} for ${permno}`)
        await newRecyclingRequest.save()
      }
      this.logger.info(
        `---- Finsihed update requestType for ${permno} to requestType: ${requestType} ----`,
      )
      return true
    } catch (err) {
      this.logger.error(
        `Getting error while trying createRecyclingRquest for requestType: ${requestType}, permno: ${permno}, nameOfRequestor: ${nameOfRequestor}, partnerId: ${partnerId} with: ${err}`,
      )
      throw new Error(`Getting error while createRecyclingRequest`)
    }
  }
}
