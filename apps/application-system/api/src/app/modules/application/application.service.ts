import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { mergeAnswers } from '@island.is/application/schema'
import { Application } from './application.model'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { FormType } from '@island.is/application/schema'

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

  async findAllByType(typeId: FormType): Promise<Application[]> {
    return this.applicationModel.findAll({
      where: { typeId },
    })
  }

  async create(application: CreateApplicationDto): Promise<Application> {
    return this.applicationModel.create(application)
  }

  async update(id: string, application: UpdateApplicationDto) {
    const existingApplication = await this.applicationModel.findOne({
      where: { id },
    })

    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      application.answers,
    )

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { ...application, answers: mergedAnswers },
      { where: { id }, returning: true },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async delete(id: string) {
    return this.applicationModel.destroy({ where: { id } })
  }
}
