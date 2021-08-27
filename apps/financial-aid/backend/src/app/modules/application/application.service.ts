import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CurrentApplicationModel, ApplicationModel } from './models'

import { Op } from 'sequelize'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import {
  ApplicationFilters,
  ApplicationState,
  User,
} from '@island.is/financial-aid/shared'
import { FileService } from '../file'
import { ApplicationEventService } from '../applicationEvent'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly fileService: FileService,
    private readonly applicationEventService: ApplicationEventService,
  ) {}

  async getCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    const date = new Date()

    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

    return this.applicationModel.findOne({
      where: {
        nationalId,
        created: { [Op.gte]: firstDateOfMonth },
      },
    })
  }

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({ order: [['modified', 'DESC']] })
  }

  async findById(id: string): Promise<ApplicationModel | null> {
    const application = await this.applicationModel.findOne({
      where: { id },
    })

    const files = await this.fileService.getAllApplicationFiles(id)

    application.setDataValue('files', files)

    return application
  }

  async getAllFilters(): Promise<ApplicationFilters> {
    const statesToCount = [
      ApplicationState.NEW,
      ApplicationState.INPROGRESS,
      ApplicationState.DATANEEDED,
      ApplicationState.REJECTED,
      ApplicationState.APPROVED,
    ]

    const countPromises = statesToCount.map((item) =>
      this.applicationModel.count({
        where: { state: { [Op.eq]: item } },
      }),
    )

    const filterCounts = await Promise.all(countPromises)

    return {
      New: filterCounts[0],
      InProgress: filterCounts[1],
      DataNeeded: filterCounts[2],
      Rejected: filterCounts[3],
      Approved: filterCounts[4],
    }
  }

  async create(
    application: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationModel> {
    const appModel = await this.applicationModel.create(application)

    //Create applicationEvent
    const eventModel = await this.applicationEventService.create({
      applicationId: appModel.id,
      state: appModel.state,
      comment: null,
    })

    //Create file
    if (application.files) {
      const fileModel = await application.files.map((f) => {
        this.fileService.createFile({
          applicationId: appModel.id,
          name: f.name,
          key: f.key,
          size: f.size,
        })
      })
    }

    return appModel
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

    //Create applicationEvent
    const eventModel = await this.applicationEventService.create({
      applicationId: id,
      state: update.state,
      comment: update.rejection,
    })

    return { numberOfAffectedRows, updatedApplication }
  }
}
