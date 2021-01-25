import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AdminAccessDTO, AdminAccessUpdateDTO } from '../..'
import { AdminAccess } from '../entities/models/admin-access.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(AdminAccess)
    private adminAccessModel: typeof AdminAccess,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Checks if nationalId has admin access */
  async hasAccess(nationalId: string): Promise<boolean> {
    const access = await this.adminAccessModel.findByPk(nationalId)

    return access ? true : false
  }

  /** Gets the admin with the nationalId */
  async findOne(nationalId: string): Promise<AdminAccess | null> {
    this.logger.debug(`Finding admin for nationalId - "${nationalId}"`)

    const admin = await this.adminAccessModel.findByPk(nationalId)

    return admin
  }

  /** Gets all admins with paging */
  async findAndCountAll(
    page: number,
    count: number,
  ): Promise<{ rows: AdminAccess[]; count: number } | null> {
    this.logger.debug(
      `Geting admin list with page "${page}" and count "${count}"`,
    )

    page--
    const offset = page * count
    return this.adminAccessModel.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
    })
  }

  /** Creates a new admin */
  async create(admin: AdminAccessDTO): Promise<AdminAccess> {
    this.logger.debug('Creating a new admin')

    return await this.adminAccessModel.create({ ...admin })
  }

  /** Updates an existing admin */
  async update(
    admin: AdminAccessUpdateDTO,
    nationalId: string,
  ): Promise<AdminAccess | null> {
    this.logger.debug('Updating admin with nationalId: ', nationalId)

    if (!nationalId) {
      throw new BadRequestException('nationalId must be provided')
    }

    await this.adminAccessModel.update(
      { ...admin },
      {
        where: { nationalId: nationalId },
      },
    )

    return await this.findOne(nationalId)
  }

  /** Deleting an admin by nationalId */
  async delete(nationalId: string): Promise<number> {
    this.logger.debug('Deleting an admin with nationalId: ', nationalId)

    if (!nationalId) {
      throw new BadRequestException('nationalId must be provided')
    }

    return await this.adminAccessModel.destroy({
      where: {
        nationalId: nationalId,
      },
    })
  }
}
