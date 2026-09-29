import {
  col,
  fn,
  Includeable,
  literal,
  Op,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { HashAlgorithm, ServiceStatus } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CourtSession } from '../models/courtSession.model'
import { Defendant } from '../models/defendant.model'
import { Institution } from '../models/institution.model'
import { Subpoena } from '../models/subpoena.model'
import { User } from '../models/user.model'

// The graph a subpoena is read with wherever it is rendered on its own: the
// case it belongs to, the people and institutions handling that case, and the
// defendant it summons.
const subpoenaInclude: Includeable[] = [
  {
    model: Case,
    as: 'case',
    include: [
      { model: User, as: 'judge' },
      { model: User, as: 'registrar' },
      { model: Institution, as: 'prosecutorsOffice' },
      { model: Institution, as: 'court' },
      { model: CourtSession, as: 'courtSessions' },
    ],
  },
  { model: Defendant, as: 'defendant' },
]

interface FindSubpoenaOptions {
  transaction?: Transaction
}

interface CreateSubpoenaOptions {
  transaction: Transaction
}

interface UpdateSubpoenaOptions {
  transaction: Transaction
  throwOnZeroRows?: boolean
}

interface UpdateSubpoena {
  hash?: string
  hashAlgorithm?: HashAlgorithm
  serviceStatus?: ServiceStatus
  serviceDate?: Date
  servedBy?: string
  comment?: string
  defenderNationalId?: string
  policeSubpoenaId?: string
}

// The subpoena statistics only ever cover subpoenas that have been registered
// with the police - a subpoena without a police subpoena id was never sent and
// has no service history to report on. The period and the institution narrow
// that population; the repository owns the translation into a query.
export type SubpoenaStatisticsFilter = {
  from?: Date
  to?: Date
  institutionId?: string
}

// One row of countPoliceSubpoenasByServiceStatus. averageServiceTimeMs is null
// when no subpoena in the group has been served yet.
export type ServiceStatusCount = {
  serviceStatus: ServiceStatus | null
  count: number
  averageServiceTimeMs: number | null
}

