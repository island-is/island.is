import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import {
  ExternalData,
  FormValue,
  ApplicationStatus,
  ApplicationLifecycle,
} from '@island.is/application/types'
import {
  Application,
  ApplicationPaginatedResponse,
  ApplicationsStatistics,
} from './application.model'
import { getTypeIdsForInstitution } from '@island.is/application/utils'

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

const applicationByNationalId = (id: string, nationalId?: string) => ({
  id,
  ...(nationalId
    ? {
        [Op.or]: [
          { applicant: nationalId },
          { assignees: { [Op.contains]: [nationalId] } },
        ],
      }
    : {}),
})

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
    private sequelize: Sequelize,
  ) {}

  async findOneById(
    id: string,
    nationalId?: string,
  ): Promise<Application | null> {
    return this.applicationModel.findOne({
      where: applicationByNationalId(id, nationalId),
    })
  }

  async getApplicationCountByTypeIdAndStatus(
    startDate: string,
    endDate: string,
  ): Promise<ApplicationsStatistics[]> {
    const query = `SELECT 
        type_id as typeid, 
        COUNT(*) as count, 	
        COUNT(*) FILTER (WHERE status = 'draft') AS draft,
        COUNT(*) FILTER (WHERE status = 'inprogress') AS inprogress,    
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,	
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,	
        COUNT(*) FILTER (WHERE status = 'approved') AS approved 
      FROM public.application 
      WHERE modified BETWEEN :startDate AND :endDate 
      GROUP BY typeid;`

    return this.sequelize.query<ApplicationsStatistics>(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    })
  }

  async updateAttachment(
    id: string,
    nationalId: string,
    key: string,
    url: string,
  ) {
    return await this.sequelize.transaction(async (transaction) => {
      const existingApplication = await this.applicationModel.findOne({
        where: applicationByNationalId(id, nationalId),
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      if (!existingApplication) {
        throw new NotFoundException(
          `An application with the id ${id} does not exist`,
        )
      }

      const [numberOfAffectedRows, [updatedApplication]] =
        await this.applicationModel.update(
          {
            attachments: {
              ...existingApplication.attachments,
              [key]: url,
            },
          },
          {
            where: { id },
            returning: true,
            transaction,
          },
        )

      return { numberOfAffectedRows, updatedApplication }
    })
  }

  async findByApplicantActor(
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
                { applicantActors: { [Op.contains]: [nationalId] } },
              ],
            }
          : {}),
      },
    })
  }

  async findAllByInstitutionAndFilters(
    nationalId: string,
    page: number,
    count: number,
    status?: string,
    applicantNationalId?: string,
    from?: string,
    to?: string,
  ): Promise<ApplicationPaginatedResponse> {
    const statuses = status?.split(',')
    const typeIds = getTypeIdsForInstitution(nationalId)
    const toDate = to ? new Date(to) : undefined
    const fromDate = from ? new Date(from) : undefined

    // No applications for this institution ID
    if (typeIds.length < 1) {
      return {
        rows: [],
        count: 0,
      }
    }

    return this.applicationModel.findAndCountAll({
      where: {
        ...{ typeId: { [Op.in]: typeIds } },
        ...(statuses ? { status: { [Op.in]: statuses } } : {}),
        [Op.and]: [
          applicantNationalId
            ? {
                [Op.or]: [[{ applicant: { [Op.eq]: applicantNationalId } }]],
              }
            : {},
          applicationIsNotSetToBePruned(),
          fromDate && toDate
            ? {
                [Op.and]: [
                  { created: { [Op.gte]: fromDate } },
                  { created: { [Op.lte]: toDate } },
                ],
              }
            : {},
        ],
        isListed: {
          [Op.eq]: true,
        },
      },
      limit: count,
      offset: (page - 1) * count,
      order: [['modified', 'DESC']],
    })
  }

  async findAllByNationalIdAndFilters(
    nationalId: string,
    typeId?: string,
    status?: string,
    actor?: string,
    showPruned?: boolean,
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
              ...(actor
                ? [
                    { applicant: nationalId },
                    { applicantActors: { [Op.contains]: [actor] } },
                  ]
                : [{ applicant: { [Op.eq]: nationalId } }]),
              ...[{ assignees: { [Op.contains]: [nationalId] } }],
            ],
          },
          showPruned ? {} : applicationIsNotSetToBePruned(),
        ],
        isListed: {
          [Op.eq]: true,
        },
      },
      order: [['modified', 'DESC']],
    })
  }

  async findAllDueToBePruned(): Promise<Application[]> {
    return this.applicationModel.findAll({
      attributes: [
        'id',
        'attachments',
        'typeId',
        'state',
        'applicant',
        'answers',
        'externalData',
      ],
      where: {
        [Op.and]: {
          pruneAt: {
            [Op.and]: {
              [Op.not]: null,
              [Op.lt]: new Date(),
            },
          },
          pruned: {
            [Op.eq]: false,
          },
        },
      },
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

  async create(
    application: Partial<
      Pick<
        Application,
        | 'answers'
        | 'applicant'
        | 'assignees'
        | 'attachments'
        | 'state'
        | 'status'
        | 'typeId'
      >
    >,
  ): Promise<Application> {
    return this.applicationModel.create(application)
  }

  async update(
    id: string,
    application: Partial<
      Pick<
        Application,
        | 'attachments'
        | 'answers'
        | 'externalData'
        | 'pruned'
        | 'applicantActors'
        | 'draftTotalSteps'
        | 'draftFinishedSteps'
        | 'pruneAt'
      >
    >,
  ) {
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(application, {
        where: { id },
        returning: true,
      })
    return { numberOfAffectedRows, updatedApplication }
  }

  async removeNonce(application: Application, assignNonce: string) {
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(
        {
          assignNonces: application.assignNonces.filter(
            (nonce) => nonce !== assignNonce,
          ),
        },
        { where: { id: application.id }, returning: true },
      )
    return { numberOfAffectedRows, updatedApplication }
  }

  async clearNonces(id: string) {
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(
        {
          assignNonces: [],
        },
        { where: { id: id }, returning: true },
      )
    return { numberOfAffectedRows, updatedApplication }
  }

  async addNonce(application: Application, assignNonce: string) {
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(
        {
          assignNonces: [...(application?.assignNonces ?? []), assignNonce],
        },
        { where: { id: application.id }, returning: true },
      )
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
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(
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
    const [numberOfAffectedRows, [updatedApplication]] =
      await this.applicationModel.update(
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
