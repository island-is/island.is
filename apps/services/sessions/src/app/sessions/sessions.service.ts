import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import addDays from 'date-fns/addDays'
import { lookup } from 'geoip-lite'
import { Op } from 'sequelize'
import type { WhereOptions } from 'sequelize'

import uaParser from 'ua-parser-js'

import type { User } from '@island.is/auth-nest-tools'
import { paginate } from '@island.is/nest/pagination'

import type { CreateSessionDto } from './create-session.dto'
import { Session } from './session.model'
import type { SessionsQueryDto } from './sessions-query.dto'
import type { SessionsResultDto } from './sessions-result.dto'

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name)

  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(
    user: User,
    query: SessionsQueryDto,
    otherUser?: string,
  ): Promise<SessionsResultDto> {
    this.logger.log('This is a log message')
    this.logger.error('This is an error message')
    this.logger.warn('This is a warning message')
    this.logger.debug('This is a debug message')
    this.logger.verbose('This is a verbose log message')
    let whereOptions: WhereOptions

    if (user.actor) {
      // Finding sessions on behalf of a company
      whereOptions = {
        subjectNationalId: user.nationalId,
        // With otherUser as a specific actor
        ...(otherUser && { actorNationalId: otherUser }),
      }
    } else {
      // Finding sessions for a user
      whereOptions = {
        [Op.or]: [
          {
            actorNationalId: user.nationalId,
            ...(otherUser && { subjectNationalId: otherUser }),
          },
          {
            subjectNationalId: user.nationalId,
            ...(otherUser && { actorNationalId: otherUser }),
          },
        ],
      }
    }

    whereOptions = {
      ...whereOptions,
      ...(query.to && query.from
        ? {
            [Op.and]: [
              { timestamp: { [Op.gte]: query.from } },
              {
                timestamp: {
                  [Op.lt]: addDays(new Date(query.to), 1),
                },
              },
            ],
          }
        : query.from
        ? { timestamp: { [Op.gte]: query.from } }
        : query.to
        ? {
            timestamp: {
              [Op.lte]: query.to,
            },
          }
        : {}),
    }

    return paginate({
      Model: this.sessionModel,
      limit: Math.min(query.limit || 10, 100),
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'timestamp',
      orderOption: [['timestamp', query.order ?? 'DESC']],
      where: whereOptions,
    })
  }

  create(session: CreateSessionDto): Promise<Session> {
    const { id, sessionId, ...rest } = session

    // Todo: Remove this when we have migrated IDS to use sessionId
    const sid = sessionId || id

    if (!sid) {
      throw new Error('Missing sessionId.')
    }

    return this.sessionModel.create({
      ...rest,
      sessionId: sid,
      device: this.formatUserAgent(session.userAgent),
      ipLocation: this.formatIp(session.ip),
    })
  }

  private formatUserAgent(userAgent: string): string | undefined {
    const ua = uaParser(userAgent)
    const browser = ua.browser.name || ''
    const os = ua.os.name || ''

    return browser || os
      ? `${browser}${browser && os ? ` (${os})` : os}`
      : undefined
  }

  private formatIp(ip: string): string | undefined {
    const geoLocation = lookup(ip)
    return geoLocation?.country ?? undefined
  }
}
