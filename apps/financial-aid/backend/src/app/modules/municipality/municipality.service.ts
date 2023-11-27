import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import CryptoJS from 'crypto-js'
import { uuid } from 'uuidv4'

import { MunicipalityModel } from './models'
import { AidType, Staff } from '@island.is/financial-aid/shared/lib'
import { AidModel, AidService } from '../aid'
import {
  MunicipalityActivityDto,
  UpdateMunicipalityDto,
  CreateMunicipalityDto,
} from './dto'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { StaffService } from '../staff'
import { CreateStaffDto } from '../staff/dto'
import { environment } from '../../../environments'

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectModel(MunicipalityModel)
    private readonly municipalityModel: typeof MunicipalityModel,
    private readonly aidService: AidService,
    private readonly staffService: StaffService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByMunicipalityId(
    municipalityId: string,
  ): Promise<MunicipalityModel> {
    return await this.municipalityModel.findOne({
      attributes: {
        exclude: [
          'navUrl',
          'usingNav',
          'navUsername',
          'navPassword',
          'created',
          'modified',
        ],
      },
      where: { municipalityId },
      include: [
        {
          model: AidModel,
          as: 'individualAid',
          where: {
            municipalityId,
            type: AidType.INDIVIDUAL,
          },
        },
        {
          model: AidModel,
          as: 'cohabitationAid',
          where: {
            municipalityId,
            type: AidType.COHABITATION,
          },
        },
      ],
    })
  }

  async findByMunicipalityIdWithNav(
    municipalityId: string,
  ): Promise<MunicipalityModel> {
    return this.decryptNavPassword(
      await this.municipalityModel.findOne({
        where: { municipalityId },
        include: [
          {
            model: AidModel,
            as: 'individualAid',
            where: {
              municipalityId,
              type: AidType.INDIVIDUAL,
            },
          },
          {
            model: AidModel,
            as: 'cohabitationAid',
            where: {
              municipalityId,
              type: AidType.COHABITATION,
            },
          },
        ],
      }),
    )
  }

  async findByMunicipalityIds(
    staffNationalId: string,
  ): Promise<MunicipalityModel[]> {
    const currentStaffMuncipalities = await this.staffService.findByNationalId(
      staffNationalId,
    )
    if (currentStaffMuncipalities.municipalityIds) {
      return (
        await this.municipalityModel.findAll({
          where: {
            municipalityId: {
              [Op.in]: currentStaffMuncipalities.municipalityIds,
            },
          },
          order: ['name'],
          include: [
            {
              model: AidModel,
              as: 'individualAid',
              where: {
                municipalityId: {
                  [Op.in]: currentStaffMuncipalities.municipalityIds,
                },
                type: AidType.INDIVIDUAL,
              },
            },
            {
              model: AidModel,
              as: 'cohabitationAid',
              where: {
                municipalityId: {
                  [Op.in]: currentStaffMuncipalities.municipalityIds,
                },
                type: AidType.COHABITATION,
              },
            },
          ],
        })
      ).map((m) => this.decryptNavPassword(m))
    }
    return []
  }

  private findAidTypeId = (obj: AidModel[], type: AidType) => {
    return obj.find((el) => el.type === type).id
  }

  async create(
    municipality: CreateMunicipalityDto,
    admin: CreateStaffDto,
  ): Promise<MunicipalityModel> {
    return await this.sequelize.transaction(async (t) => {
      return await Promise.all(
        Object.values(AidType).map((item) => {
          return this.aidService.create(
            {
              municipalityId: municipality.municipalityId,
              type: item,
            },
            t,
          )
        }),
      ).then(async (res) => {
        municipality.individualAidId = this.findAidTypeId(
          res,
          AidType.INDIVIDUAL,
        )
        municipality.cohabitationAidId = this.findAidTypeId(
          res,
          AidType.COHABITATION,
        )

        if (admin) {
          return await this.staffService
            .createStaff(
              admin,
              {
                municipalityId: municipality.municipalityId,
                municipalityName: municipality.name,
              },
              t,
              true,
            )
            .then(() => {
              return this.municipalityModel.create(municipality, {
                transaction: t,
              })
            })
        } else {
          return this.municipalityModel.create(municipality, {
            transaction: t,
          })
        }
      })
    })
  }

  async updateMunicipality(
    municipality: UpdateMunicipalityDto,
    currentUser: Staff,
  ): Promise<MunicipalityModel[]> {
    try {
      if (municipality.navPassword) {
        municipality.navPassword = CryptoJS.AES.encrypt(
          municipality.navPassword,
          environment.navEncryptionKey,
          { iv: CryptoJS.enc.Hex.parse(uuid()) },
        ).toString()
      }

      await this.sequelize.transaction((t) => {
        return Promise.all([
          this.municipalityModel.update(municipality, {
            where: { municipalityId: municipality.municipalityId },
            transaction: t,
          }),
          this.aidService.updateAid(
            municipality.individualAid,
            municipality.municipalityId,
            t,
          ),
          this.aidService.updateAid(
            municipality.cohabitationAid,
            municipality.municipalityId,
            t,
          ),
        ])
      })
    } catch {
      this.logger.error('Error while updating municipality')
      throw new NotFoundException(`Error while updating municipality`)
    }
    return await this.findByMunicipalityIds(currentUser.nationalId)
  }

  async getAll(): Promise<MunicipalityModel[]> {
    return await this.municipalityModel.findAll()
  }

  async update(
    id: string,
    update: MunicipalityActivityDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedMunicipality: MunicipalityModel
  }> {
    const [numberOfAffectedRows, [updatedMunicipality]] =
      await this.municipalityModel.update(update, {
        where: { id },
        returning: true,
      })

    return { numberOfAffectedRows, updatedMunicipality }
  }

  decryptNavPassword(municipality?: MunicipalityModel) {
    if (municipality?.navPassword) {
      municipality.navPassword = CryptoJS.AES.decrypt(
        municipality.navPassword,
        environment.navEncryptionKey,
      ).toString(CryptoJS.enc.Utf8)
    }
    return municipality
  }
}
