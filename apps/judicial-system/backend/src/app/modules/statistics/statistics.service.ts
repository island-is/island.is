import stringify from 'csv-stringify'
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import isWithinInterval from 'date-fns/isWithinInterval'
import { col, fn, Includeable, literal, Op, WhereOptions } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseNotificationType,
  CaseState,
  CaseType,
  DataGroups,
  dateTypes,
  defendantEventTypes,
  EventType,
  InstitutionType,
  isCompletedCase,
  isIndictmentCase,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../aws-s3'
import {
  Case,
  CaseRepositoryService,
  DateLog,
  Defendant,
  DefendantEventLog,
  EventLog,
  IndictmentCount,
  Institution,
  Notification,
  Offense,
  Subpoena,
  SubpoenaRepositoryService,
  Verdict,
} from '../repository'
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
import {
  IndictmentCaseEvent,
  indictmentCaseEventFunctions,
} from './indictmentCaseEvents'
import {
  RequestCaseEvent,
  requestCaseEventFunctions,
} from './requestCaseEvents'
interface Column {
  key: string
  header: string
}

type CsvExportObject<T extends RequestCaseEvent | IndictmentCaseEvent> = {
  data: T[]
  columns: Column[]
  key: string
}

const isDateInPeriod = (
  date: Date,
  period: { fromDate: Date; toDate: Date },
) => {
  const isBeforeOrEqual = (date: Date | number, dateToCompare: Date | number) =>
    isBefore(date, dateToCompare) || isEqual(date, dateToCompare)

  const isAfterOrEqual = (date: Date | number, dateToCompare: Date | number) =>
    isAfter(date, dateToCompare) || isEqual(date, dateToCompare)

  return (
    isAfterOrEqual(date, period.fromDate) &&
    isBeforeOrEqual(date, period.toDate)
  )
}

const isValidEvent = (
  event: RequestCaseEvent | IndictmentCaseEvent | undefined,
  fromDate: Date,
  toDate: Date,
): event is RequestCaseEvent | IndictmentCaseEvent =>
  !!event && isDateInPeriod(new Date(event.date), { fromDate, toDate })

