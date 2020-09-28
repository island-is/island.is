import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ExternalData } from '@island.is/application/template'
import { Application } from './application.model'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { ApplicationTypes } from '@island.is/application/template'

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

  async findAll(): Promise<Application[]> {
    return this.applicationModel.findAll()
  }

  async findAllByType(typeId: ApplicationTypes): Promise<Application[]> {
    return this.applicationModel.findAll({
      where: { typeId },
    })
  }

  async create(application: CreateApplicationDto): Promise<Application> {
    return this.applicationModel.create(application)
  }

  async update(id: string, application: UpdateApplicationDto) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(application, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedApplication }
  }

  async updateApplicationState(id: string, state: string) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { state },
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async updateExternalData(id: string, externalData: ExternalData) {
    const existingApplication = await this.applicationModel.findOne({
      where: { id },
    })

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      {
        ...existingApplication,
        externalData: { ...existingApplication.externalData, ...externalData },
      },
      { where: { id }, returning: true },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async delete(id: string) {
    return this.applicationModel.destroy({ where: { id } })
  }
}
