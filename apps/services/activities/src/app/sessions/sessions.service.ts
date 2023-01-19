import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'

import { Session } from './session.model'

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(user: User): Promise<Session[]> {
    return this.sessionModel.findAll()
  }
}
