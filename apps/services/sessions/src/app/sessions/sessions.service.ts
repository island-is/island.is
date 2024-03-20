import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import ip3country from 'ip3country'
import addDays from 'date-fns/addDays'
import { Op, WhereOptions } from 'sequelize'
import uaParser from 'ua-parser-js'

import { User } from '@island.is/auth-nest-tools'
import { paginate } from '@island.is/nest/pagination'

import { CreateSessionDto } from './create-session.dto'
import { Session } from './session.model'
import { SessionsQueryDto } from './sessions-query.dto'
import { SessionsResultDto } from './sessions-result.dto'
import { USER_AGENT_MAX_LENGTH } from './constants'

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(
    user: User,
    query: SessionsQueryDto,
    otherUser?: string,
  ): Promise<SessionsResultDto> {
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
    const { id, sessionId, userAgent, ...rest } = session

    // Todo: Remove this when we have migrated IDS to use sessionId
    const sid = sessionId || id

    if (!sid) {
      throw new Error('Missing sessionId.')
    }

    return this.sessionModel.create({
      ...rest,
      userAgent: userAgent.substring(0, USER_AGENT_MAX_LENGTH),
      sessionId: sid,
      device: this.formatUserAgent(userAgent),
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

  private formatIp = (ip: string): string | undefined => {
    return ip3country.lookupStr(ip) ?? undefined
  }
}
