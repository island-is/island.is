import { Staff } from '@island.is/financial-aid/shared/lib'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UpdateStaffDto, CreateStaffDto } from './dto'

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

  async update(
    id: string,
    update: UpdateStaffDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedStaff: StaffModel
  }> {
    const [numberOfAffectedRows, [updatedStaff]] = await this.staffModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedStaff }
  }

  async createStaff(user: Staff, input: CreateStaffDto): Promise<StaffModel> {
    return await this.staffModel.create({
      nationalId: input.nationalId,
      name: input.name,
      municipalityId: user.municipalityId,
      email: input.email,
      roles: input.roles,
      active: true,
      municipalityName: user.municipalityName,
      municipalityHomepage: user.municipalityHomepage,
    })
  }
}
