import { Inject, Injectable, HttpService } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { FjarsyslaService } from '../fjarsysla/models/fjarsysla.service'
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
        order: [['updatedAt', 'DESC']],
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
    nationalId: string,
    partnerId: string,
  ): Promise<boolean> {
    try {
      this.logger.info(
        `---- Starting update requestType for ${permno} to requestType: ${requestType} ----`,
      )
      // nameOfRequestor, nationalId and partnerId are not required
      // But partnerId and nationalId always come together for recycling partner
      // otherwise it's nameOfRequestor

      // All 3 optional arguments could not be null at the same time
      if (!nameOfRequestor && !nationalId && !partnerId) {
        this.logger.error(
          `partnerId, nationalId and nameOfRequestor could not all be at the same time.`,
        )
        throw new Error(
          `partnerId, nationalId and nameOfRequestor could not all be at the same time.`,
        )
      }
      // If requestType is 'deregistered'
      // partnerId and nationalId could not both be null when create requestType for recycling partner.
      if (!nameOfRequestor && requestType == 'deregistered') {
        if (!partnerId || !nationalId) {
          this.logger.error(
            `partnerId and nationalId could not both be null when create requestType 'deregistered' for recylcing partner`,
          )
          throw new Error(
            `partnerId and nationalId could not both be null when create requestType 'deregistered' for recylcing partner`,
          )
        }
      }
      // Initalise new RecyclingRequest
      const newRecyclingRequest = new RecyclingRequestModel()
      newRecyclingRequest.vehicleId = permno
      newRecyclingRequest.requestType = requestType
      newRecyclingRequest.nameOfRequestor = nameOfRequestor
      // is partnerId null?
      if (partnerId) {
        newRecyclingRequest.recyclingPartnerId = partnerId
      }
      // Here is a bit tricky
      // 1. Update requestType to 'handOver'
      // 2. Then deregistered the vehicle from Samgongustofa
      // 3. Update requestType to 'deregistered'
      // 4. Then call fjarsysla for payment
      // 5. Update requestType to 'paymentInitiated'
      // If we encounter error then update requestType to 'paymentFailed'
      if (requestType == 'deregistered') {
        try {
          // 1. Update requestType to 'handOver'
          this.logger.info(`create requestType: handOver for ${permno}`)
          newRecyclingRequest.requestType = 'handOver'
          await newRecyclingRequest.save()

          // 2. deregistered vehicle from Samgongustofa
          this.logger.info(`start deregistered vehicle ${permno}`)
          await this.deRegisterVehicle(permno, partnerId) // TODO Check if it's partnerId or 10000

          // 3. Update requestType to 'deregistered'
          this.logger.info(`create requestType: deregistered for ${permno}`)
          newRecyclingRequest.requestType = 'deregistered'
          await newRecyclingRequest.save()

          // 4. Call Fjarsysla for payment
          this.logger.info(`start payment on vehicle ${permno}`)
          await this.fjarsyslaService.getFjarsysluRest(nationalId, permno)

          // 5. Update requestType to 'paymentInitiated'
          this.logger.info(`create requestType: paymentInitiated for ${permno}`)
          newRecyclingRequest.requestType = 'paymentInitiated'
          await newRecyclingRequest.save()
        } catch (err) {
          // If we encounter any error then update requestType to 'paymentFailed'
          newRecyclingRequest.requestType = 'paymentFailed'
          newRecyclingRequest.recyclingPartnerId = null // If getting error on PartnerId then it's still logged
          await newRecyclingRequest.save()
          this.logger.error(
            `Getting error while trying to deregistered permno: ${permno}, nameOfRequestor: ${nameOfRequestor} with: ${err}`,
          )
          throw new Error(
            `Getting error while trying to deregistered permno: ${permno}`,
          )
        }
      }
      // requestType: 'pendingVehicle' or 'cancelled'
      else {
        this.logger.info(`create requestType: ${requestType} for ${permno}`)
        await new RecyclingRequestModel().save()
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
