import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import {
  ExternalData,
  FormValue,
  ApplicationTypes,
  ApplicationStatus,
} from '@island.is/application/core'

import { Application } from './application.model'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
  ) {}

  async findOneById(id: string): Promise<Application | null> {
    return this.applicationModel.findOne({ where: { id } })
  }

  async findAllByNationalIdAndFilters(
    nationalId: string,
    typeId?: ApplicationTypes,
    status?: ApplicationStatus,
  ): Promise<Application[]> {
    return this.applicationModel.findAll({
      where: {
        ...(typeId ? { typeId } : {}),
        ...(status ? { status } : {}),
        [Op.or]: [
          { applicant: nationalId },
          { assignees: { [Op.contains]: [nationalId] } },
        ],
      },
      order: [['modified', 'DESC']],
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

  async updateApplicationState(
    id: string,
    state: string,
    answers: FormValue,
    assignees: string[],
    status: ApplicationStatus,
  ) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { state, answers, assignees, status },
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async updateExternalData(
    id: string,
    oldExternalData: ExternalData,
    externalData: ExternalData,
  ) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      {
        externalData: { ...oldExternalData, ...externalData },
      },
      { where: { id }, returning: true },
    )

    return { numberOfAffectedRows, updatedApplication }
  }

  async delete(id: string) {
    return this.applicationModel.destroy({ where: { id } })
  }
}
