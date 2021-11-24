import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, WhereOptions } from 'sequelize'
import {
  ExternalData,
  FormValue,
  ApplicationStatus,
} from '@island.is/application/core'

import { Application } from './application.model'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'

import { ApplicationLifecycle } from './types'

const applicationIsNotSetToBePruned = () => ({
  [Op.or]: [
    {
      pruneAt: {
        [Op.is]: null,
      },
    },
    {
      pruneAt: {
        [Op.gt]: new Date(),
      },
    },
  ],
})

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
  ) {}

  async findOneById(
    id: string,
    nationalId?: string,
  ): Promise<Application | null> {
    return this.applicationModel.findOne({
      where: {
        id,
        ...(nationalId
          ? {
              [Op.or]: [
                { applicant: nationalId },
                { assignees: { [Op.contains]: [nationalId] } },
              ],
            }
          : {}),
        ...applicationIsNotSetToBePruned(),
      },
    })
  }

  async findAllByNationalIdAndFilters(
    nationalId: string,
    typeId?: string,
    status?: string,
  ): Promise<Application[]> {
    const typeIds = typeId?.split(',')
    const statuses = status?.split(',')

    return this.applicationModel.findAll({
      where: {
        ...(typeIds ? { typeId: { [Op.in]: typeIds } } : {}),
        ...(statuses ? { status: { [Op.in]: statuses } } : {}),
        [Op.and]: [
          {
            [Op.or]: [
              { applicant: nationalId },
              { assignees: { [Op.contains]: [nationalId] } },
            ],
          },
          applicationIsNotSetToBePruned(),
        ],
        isListed: {
          [Op.eq]: true,
        },
      },
      order: [['modified', 'DESC']],
    })
  }

  /**
   * A function to pass to data providers / template api modules to be able to
   * query applications of their respective type in order to infer some data to
   * use in an application
   */
  customTemplateFindQuery(
    templateTypeId: string,
  ): (whereQueryOptions: WhereOptions) => Promise<Application[]> {
    return (whereQueryOptions: WhereOptions) => {
      return this.applicationModel.findAll({
        where: {
          ...whereQueryOptions,
          typeId: {
            [Op.eq]: templateTypeId,
          },
          ...applicationIsNotSetToBePruned(),
        },
        order: [['modified', 'DESC']],
        raw: true,
      })
    }
  }

  async create(application: CreateApplicationDto): Promise<Application> {
    return this.applicationModel.create(application)
  }

  async update(
    id: string,
    application: Partial<Pick<Application, 'attachments' | 'answers'>>,
  ) {
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
    lifecycle: ApplicationLifecycle,
  ) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(
      { state, answers, assignees, status, ...lifecycle },
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
