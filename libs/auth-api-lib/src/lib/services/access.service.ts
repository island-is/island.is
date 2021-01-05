import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AdminAccess } from '../entities/models/admin-access.model'

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(AdminAccess)
    private adminAccessModel: typeof AdminAccess,
  ) {}

  /** Checks if nationalId has access */
  async hasAccess(nationalId: string): Promise<boolean> {
    const access = await this.adminAccessModel.findByPk(nationalId)

    return access ? true : false
  }
}
