import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'
import { AidType } from '@island.is/financial-aid/shared/lib'
import { AidModel, AidService } from '../aid'
import { UpdateMunicipalityDto } from './dto'
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

  async updateMunicipality(
    municipalityId: string,
    municipality: UpdateMunicipalityDto,
  ): Promise<MunicipalityModel> {
    console.log('kemstu HINGAD???')

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
