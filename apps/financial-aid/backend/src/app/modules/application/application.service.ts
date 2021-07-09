import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { ApplicationModel } from './models'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import { User, Application } from '@island.is/financial-aid/shared'
import { FileService } from '../file'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly fileService: FileService, // private readonly fileService: FileService,
  ) {}

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll()
  }

  async findById(id: string): Promise<ApplicationModel | null> {
    const application = await this.applicationModel.findOne({
      where: { id },
    })

    const files = await this.fileService.getAllApplicationFiles(id)

    application.setDataValue('files', files)

    return application
  }

  async create(
    application: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationModel> {
    const applModel = await this.applicationModel.create(application)

    //Create fileEvent
    if (application.files) {
      const fileModel = await application.files.map((f) => {
        this.fileService.createFile({
          applicationId: applModel.id,
          name: f.name,
          key: f.key,
          size: f.size,
        })
      })
    }

    return applModel
  }

  async update(
    id: string,
    update: UpdateApplicationDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedApplication: ApplicationModel
  }> {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedApplication }
  }
}
