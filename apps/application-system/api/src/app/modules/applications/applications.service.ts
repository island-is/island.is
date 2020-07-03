import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from '../../core/db/models/application.model'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
  ) {}

  async findAll(): Promise<Application[]> {
    return await this.applicationModel.findAll<Application>()
  }

  async findOne(id: string): Promise<Application> {
    return await this.applicationModel.findOne({
      where: { id },
    })
  }
  async create(application: any): Promise<Application> {
    return await this.applicationModel.create<Application>({
      ...application,
    })
  }

  async update(id: string, data: object) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { ...data },
      { where: { id }, returning: true },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async delete(id: string) {
    return await this.applicationModel.destroy({ where: { id } })
  }
}
