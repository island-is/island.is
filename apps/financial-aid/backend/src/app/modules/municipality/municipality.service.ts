import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'
import { AidType } from '@island.is/financial-aid/shared/lib'
import { AidModel, AidService } from '../aid'
import { CreateMunicipalityDto, UpdateMunicipalityDto } from './dto'
import { Sequelize } from 'sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectModel(MunicipalityModel)
    private readonly municipalityModel: typeof MunicipalityModel,
    private readonly aidService: AidService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByMunicipalityId(
    municipalityId: string,
  ): Promise<MunicipalityModel> {
    return await this.municipalityModel.findOne({
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

  private findAidTypeId = (obj: AidModel[], type: AidType) => {
    return obj.find((el) => el.type === type).id
  }

  async create(
    municipality: CreateMunicipalityDto,
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
      )
        .then((res) => {
          municipality.individualAidId = this.findAidTypeId(
            res,
            AidType.INDIVIDUAL,
          )
          municipality.cohabitationAidId = this.findAidTypeId(
            res,
            AidType.COHABITATION,
          )
          return this.municipalityModel.create(municipality, { transaction: t })
        })
        .catch((err) => err)
    })
  }

  async updateMunicipality(
    municipalityId: string,
    municipality: UpdateMunicipalityDto,
  ): Promise<MunicipalityModel> {
    try {
      await this.sequelize.transaction((t) => {
        return Promise.all([
          this.municipalityModel.update(municipality, {
            where: { municipalityId },
            transaction: t,
          }),
          this.aidService.updateAid(
            municipality.individualAid,
            municipalityId,
            t,
          ),
          this.aidService.updateAid(
            municipality.cohabitationAid,
            municipalityId,
            t,
          ),
        ])
      })
    } catch {
      this.logger.error('Error while updating municipality')
      throw new NotFoundException(`Error while updating municipality`)
    }

    return await this.findByMunicipalityId(municipalityId)
  }

  async getAll(): Promise<MunicipalityModel[]> {
    return await this.municipalityModel.findAll()
  }
}
