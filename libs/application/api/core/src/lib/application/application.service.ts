import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import {
  ApplicationLifecycle,
  ApplicationStatus,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  Application,
  ApplicationPaginatedResponse,
  ApplicationsStatistics,
} from './application.model'
import {
  getInstitutionsWithApplicationTypesIds,
  getTypeIdsForInstitution,
} from '@island.is/application/utils'

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

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => '\\' + m)

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
    institutionNationalId?: string,
  ): Promise<ApplicationsStatistics[]> {
    const { applicationTypeIds, returnEmpty } = this.resolveApplicationTypeIds(
      institutionNationalId,
    )

    if (returnEmpty) {
      return []
    }

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
      ${
        applicationTypeIds?.length ? `AND type_id IN (:applicationTypeIds)` : ''
      }
      GROUP BY typeid;`

    const replacements: Record<string, unknown> = {
      startDate,
      endDate,
    }

    if (applicationTypeIds?.length) {
      replacements.applicationTypeIds = applicationTypeIds
    }

    return this.sequelize.query<ApplicationsStatistics>(query, {
      replacements,
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

  async findAllByAdminFilters(
    page: number,
    count: number,
    status?: string,
    applicantNationalId?: string,
    institutionNationalId?: string,
    from?: string,
    to?: string,
    typeIdValue?: string,
    searchStr?: string,
  ): Promise<ApplicationPaginatedResponse> {
    const statuses = status?.split(',')
    const toDate = to ? new Date(to) : undefined
    const fromDate = from ? new Date(from) : undefined

    const { applicationTypeIds, returnEmpty } = this.resolveApplicationTypeIds(
      institutionNationalId,
      typeIdValue,
    )

    if (returnEmpty) {
      return {
        rows: [],
        count: 0,
      }
    }

    return this.applicationModel.findAndCountAll({
      where: {
        [Op.and]: [
          statuses ? { status: { [Op.in]: statuses } } : {},
          applicationTypeIds?.length
            ? { typeId: { [Op.in]: applicationTypeIds } }
            : {},
          fromDate ? { created: { [Op.gte]: fromDate } } : {},
          toDate ? { created: { [Op.lte]: toDate } } : {},
          applicantNationalId
            ? { applicant: { [Op.eq]: applicantNationalId } }
            : {},
          searchStr
            ? {
                [Op.or]: [
                  { applicant: { [Op.eq]: searchStr } },
                  { assignees: { [Op.contains]: [searchStr] } },
                  Sequelize.where(
                    Sequelize.cast(Sequelize.col('answers'), 'text'),
                    {
                      [Op.iLike]: `%${escapeLike(searchStr)}%`,
                    },
                  ),
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

  private resolveApplicationTypeIds(
    institutionNationalId?: string,
    typeId?: string,
  ): { applicationTypeIds?: string[]; returnEmpty: boolean } {
    // Case 1: neither institution nor typeId -> no type filter at all
    if (!institutionNationalId && !typeId) {
      return { returnEmpty: false }
    }

    // Case 2: only typeId -> filter by that typeId only
    if (!institutionNationalId && typeId) {
      return { applicationTypeIds: [typeId], returnEmpty: false }
    }

    // From here on, institutionNationalId is defined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const institutionTypeIds = getTypeIdsForInstitution(institutionNationalId!)

    // If the institution has no types at all, no applications can match
    if (!institutionTypeIds.length) {
      return { returnEmpty: true }
    }

    // Case 3: institution only -> all types belonging to that institution
    if (!typeId) {
      return { applicationTypeIds: institutionTypeIds, returnEmpty: false }
    }

    // Case 4: both institution and typeId -> typeId must belong to the institution
    if (!institutionTypeIds.includes(typeId)) {
      return { returnEmpty: true }
    }

    // Valid institution+typeId combination
    return { applicationTypeIds: [typeId], returnEmpty: false }
  }

  async getAllApplicationTypes(nationalId?: string): Promise<{ id: string }[]> {
    let filterByTypeIds: string[] | undefined

    if (nationalId) {
      filterByTypeIds = getTypeIdsForInstitution(nationalId)
      if (!filterByTypeIds || filterByTypeIds.length === 0) {
        return []
      }
    }

    const results = await this.applicationModel.findAll({
      attributes: ['typeId'],
      ...(filterByTypeIds && {
        where: {
          typeId: {
            [Op.in]: filterByTypeIds,
          },
        },
      }),
      group: ['typeId'],
      raw: true,
    })
    return results.map((row) => ({ id: row.typeId }))
  }

  async findAllByNationalIdAndFilters(
    nationalId: string,
    typeId?: string,
    status?: string,
    showPruned?: boolean,
  ): Promise<Application[]> {
    const typeIds = typeId?.split(',')
    const statuses = status?.split(',')

    const applicantAccessConditions: WhereOptions = {
      [Op.or]: [
        { applicant: { [Op.eq]: nationalId } },
        { assignees: { [Op.contains]: [nationalId] } },
      ],
    }

    return this.applicationModel.findAll({
      where: {
        ...(typeIds ? { typeId: { [Op.in]: typeIds } } : {}),
        ...(statuses ? { status: { [Op.in]: statuses } } : {}),
        [Op.and]: [
          applicantAccessConditions,
          showPruned ? {} : applicationIsNotSetToBePruned(),
        ],
        isListed: {
          [Op.eq]: true,
        },
      },
      order: [['modified', 'DESC']],
    })
  }

  async getAllInstitutionsSuperAdmin(): Promise<
    { nationalId: string; contentfulSlug: string }[]
  > {
    const allInstitutions = getInstitutionsWithApplicationTypesIds()

    if (!allInstitutions) return []

    const allTypeIds = Array.from(
      new Set(
        allInstitutions.flatMap(
          (institution) => institution.applicationTypesIds,
        ),
      ),
    )

    if (!allTypeIds.length) return []

    const existingTypeIds = await this.applicationModel.findAll({
      where: {
        typeId: {
          [Op.in]: allTypeIds,
        },
      },
      attributes: ['typeId'],
      group: ['typeId'],
      raw: true,
    })

    const existingTypeIdSet = new Set<string>(
      existingTypeIds.map((row) => row.typeId),
    )

    return allInstitutions
      .filter((inst) =>
        inst.applicationTypesIds.some((t) => existingTypeIdSet.has(t)),
      )
      .map((x) => ({ nationalId: x.nationalId, contentfulSlug: x.slug }))
  }

  async findAllDueToBePruned(): Promise<Application[]> {
    return this.applicationModel.findAll({
      attributes: [
        'id',
        'attachments',
        'typeId',
        'state',
        'applicant',
        'applicantActors',
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

  async findAllDueToBePostPruned(): Promise<Application[]> {
    return this.applicationModel.findAll({
      attributes: ['id'],
      where: {
        [Op.and]: {
          postPruneAt: {
            [Op.and]: {
              [Op.not]: null,
              [Op.lt]: new Date(),
            },
          },
          postPruned: {
            [Op.eq]: false,
          },
          pruned: {
            [Op.eq]: true,
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
        | 'postPruned'
        | 'postPruneAt'
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

  async softDelete(id: string) {
    return this.applicationModel.update(
      {
        isListed: false,
        userDeleted: true,
        userDeletedAt: new Date(),
        externalData: {},
        answers: {},
        attachments: {},
      },
      { where: { id } },
    )
  }
}
