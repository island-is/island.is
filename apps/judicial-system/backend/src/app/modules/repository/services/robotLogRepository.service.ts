import { Op } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { RobotLog } from '../models/robotLog.model'

// The robot log type is a plain string in the database. The enum of valid types is a
// court domain concept and deliberately stays out of the repository.
export type CreateRobotLog = {
  type: string
  caseId: string
  elementId?: string
}

@Injectable()
export class RobotLogRepositoryService {
  constructor(
    @InjectModel(RobotLog) private readonly robotLogModel: typeof RobotLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async existsForCaseTypeAndElements(
    caseId: string,
    type: string,
    elementIds: string[],
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Checking for a ${type} robot log for case ${caseId} with one of ${elementIds.length} element id(s)`,
      )

      const robotLog = await this.robotLogModel.findOne({
        where: { caseId, type, elementId: { [Op.in]: elementIds } },
      })

      return Boolean(robotLog)
    } catch (error) {
      this.logger.error(
        `Error checking for a ${type} robot log for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    robotLog: CreateRobotLog,
  ): Promise<{ id: string; seqNumber: number }> {
    const { type, caseId, elementId } = robotLog

    try {
      this.logger.debug(`Creating a ${type} robot log for case ${caseId}`)

      const createdRobotLog = await this.robotLogModel.create({
        type,
        caseId,
        elementId,
      })

      return {
        id: createdRobotLog.id,
        seqNumber: createdRobotLog.seqNumber,
      }
    } catch (error) {
      this.logger.error(
        `Error creating a ${type} robot log for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async markDelivered(robotLogId: string): Promise<void> {
    try {
      this.logger.debug(`Marking robot log ${robotLogId} as delivered`)

      await this.robotLogModel.update(
        { delivered: true },
        { where: { id: robotLogId } },
      )
    } catch (error) {
      this.logger.error(`Error marking robot log ${robotLogId} as delivered:`, {
        error,
      })

      throw error
    }
  }
}