@Injectable()
export class SubpoenaRepositoryService {
  constructor(
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private policeSubpoenaQuery(filter: SubpoenaStatisticsFilter): {
    where: WhereOptions
    include: Includeable[]
  } {
    const where: WhereOptions = {
      policeSubpoenaId: { [Op.ne]: null },
      ...(filter.from || filter.to
        ? {
            created: {
              ...(filter.from ? { [Op.gte]: filter.from } : {}),
              ...(filter.to ? { [Op.lte]: filter.to } : {}),
            },
          }
        : {}),
    }

    // The case is joined only to filter on the institution handling it, so it
    // is required and contributes no attributes of its own.
    const include: Includeable[] = filter.institutionId
      ? [
          {
            model: Case,
            required: true,
            attributes: [],
            where: {
              [Op.or]: [
                { courtId: filter.institutionId },
                { prosecutorsOfficeId: filter.institutionId },
              ],
            },
          },
        ]
      : []

    return { where, include }
  }

  async findById(
    subpoenaId: string,
    options?: FindSubpoenaOptions,
  ): Promise<Subpoena | null> {
    try {
      this.logger.debug(`Finding subpoena ${subpoenaId}`)

      return await this.subpoenaModel.findOne({
        include: subpoenaInclude,
        where: { id: subpoenaId },
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(`Error finding subpoena ${subpoenaId}:`, { error })

      throw error
    }
  }

  // policeSubpoenaId is the subpoena's id in the police systems, handed back to
  // us when the subpoena is registered with them.
  async findByPoliceSubpoenaId(
    policeSubpoenaId: string,
  ): Promise<Subpoena | null> {
    try {
      this.logger.debug(
        `Finding subpoena with police subpoena id ${policeSubpoenaId}`,
      )

      return await this.subpoenaModel.findOne({
        include: subpoenaInclude,
        where: { policeSubpoenaId },
      })
    } catch (error) {
      this.logger.error(
        `Error finding subpoena with police subpoena id ${policeSubpoenaId}:`,
        { error },
      )

      throw error
    }
  }

  // The earliest date the subpoena statistics have anything to say about. It
  // deliberately takes no period - it is what bounds the period the caller may
  // ask for. Returns null when no subpoena has reached the police.
  async findEarliestPoliceSubpoenaCreatedDate(): Promise<Date | null> {
    try {
      this.logger.debug('Finding the earliest police subpoena creation date')

      const earliest = await this.subpoenaModel.findOne({
        where: { policeSubpoenaId: { [Op.ne]: null } },
        order: [['created', 'ASC']],
        attributes: ['created'],
      })

      return earliest?.created ?? null
    } catch (error) {
      this.logger.error(
        'Error finding the earliest police subpoena creation date:',
        { error },
      )

      throw error
    }
  }

  async countPoliceSubpoenas(
    filter: SubpoenaStatisticsFilter,
  ): Promise<number> {
    try {
      this.logger.debug('Counting police subpoenas')

      const { where, include } = this.policeSubpoenaQuery(filter)

      // distinct, so that a join never counts a subpoena twice
      return await this.subpoenaModel.count({ where, include, distinct: true })
    } catch (error) {
      this.logger.error('Error counting police subpoenas:', { error })

      throw error
    }
  }

  // Counts the police subpoenas by the status of their service and averages how
  // long the service took. The average comes back from the database in
  // milliseconds; what the statistics make of it is the caller's business.
  async countPoliceSubpoenasByServiceStatus(
    filter: SubpoenaStatisticsFilter,
  ): Promise<ServiceStatusCount[]> {
    try {
      this.logger.debug('Counting police subpoenas by service status')

      const { where, include } = this.policeSubpoenaQuery(filter)

      const rows = (await this.subpoenaModel.findAll({
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

      this.logger.debug(`Counted ${rows.length} service status group(s)`)

      return rows.map((row) => ({
        serviceStatus: row.serviceStatus,
        count: Number(row.count),
        averageServiceTimeMs:
          row.averageServiceTimeMs === null ||
          row.averageServiceTimeMs === undefined
            ? null
            : Number(row.averageServiceTimeMs),
      }))
    } catch (error) {
      this.logger.error('Error counting police subpoenas by service status:', {
        error,
      })

      throw error
    }
  }

  async create(
    data: Partial<Subpoena>,
    options: CreateSubpoenaOptions,
  ): Promise<Subpoena> {
    try {
      this.logger.debug('Creating a new subpoena with data:', {
        data: Object.keys(data),
      })

      const result = await this.subpoenaModel.create(data, options)

      this.logger.debug(`Created a new subpoena ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating a new subpoena with data:', {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    defendantId: string,
    subpoenaId: string,
    data: UpdateSubpoena,
    options: UpdateSubpoenaOptions,
  ): Promise<Subpoena> {
    const throwOnZeroRows = options?.throwOnZeroRows ?? true

    try {
      this.logger.debug(
        `Updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: subpoenaId, caseId, defendantId },
        transaction: options.transaction,
      }

      const [numberOfAffectedRows, updatedSubpoenas] =
        await this.subpoenaModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        if (throwOnZeroRows) {
          throw new InternalServerErrorException(
            `Could not update subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
          )
        }

        this.logger.error(
          `No rows affected when updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
      )

      return updatedSubpoenas[0]
    } catch (error) {
      this.logger.error(
        `Error updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  // Moves every subpoena of a defendant to another case, when the defendant is
  // split off into a case of their own. Returns the number of subpoenas moved.
  async moveAllForDefendantToCase(
    caseId: string,
    defendantId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Moving the subpoenas of defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
      )

      const [numberOfAffectedRows] = await this.subpoenaModel.update(
        { caseId: newCaseId },
        { where: { caseId, defendantId }, transaction: options.transaction },
      )

      this.logger.debug(
        `Moved ${numberOfAffectedRows} subpoenas of defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
      )

      return numberOfAffectedRows
    } catch (error) {
      this.logger.error(
        `Error moving the subpoenas of defendant ${defendantId} from case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
