import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationModel } from './models'

import { ApplicationEventModel } from '../applicationEvent/models'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import { User, Application } from '@island.is/financial-aid/shared'
import { ApplicationEventService } from '../applicationEvent'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly applicationEventService: ApplicationEventService, // private readonly applicationEventService: typeof ApplicationEventService, // private readonly applicationEventModel: typeof ApplicationEventModel,
  ) {}

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll()
  }

  findById(id: string): Promise<ApplicationModel | null> {
    return this.applicationModel.findOne({
      where: { id },
    })
  }

  async create(
    application: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationModel> {
    //Creates application
    const applModal = await this.applicationModel.create(application)

    //Create applicationEvent
    const eventModel = await this.applicationEventService.create({
      applicationId: applModal.id,
      state: applModal.state,
      comment: null,
    })

    return applModal
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
