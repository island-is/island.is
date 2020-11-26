import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'

import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export enum AuditedAction {
  OVERVIEW = 'OVERVIEW',
  VIEW_DETAILS = 'VIEW_DETAILS',
}

export interface AuditTrailOptions {
  useGenericLogger: boolean // should be false in production environments
  groupName?: string
  streamName?: string
  region?: string
}

@Injectable()
export class AuditTrailService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private trail?: Logger

  initTrail(options: AuditTrailOptions) {
    if (options.useGenericLogger) {
      this.logger.info('Using generic logger for audit trail')
      this.trail = this.logger
    } else {
      this.logger.info(
        `Creating a dedicated logger for audit trail ${options.groupName}<<<${options.streamName}`,
      )
      this.trail = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            logGroupName: options.groupName,
            logStreamName: options.streamName,
            awsRegion: options.region,
          }),
        ],
      })
    }
  }

  audit(userId: string, action: AuditedAction, caseIds: string | string[]) {
    if (!this.trail) {
      throw new ReferenceError('Audit trail has not been initialized')
    }

    this.trail?.info('Audit', {
      user: userId,
      action,
      cases: caseIds,
    })
  }
}
