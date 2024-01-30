import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from '../staff'
import { ApplicationModel } from '../application/models'

@Injectable()
export class OpenApiApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  async getAll(municipalityCodes: string): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      where: {
        municipalityCode: municipalityCodes,
      },
      order: [['modified', 'DESC']],
      include: [{ model: StaffModel, as: 'staff' }],
    })
  }
}
