import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from './models'

import { Staff } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(StaffModel)
    private readonly staffModel: typeof StaffModel,
  ) {}

  findById(id: string): Promise<Staff> {
    const mockStaff: Staff = {
      id: id,
      name: 'Klára Línudóttir',
      nationalId: '0000000002',
      municipalityId: 'hfj',
      role: 'worker',
      active: true,
    }
    return Promise.resolve(mockStaff)
  }
}
