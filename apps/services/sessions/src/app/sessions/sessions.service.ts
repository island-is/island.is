import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as kennitala from 'kennitala'
import { Op, WhereOptions } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { PageInfo, paginate } from '@island.is/nest/pagination'

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
    if (user.actor && !kennitala.isCompany(user.nationalId)) {
      throw new ForbiddenException(
        'Personal delegations are not allowed to get session data.',
      )
    }

    let whereOptions: WhereOptions

    if (user.actor) {
      if (otherUser) {
        whereOptions = {
          actorNationalId: otherUser,
          subjectNationalId: user.nationalId,
        }
      } else {
        whereOptions = {
          subjectNationalId: user.nationalId,
        }
      }
    } else {
      if (otherUser) {
        whereOptions = {
          [Op.or]: [
            {
              actorNationalId: user.nationalId,
              subjectNationalId: otherUser,
            },
            { actorNationalId: otherUser, subjectNationalId: user.nationalId },
          ],
        }
      } else {
        whereOptions = {
          [Op.or]: [
            {
              actorNationalId: user.nationalId,
            },
            { subjectNationalId: user.nationalId },
          ],
        }
      }
    }

    return paginate({
      Model: this.sessionModel,
      limit: query.limit || 10,
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
