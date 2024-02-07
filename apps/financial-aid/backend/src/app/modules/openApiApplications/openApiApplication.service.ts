import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from '../staff'
import { ApplicationModel } from '../application/models'
import { Op } from 'sequelize'

@Injectable()
export class OpenApiApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  async getAll(
    municipalityCodes: string,
    startDate: string,
    endDate: string,
  ): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      where: {
        municipalityCode: municipalityCodes,
        created: { [Op.lte]: endDate, [Op.gte]: startDate },
      },
      order: [['modified', 'DESC']],
      include: [{ model: StaffModel, as: 'staff' }],
    })
  }
}
