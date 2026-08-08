import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, WhereOptions } from 'sequelize'

import { SessionFilter } from './dto/session-filter.dto'
import { SessionRemoveOptions } from './dto/session-remove-options.dto'
import { SessionDto } from './dto/session.dto'
import { Session } from './models/session.model'

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findMany(filter: SessionFilter): Promise<SessionDto[]> {
    if (!this.validate(filter)) {
      throw new BadRequestException('Session filter is invalid')
    }

    const result = await this.sessionModel.findAll({
      where: this.getWhereOptions(filter),
      useMaster: true,
    })

    return result.map((session) => session.toDto())
  }

  async findOne(key: string): Promise<SessionDto | null> {
    const result = await this.sessionModel.findByPk(key, { useMaster: true })

    return result ? result.toDto() : null
  }

  async create(session: SessionDto): Promise<SessionDto | null> {
    const result = await this.sessionModel.create({
      ...session,
      data: session.ticket,
    })

    return result ? result.toDto() : null
  }

  async update(session: SessionDto): Promise<SessionDto | null> {
    const existing = await this.sessionModel.findByPk(session.key, {
      useMaster: true,
    })
    if (!existing) {
      return null
    }

    const result = await existing.update({ ...session, data: session.ticket })

    return result ? result.toDto() : null
  }

  async delete(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException('Key must be provided')
    }

    await this.sessionModel.destroy({
      where: {
        key: key,
      },
    })
  }

  async deleteMany(filter: SessionFilter): Promise<void> {
    if (!this.validate(filter)) {
      throw new BadRequestException('Session filter is invalid')
    }

    await this.sessionModel.destroy({
      where: this.getWhereOptions(filter),
    })
  }

  async getAndRemoveExpired(
    options: SessionRemoveOptions,
  ): Promise<SessionDto[]> {
    const result = await this.sessionModel.findAll({
      where: { expires: { [Op.lt]: new Date() } },
      limit: options.count,
    })

    await this.sessionModel.destroy({
      where: { key: result.map((session) => session.key) },
    })

    return result.map((session) => session.toDto())
  }

  private validate(filter: SessionFilter): boolean {
    return !!filter.subjectId || !!filter.sessionId || !!filter.actorSubjectId
  }

  private getWhereOptions(filter: SessionFilter): WhereOptions {
    let whereOptions: WhereOptions = {}

    if (filter.subjectId) {
      whereOptions = { ...whereOptions, subjectId: filter.subjectId }
    }

    if (filter.sessionId) {
      whereOptions = { ...whereOptions, sessionId: filter.sessionId }
    }

    if (filter.actorSubjectId) {
      whereOptions = { ...whereOptions, actorSubjectId: filter.actorSubjectId }
    }

    return whereOptions
  }
}
