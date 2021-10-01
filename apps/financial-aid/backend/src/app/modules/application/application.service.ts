import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CurrentApplicationModel, ApplicationModel } from './models'

import { Op } from 'sequelize'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import {
  ApplicationEventType,
  ApplicationFilters,
  ApplicationState,
  User,
} from '@island.is/financial-aid/shared/lib'
import { FileService } from '../file'
import { ApplicationEventService } from '../applicationEvent'
import { StaffModel } from '../staff'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly fileService: FileService,
    private readonly applicationEventService: ApplicationEventService,
  ) {}

  async hasAccessToApplication(
    nationalId: string,
    id: string,
  ): Promise<boolean> {
    const hasApplication = await this.applicationModel.findOne({
      where: { id, nationalId },
    })

    return Boolean(hasApplication)
  }

  async getCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    const date = new Date()

    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

    return await this.applicationModel.findOne({
      where: {
        nationalId,
        created: { [Op.gte]: firstDateOfMonth },
      },
    })
  }

  async getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      order: [['modified', 'DESC']],
      include: [{ model: StaffModel, as: 'staff' }],
    })
  }

  async findById(id: string): Promise<ApplicationModel | null> {
    const application = await this.applicationModel.findOne({
      where: { id },
      include: [{ model: StaffModel, as: 'staff' }],
    })

    const files = await this.fileService.getAllApplicationFiles(id)

    application?.setDataValue('files', files)

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
    await this.applicationEventService.create({
      applicationId: appModel.id,
      eventType: ApplicationEventType[appModel.state.toUpperCase()],
    })

    //Create file
    if (application.files) {
      const promises = application.files.map((f) => {
        return this.fileService.createFile({
          applicationId: appModel.id,
          name: f.name,
          key: f.key,
          size: f.size,
          type: f.type,
        })
      })

      await Promise.all(promises)
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
    if (update.state === ApplicationState.NEW) {
      update.staffId = null
    }
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
      eventType: ApplicationEventType[update.state.toUpperCase()],
      comment: update?.rejection || update?.amount?.toLocaleString('de-DE'),
    })

    return { numberOfAffectedRows, updatedApplication }
  }
}
