import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from './models'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(StaffModel)
    private readonly staffModel: typeof StaffModel,
  ) {}

  async findByNationalId(nationalId: string): Promise<StaffModel> {
    return await this.staffModel.findOne({
      where: {
        national_id: nationalId,
      },
    })
  }
}
