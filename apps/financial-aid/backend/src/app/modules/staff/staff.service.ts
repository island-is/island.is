import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { UpdateStaffDto, CreateStaffDto } from './dto'
import { Op } from 'sequelize'

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
      order: Sequelize.literal(
        'CASE WHEN active = true THEN 0 ELSE 1 END, name ASC',
      ),
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

  async numberOfUsersForMunicipality(municipalityId: string): Promise<number> {
    return await this.staffModel.count({
      where: {
        municipalityId,
      },
    })
  }

  async getUsers(municipalityId: string): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        municipalityId,
        roles: { [Op.contains]: [StaffRole.ADMIN] },
        active: true,
      },
    })
  }

  async getSupervisors(): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        roles: { [Op.contains]: [StaffRole.SUPERADMIN] },
      },
    })
  }
}
