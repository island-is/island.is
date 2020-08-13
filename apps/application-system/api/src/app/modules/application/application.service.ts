import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './application.model'
import { ApplicationDto } from './dto/application.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findById(id: string): Promise<Application> {
    this.logger.debug(`Finding application by id - "${id}"`)
    return this.applicationModel.findOne({
      where: { id },
    })
  }

  async create(application: ApplicationDto): Promise<Application> {
    return this.applicationModel.create(application)
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