const getDateString = (date?: Date) =>
  format(date ? new Date(date) : new Date(), 'yyyy-MM-dd')

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
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
    private readonly subpoenaRepositoryService: SubpoenaRepositoryService,
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
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
    const earliestCase = await this.caseRepositoryService.findOne({
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

    const cases = await this.caseRepositoryService.findAll({
      where,
      order: [['created', 'ASC']],
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
    const earliestCase = await this.subpoenaRepositoryService.findOne({
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

    const subpoenas = await this.subpoenaRepositoryService.findAll({
      where,
      include,
    })

    const grouped = (await this.subpoenaRepositoryService.findAll({
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
    const earliestCase = await this.caseRepositoryService.findOne({
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

    const cases = await this.caseRepositoryService.findAll({
      where,
      order: [['created', 'ASC']],
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
        if (!cases.length) {
          return undefined
        }

        const start = sentToCourt.fromDate ?? cases[0]?.created
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

    const cases = await this.caseRepositoryService.findAll({
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
      (caseItem) => !isCompletedCase(caseItem.state),
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

  private async extractAndTransformRequestCases(period?: DateFilter) {
    const where: WhereOptions = {
      type: {
        [Op.not]: [CaseType.INDICTMENT],
      },
    }

    const cases = await this.caseRepositoryService.findAll({
      where,
      order: [['created', 'ASC']],
      include: [
        {
          model: EventLog,
          required: false,
          attributes: ['created', 'eventType'],
        },
        { model: Institution, as: 'prosecutorsOffice' },
        { model: Institution, as: 'court' },
        {
          model: DateLog,
          as: 'dateLogs',
          required: false,
          where: { dateType: dateTypes },
          order: [['created', 'DESC']],
          separate: true,
        },
        {
          model: Notification,
          as: 'notifications',
          required: false,
          where: { type: CaseNotificationType.APPEAL_COMPLETED },
          order: [['created', 'DESC']],
          separate: true,
        },
      ],
    })

    // create events for data analytics for each case
    if (!period) return []

    const fromDate = new Date(period.fromDate ?? cases[0]?.created ?? 0)
    const toDate = new Date(period.toDate ?? Date.now())
    const events = cases
      .flatMap((c) => requestCaseEventFunctions.flatMap((func) => func(c)))
      .filter((event) => isValidEvent(event, fromDate, toDate))

    return events
  }

  private async extractAndTransformIndictmentCases(period?: DateFilter) {
    const where: WhereOptions = {
      type: CaseType.INDICTMENT,
    }

    const cases = await this.caseRepositoryService.findAll({
      where,
      order: [['created', 'ASC']],
      include: [
        {
          model: EventLog,
          required: false,
          attributes: ['created', 'eventType'],
        },
        {
          model: IndictmentCount,
          as: 'indictmentCounts',
          required: false,
          order: [['created', 'ASC']],
          include: [
            {
              model: Offense,
              as: 'offenses',
              required: false,
              order: [['created', 'ASC']],
              separate: true,
            },
          ],
          separate: true,
        },
        { model: Institution, as: 'prosecutorsOffice' },
        { model: Institution, as: 'court' },
        {
          model: DateLog,
          as: 'dateLogs',
          required: false,
          where: { dateType: dateTypes },
          order: [['created', 'DESC']],
          separate: true,
        },
        {
          model: Defendant,
          as: 'defendants',
          required: false,
          order: [['created', 'ASC']],
          include: [
            {
              model: Subpoena,
              as: 'subpoenas',
              required: false,
              order: [['created', 'DESC']],
              separate: true,
            },
            {
              model: DefendantEventLog,
              as: 'eventLogs',
              required: false,
              where: { eventType: defendantEventTypes },
              separate: true,
            },
            {
              model: Verdict,
              as: 'verdicts',
              required: false,
              order: [['created', 'DESC']],
              separate: true,
            },
          ],
          separate: true,
        },
      ],
    })

    // get institutions that are not linked directly to a case but
    // are known to handle certain events
    const institutions = await this.institutionModel.findAll({
      where: {
        active: true,
        type: [
          InstitutionType.PRISON_ADMIN,
          InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
        ],
      },
    })

    // create events for data analytics for each case
    if (!period) return []

    const fromDate = new Date(period.fromDate ?? cases[0]?.created ?? 0)
    const toDate = new Date(period.toDate ?? Date.now())

    const events = cases.flatMap((c) => {
      return indictmentCaseEventFunctions
        .flatMap((func) => func(c, institutions))
        .filter((event) => isValidEvent(event, fromDate, toDate))
    })
    return events
  }

  private async uploadCsvDataToS3({
    data,
    columns,
    key,
  }: CsvExportObject<RequestCaseEvent | IndictmentCaseEvent>): Promise<void> {
    return new Promise((resolve, reject) => {
      stringify(data, { header: true, columns }, async (error, csvOutput) => {
        if (error) {
          this.logger.error('Failed to convert data to csv file')
          reject(error)
          return
        }

        try {
          await this.awsS3Service.uploadCsvToS3(key, csvOutput)
          resolve()
        } catch (error) {
          this.logger.error(`Failed to upload csv ${key} to AWS S3`, { error })
          reject(error)
        }
      })
    })
  }

  async extractTransformLoadEventDataToS3({
    type,
    user,
    period,
  }: {
    type: DataGroups
    user: User
    period?: DateFilter
  }): Promise<{ url: string }> {
    const getData = async () => {
      if (type === DataGroups.REQUESTS) {
        return {
          data: await this.extractAndTransformRequestCases(period),
          columns: [
            { key: 'id', header: 'Mál' },
            { key: 'eventDescriptor', header: 'Atburður' },
            { key: 'date', header: 'Dagsetning' },
            { key: 'institution', header: 'Stofnun' },
            { key: 'caseTypeDescriptor', header: 'Tegund máls' },
            { key: 'origin', header: 'Stofnað í' },
            { key: 'isExtended', header: 'Mál framlengt' },
            {
              key: 'requestDecisionDescriptor',
              header: 'Niðurstaða kröfu',
            },
            {
              key: 'courtOfAppealDecisionDescriptor',
              header: 'Niðurstaða Landsréttar',
            },
            {
              key: 'parentCaseId',
              header: 'Upprunalegt mál',
            },
          ] as Column[],
          key: `krofur_from_${getDateString(
            period?.fromDate,
          )}_to_${getDateString(period?.toDate)}_${user.nationalId}.csv`,
        }
      }
      if (type === DataGroups.INDICTMENTS) {
        return {
          data: await this.extractAndTransformIndictmentCases(period),
          columns: [
            { key: 'id', header: 'Mál' },
            { key: 'eventDescriptor', header: 'Atburður' },
            { key: 'date', header: 'Dagsetning' },
            { key: 'institution', header: 'Stofnun' },
            { key: 'caseTypeDescriptor', header: 'Tegund máls' },
            { key: 'subtypeDescriptor', header: 'Sakarefni' },
            { key: 'origin', header: 'Stofnað í' },
            { key: 'defendantId', header: 'Varnaraðili' },
            { key: 'serviceStatusDescriptor', header: 'Birting' },
            { key: 'rulingDecisionDescriptor', header: 'Lyktir' },
            {
              key: 'timeToServeSubpoena',
              header: 'Birtingartími fyrirkalls (dagar)',
            },
          ] as Column[],
          key: `akaerur_from_${getDateString(
            period?.fromDate,
          )}_to_${getDateString(period?.toDate)}_${user.nationalId}.csv`,
        }
      }

      return undefined
    }
    const result = await getData()
    if (!result) return { url: '' }

    const url = await this.uploadCsvDataToS3(result).then(
      async () =>
        await this.awsS3Service.getSignedUrl('statistics', result.key, 60 * 60),
    )

    return { url }
  }
}
