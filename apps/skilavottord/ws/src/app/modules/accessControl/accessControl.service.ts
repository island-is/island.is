import { AccessControlModel } from './accessControl.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import {
  CreateAccessControlInput,
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'
import { RecyclingPartnerModel } from '../recyclingPartner/recyclingPartner.model'

@Injectable()
export class AccessControlService {
  constructor(
    @InjectModel(AccessControlModel)
    private accessControlModel: typeof AccessControlModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findAll(): Promise<AccessControlModel[]> {
    this.logger.info('---- Starting findAll Access Controls ----')
    try {
      const res = await AccessControlModel.findAll({
        include: [
          {
            model: RecyclingPartnerModel,
          },
        ],
      })
      this.logger.info(
        'findAll-recyclingUsers result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding all recyclingUsers:' + error)
    }
  }

  async findOne(nationalId: string): Promise<AccessControlModel> {
    this.logger.info('find one access user...')
    try {
      const res = await this.accessControlModel.findOne({
        where: { nationalId: nationalId },
        include: [
          {
            model: RecyclingPartnerModel,
          },
        ],
      })
      this.logger.info(
        'findOne-accessControl result:' + JSON.stringify(res, null, 2),
      )
      // null if not found
      return res
    } catch (error) {
      this.logger.error('error finding one AccessControl:' + error)
    }
  }

  // async createAccess(
  //   input: CreateAccessControlInput,
  // ): Promise<AccessControlModel> {
  //   // TODO replace mock data with actual db query
  //   return Promise.resolve({
  //     nationalId: '1234567890',
  //     name: 'Gervimaður3',
  //     role: Role.recyclingCompany,
  //     partnerId: '9999999999',
  //   })
  // }

  async createAccess(
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    this.logger.info('Creating Access:' + JSON.stringify(input, null, 2))
    try {
      const dd = input as AccessControlModel
      const res = await dd.save()
      if (res) {
        return res as AccessControlModel
      } else {
        throw Error(`access could not be created.`)
      }
    } catch (error) {
      this.logger.error('error creating Access:' + error)
      throw Error('error creating Access:' + error)
    }
  }

  async updateAccess(
    input: UpdateAccessControlInput,
  ): Promise<AccessControlModel> {
    try {
      const dd = await this.accessControlModel.findOne({
        where: { nationalId: input.nationalId },
      })
      if (!dd) {
        throw Error(`Access user not found: ${input.nationalId}`)
      }
      dd.partnerId = input.partnerId
      dd.role = input.role
      dd.name = input.name
      dd.save()
      return null
    } catch (error) {
      throw Error('error creating Access:' + error)
    }
  }

  // async updateAccess(
  //   input: UpdateAccessControlInput,
  // ): Promise<AccessControlModel> {
  //   // TODO replace mock data with actual db query
  //   return Promise.resolve({
  //     nationalId: '1234567890',
  //     name: 'Gervimaður3',
  //     role: Role.recyclingCompany,
  //     partnerId: '9999999999',
  //   })
  // }

  // returns count of destroyed
  async removeAccess(nationalId: string): Promise<number> {
    this.logger.info('Removing Access:' + nationalId)
    const res = await AccessControlModel.destroy({
      where: { national_id: nationalId },
    })
    return res
  }

  async deleteAccess(input: DeleteAccessControlInput): Promise<Boolean> {
    // TODO do actual delete
    return true
  }
}
