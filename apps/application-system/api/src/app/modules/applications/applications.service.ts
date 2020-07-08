import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from '../../core/db/models/application.model'
import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
  ) {}

  async findAll(): Promise<Application[]> {
    return this.applicationModel.findAll<Application>()
  }

  async findOne(id: string): Promise<Application> {
    return this.applicationModel.findOne({
      where: { id },
    })
  }

  async create(application: ApplicationDto): Promise<Application> {
    return this.applicationModel.create<Application>({
      ...application,
    })
  }

  async update(id: string, application: ApplicationDto) {
    // Validate answers based of typeId
    // GET schema for typeId
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { ...application },
      { where: { id }, returning: true },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async delete(id: string) {
    return this.applicationModel.destroy({ where: { id } })
  }
}
