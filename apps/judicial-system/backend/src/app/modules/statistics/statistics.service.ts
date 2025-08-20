import isWithinInterval from 'date-fns/isWithinInterval'
import { col, fn, Includeable, literal, Op, WhereOptions } from 'sequelize'

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import {
  CaseState,
  CaseType,
  EventType,
  isCompletedCase,
  isIndictmentCase,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import { Case } from '../case'
import { EventLog } from '../event-log'
import { Subpoena } from '../subpoena'
import {
  CaseStatistics,
  IndictmentCaseStatistics,
  RequestCaseStatistics,
} from './models/caseStatistics.response'
import {
  ServiceStatusStatistics,
  SubpoenaStatistics,
} from './models/subpoenaStatistics.response'
import { DateFilter } from './statistics/types'

export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  const pass: T[] = []
  const fail: T[] = []

  for (const item of array) {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  }

  return [pass, fail]
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
  ) {}

  async getIndictmentCaseStatistics(
    sentToCourt?: DateFilter,
    institutionId?: string,
  ): Promise<IndictmentCaseStatistics> {
    let where: WhereOptions = {
      state: {
        [Op.not]: [
          CaseState.DELETED,
          CaseState.DRAFT,
          CaseState.NEW,
          CaseState.WAITING_FOR_CONFIRMATION,
        ],
      },
      type: [CaseType.INDICTMENT],
    }

    // fetch only the earliest indictment with the base filter
    const earliestCase = await this.caseModel.findOne({
      where,
      order: [['created', 'ASC']],
      attributes: ['created'],
    })

    // apply dto filters
    if (institutionId) {
      where = {
        ...where,
        [Op.or]: [
          { courtId: institutionId },
          { prosecutorsOfficeId: institutionId },
        ],
      }
    }

    const cases = await this.caseModel.findAll({
      where,
      include: [
        {
          model: EventLog,
          required: false,
          attributes: ['created', 'eventType'],
          where: {
            eventType: EventType.INDICTMENT_CONFIRMED,
          },
        },
      ],
    })

    const filterOnSentToCourt = () => {
      if (sentToCourt) {
        if (!cases.length) {
          return undefined
        }

        const start = sentToCourt.fromDate ?? cases[0]?.created
        const end = sentToCourt.toDate ?? new Date()

        return cases.filter(({ eventLogs }) =>
          eventLogs?.some(
            ({ created, eventType }) =>
              eventType === EventType.INDICTMENT_CONFIRMED &&
              isWithinInterval(new Date(created), {
                start: new Date(start),
                end: new Date(end),
              }),
          ),
        )
      }
    }
    const filteredCases = filterOnSentToCourt() ?? cases
    const indictmentCaseStatistics = this.getIndictmentStatistics(filteredCases)
    return {
      ...indictmentCaseStatistics,
      minDate: earliestCase?.created ?? new Date(),
    }
  }

  async getSubpoenaStatistics(
    from?: Date,
    to?: Date,
    institutionId?: string,
  ): Promise<SubpoenaStatistics> {
    const where: WhereOptions = {
      policeSubpoenaId: {
        [Op.ne]: null,
      },
    }

    // fetch only the earliest subpoena with the base filter
    const earliestCase = await this.subpoenaModel.findOne({
      where,
      order: [['created', 'ASC']],
      attributes: ['created'],
    })

    if (from || to) {
      where.created = {}
      if (from) {
        where.created[Op.gte] = from
      }
      if (to) {
        where.created[Op.lte] = to
      }
    }

    const include: Includeable[] = []

    if (institutionId) {
      include.push({
        model: Case,
        required: true,
        attributes: [],
        where: {
          [Op.or]: [
            { courtId: institutionId },
            { prosecutorsOfficeId: institutionId },
          ],
        },
      })
    }

    const subpoenas = await this.subpoenaModel.findAll({
      where,
      include,
    })

    const grouped = (await this.subpoenaModel.findAll({
      where,
      include,
      attributes: [
        'serviceStatus',
        [fn('COUNT', col('Subpoena.id')), 'count'],
        [
          literal(
            'AVG(EXTRACT(EPOCH FROM "Subpoena"."service_date" - "Subpoena"."created") * 1000)',
          ),
          'averageServiceTimeMs',
        ],
      ],
      group: ['serviceStatus'],
      raw: true,
    })) as unknown as {
      serviceStatus: ServiceStatus | null
      count: string
      averageServiceTimeMs: string | null
    }[]

    const serviceStatusStatistics: ServiceStatusStatistics[] = grouped.map(
      (row) => ({
        serviceStatus: row.serviceStatus,
        count: Number(row.count),
        averageServiceTimeMs: Math.round(Number(row.averageServiceTimeMs) || 0),
        averageServiceTimeDays:
          Math.round(Number(row.averageServiceTimeMs) / 1000 / 60 / 60 / 24) ||
          0,
      }),
    )

    const stats: SubpoenaStatistics = {
      count: subpoenas.length,
      serviceStatusStatistics,
      minDate: earliestCase?.created ?? new Date(),
    }

    return stats
  }

  async getRequestCasesStatistics(
    created?: DateFilter,
    sentToCourt?: DateFilter,
    institutionId?: string,
  ): Promise<RequestCaseStatistics> {
    let where: WhereOptions = {
      state: {
        [Op.not]: [
          CaseState.DELETED,
          CaseState.DRAFT,
          CaseState.NEW,
          CaseState.WAITING_FOR_CONFIRMATION,
        ],
      },
      type: {
        [Op.not]: [CaseType.INDICTMENT],
      },
    }

    // fetch only the earliest case with the base filter
    const earliestCase = await this.caseModel.findOne({
      where,
      order: [['created', 'ASC']],
      attributes: ['created'],
    })

    // apply dto filters
    if (created?.fromDate || created?.toDate) {
      const { fromDate, toDate } = created
      where.created = {}
      if (fromDate) {
        where.created[Op.gte] = fromDate
      }
      if (toDate) {
        where.created[Op.lte] = toDate
      }
    }

    if (institutionId) {
      where = {
        ...where,
        [Op.or]: [
          { courtId: institutionId },
          { prosecutorsOfficeId: institutionId },
        ],
      }
    }

    const cases = await this.caseModel.findAll({
      where,
      include: [
        {
          model: EventLog,
          required: false,
          attributes: ['created', 'eventType'],
          where: {
            eventType: EventType.CASE_SENT_TO_COURT,
          },
        },
      ],
    })

    const filterOnSentToCourt = () => {
      if (sentToCourt) {
        const sortedCase = cases.sort(
          (a, b) => a.created.getTime() - b.created.getTime(),
        )
        if (!sortedCase.length) {
          return undefined
        }

        const start = sentToCourt.fromDate ?? sortedCase[0]?.created
        const end = sentToCourt.toDate ?? new Date()

        return cases.filter(({ eventLogs }) =>
          eventLogs?.some(
            ({ created, eventType }) =>
              eventType === EventType.CASE_SENT_TO_COURT &&
              isWithinInterval(new Date(created), {
                start: new Date(start),
                end: new Date(end),
              }),
          ),
        )
      }
    }
    const filteredCases = filterOnSentToCourt() ?? cases
    const requestCaseStatistics = this.getRequestCaseStatistics(filteredCases)

    return {
      ...requestCaseStatistics,
      minDate: earliestCase?.created ?? new Date(),
    }
  }

  async getCaseStatistics(
    from?: Date,
    to?: Date,
    institutionId?: string,
  ): Promise<CaseStatistics> {
    let where: WhereOptions = {
      state: {
        [Op.not]: [
          CaseState.DELETED,
          CaseState.DRAFT,
          CaseState.NEW,
          CaseState.WAITING_FOR_CONFIRMATION,
        ],
      },
    }

    if (from || to) {
      where.created = {}
      if (from) {
        where.created[Op.gte] = from
      }
      if (to) {
        where.created[Op.lte] = to
      }
    }

    if (institutionId) {
      where = {
        ...where,
        [Op.or]: [
          { courtId: institutionId },
          { prosecutorsOfficeId: institutionId },
        ],
      }
    }

    const cases = await this.caseModel.findAll({
      where,
      include: [
        {
          model: EventLog,
          required: false,
          attributes: ['created', 'eventType'],
          where: {
            eventType: EventType.INDICTMENT_CONFIRMED,
          },
        },
      ],
    })

    const [indictments, requests] = partition(cases, (c) =>
      isIndictmentCase(c.type),
    )

    const requestCases = this.getRequestCaseStatistics(requests)
    const indictmentCases = this.getIndictmentStatistics(indictments)
    const subpoenas = await this.getSubpoenaStatistics(from, to, institutionId)

    const stats: CaseStatistics = {
      count: cases.length,
      requestCases: { ...requestCases, minDate: new Date() },
      indictmentCases: { ...indictmentCases, minDate: new Date() },
      subpoenas,
    }

    return stats
  }

  getIndictmentStatistics(
    cases: Case[],
  ): Omit<IndictmentCaseStatistics, 'minDate'> {
    const inProgressCount = cases.filter(
      (caseItem) => caseItem.state !== CaseState.COMPLETED,
    ).length

    const rulingCount = cases.filter(
      (caseItem) => caseItem.rulingDate !== null,
    ).length

    const totalCount = cases.length

    const caseDurations = cases
      .map((caseItem) => {
        const confirmedDate = EventLog.getEventLogDateByEventType(
          EventType.INDICTMENT_CONFIRMED,
          caseItem.eventLogs,
        )
        if (!confirmedDate || !caseItem.rulingDate) return null

        const diff = caseItem.rulingDate.getTime() - confirmedDate.getTime()
        return diff > 0 ? diff : null
      })
      .filter((ms): ms is number => ms !== null)

    const averageRulingTimeMs = caseDurations.length
      ? Math.round(
          caseDurations.reduce((sum, ms) => sum + ms, 0) / caseDurations.length,
        )
      : 0

    return {
      count: totalCount,
      inProgressCount,
      rulingCount,
      averageRulingTimeMs,
      averageRulingTimeDays: Math.round(
        averageRulingTimeMs / (1000 * 60 * 60 * 24),
      ),
    }
  }

  getRequestCaseStatistics(
    cases: Case[],
  ): Omit<RequestCaseStatistics, 'minDate'> {
    const inProgressCount = cases.filter(
      (c) => !isCompletedCase(c.state),
    ).length

    const completedCount = cases.filter((c) => isCompletedCase(c.state)).length

    return {
      count: cases.length,
      inProgressCount,
      completedCount,
    }
  }
}
