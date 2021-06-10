import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationModel } from './models'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import { User, Application } from '@island.is/financial-aid/shared'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll()
  }

  findById(id: string): Promise<ApplicationModel | null> {
    return this.applicationModel.findOne({
      where: { id },
    })
  }

  create(
    application: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationModel> {
    // this.logger.debug('Creating a new case')
    return this.applicationModel.create(application)
  }

  async update(
    id: string,
    update: UpdateApplicationDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedApplicant: ApplicationModel
  }> {
    const [
      numberOfAffectedRows,
      [updatedApplicant],
    ] = await this.applicationModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedApplicant }
  }
}
