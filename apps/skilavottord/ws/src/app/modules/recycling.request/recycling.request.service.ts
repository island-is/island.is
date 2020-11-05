import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SamgongustofaService } from '../samgongustofa/models/samgongustofa.service'
import { FjarsyslaService } from '../fjarsysla/models/fjarsysla.service'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    //@Inject(SamgongustofaService)
    //private samgongustofaService: SamgongustofaService,
    @Inject(FjarsyslaService)
    private fjarsyslaService: FjarsyslaService,
  ) {}

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
      // partnerId and nationalId could not both be null when create requestType for recycling partner.
      if (!nameOfRequestor) {
        if (!partnerId || !nationalId) {
          this.logger.error(
            `partnerId and nationalId could not both be null when create requestType for recylcing partner`,
          )
          throw new Error(
            `partnerId and nationalId could not both be null when create requestType for recylcing partner`,
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
          this.logger.info(`deregistered vehicle ${permno}`)
          //await this.samgongustofaService.deRegisterVehicle(permno, partnerId)

          // 3. Update requestType to 'deregistered'
          this.logger.info(`create requestType: deregistered for ${permno}`)
          newRecyclingRequest.requestType = 'deregistered'
          await newRecyclingRequest.save()

          // 4. Call Fjarsysla for payment
          // ToDo
          this.logger.info(`payment on vehicle ${permno}`)
          await this.fjarsyslaService.getFjarsysluRest(nationalId, permno)

          // 5. Update requestType to 'paymentInitiated'
          this.logger.info(`create requestType: paymentInitiated for ${permno}`)
          newRecyclingRequest.requestType = 'paymentInitiated'
          await newRecyclingRequest.save()
        } catch (err) {
          // If we encounter any error then update requestType to 'paymentFailed'
          newRecyclingRequest.requestType = 'paymentFailed'
          await newRecyclingRequest.save()
          this.logger.error(
            `Getting error while trying to deregistered permno: ${permno}, nameOfRequestor: ${nameOfRequestor} with: ${err}`,
          )
          throw new Error(
            `Getting error while trying to deregistered permno: ${permno}`,
          )
        }
      }
      // requestType: 'pendingVehicle' or 'canceled'
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
