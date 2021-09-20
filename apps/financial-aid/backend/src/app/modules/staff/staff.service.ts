import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from './models'

import type { Staff } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(StaffModel)
    private readonly staffModel: typeof StaffModel,
  ) {}

  findByNationalId(nationalId: string): Promise<Staff> {
    const mockStaff: Staff = {
      id: '1',
      name: 'Klára Línudóttir',
      nationalId: nationalId,
      municipalityId: 'hfj',
      role: 'employee',
      active: true,
      phoneNumber: '0001111',
    }
    return Promise.resolve(mockStaff)
  }
}
