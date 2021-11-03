import { Staff } from '@island.is/financial-aid/shared/lib'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateStaffDto } from './dto'

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
        nationalId,
      },
    })
  }

  async findById(id: string): Promise<StaffModel> {
    return await this.staffModel.findOne({
      where: {
        id,
      },
    })
  }

  async findByMunicipalityId(municipalityId: string): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        municipalityId,
      },
    })
  }

  async createStaff(user: Staff, input: CreateStaffDto): Promise<StaffModel> {
    return await this.staffModel.create({
      nationalId: input.nationalId,
      name: input.name,
      municipalityId: user.municipalityId,
      roles: input.roles,
      active: true,
      municipalityName: user.municipalityName,
      municipalityHomepage: user.municipalityHomepage,
    })
  }
}
