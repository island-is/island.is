import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as kennitala from 'kennitala'
import { Op, WhereOptions } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { paginate } from '@island.is/nest/pagination'

import { Session } from './session.model'
import { SessionsQueryDto } from './sessions-query.dto'
import { SessionsResultDto } from './sessions-result.dto'

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(
    user: User,
    otherUser: string,
    query: SessionsQueryDto,
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

  create(session: Session): Promise<Session> {
    return this.sessionModel.create(session)
  }
}
