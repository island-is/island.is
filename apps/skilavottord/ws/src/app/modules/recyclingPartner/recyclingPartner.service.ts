import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import {
  CreateRecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'
import { Op } from 'sequelize'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
  ) {}

  async findAll(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerModel.findAll()
  }

  async findAllActive(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
  }

  async findRecyclingPartners(
    isMunicipalityPage: boolean,
    municipalityId: string | null | undefined,
  ): Promise<RecyclingPartnerModel[]> {
    try {
      // If Role.municipality, return all recycling partners that are not municipalities
      if (municipalityId) {
        return await this.recyclingPartnerModel.findAll({
          where: {
            isMunicipality: false,
            municipalityId: municipalityId,
          },
        })
      }

      if (isMunicipalityPage) {
        return await this.recyclingPartnerModel.findAll({
          where: { isMunicipality: true },
        })
      }
      return await this.recyclingPartnerModel.findAll({
        where: {
          [Op.or]: [{ isMunicipality: false }, { isMunicipality: null }],
        },
      })
    } catch (error) {
      throw new Error(`Failed to fetch recycling partners: ${error.message}`)
    }
  }

  async findOne(companyId: string): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
      raw: true,
    })
  }

  async create(
    input: CreateRecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerModel.create(input)
  }

  async update({
    companyId,
    ...input
  }: UpdateRecyclingPartnerInput): Promise<RecyclingPartnerModel> {
    const [_, [accessControl]] = await this.recyclingPartnerModel.update(
      input,
      {
        where: { companyId },
        returning: true,
      },
    )
    return accessControl
  }

  /**
   * Get the id of the municipality or recyclingpartner that is paying for the recycling request
   * @param companyId
   * @returns
   */
  async getPayingPartnerId(companyId: string): Promise<string> {
    const partner = await this.recyclingPartnerModel.findOne({
      where: { companyId },
    })

    if (!partner) {
      throw new Error(`Partner not found for company ID: ${companyId}`)
    }

    return partner.municipalityId || partner.companyId
  }

  /**
   * Check if the recyclingPartner is de-active, if not then check if the municipality is de-active
   * @param companyId
   * @returns
   */
  async isRecyclingPartnerActive(companyId: string): Promise<boolean> {
    const partner = await this.findOne(companyId)

    if (partner.municipalityId) {
      const municipality = await this.findOne(partner.municipalityId)

      if (!municipality.active) {
        return false
      }
    }

    return !!partner.active
  }
}
