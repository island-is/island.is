import { User } from '@island.is/auth-nest-tools';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Session } from './session.model';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(user: User): Promise<Session[]> {
    return []
  }

  async create(session: Session): Promise<Session> {
    return this.sessionModel.create(session)
  }
}
