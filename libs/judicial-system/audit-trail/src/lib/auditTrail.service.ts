import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'
import { createHash } from 'crypto'

import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export enum AuditedAction {
  OVERVIEW = 'OVERVIEW',
  VIEW_DETAILS = 'VIEW_DETAILS',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  TRANSITION = 'TRANSITION',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
  CONFIRM_SIGNATURE = 'CONFIRM_SIGNATURE',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  EXTEND = 'EXTEND',
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  CREATE_CUSTODY_COURT_CASE = 'CREATE_CUSTODY_COURT_CASE',
}

export interface AuditTrailOptions {
  useGenericLogger: boolean // should be false in production environments
  groupName?: string
  serviceName?: string
  region?: string
}

@Injectable()
export class AuditTrailService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private trail?: Logger
  private useGenericLogger = true

  private formatMessage(
    userId: string,
    action: AuditedAction,
    ids: string | string[],
  ) {
    const message = {
      user: userId,
      action,
      entities: ids,
    }

    // The generic logger expects a string, whereas the CloudWatch trail expect a json object
    return this.useGenericLogger ? JSON.stringify(message) : message
  }

  initTrail(options: AuditTrailOptions) {
    this.useGenericLogger = options.useGenericLogger

    if (this.useGenericLogger) {
      this.logger.info('Using generic logger for audit trail')

      this.trail = this.logger
    } else {
      this.logger.info(
        `Creating a dedicated logger for audit trail ${options.groupName}<<<${options.serviceName}`,
      )

      // Create a log stream with a randomized (time-based) hash so that multiple
      // instances of the service don't log to the same stream.
      const startTime = new Date().toISOString()
      this.trail = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            logGroupName: options.groupName,
            logStreamName: function () {
              // Spread log streams across dates
              return `${options.serviceName}-${
                new Date().toISOString().split('T')[0]
              }-${createHash('md5').update(startTime).digest('hex')}`
            },
            awsRegion: options.region,
            jsonMessage: true,
          }),
        ],
      })
    }
  }

  audit(userId: string, action: AuditedAction, ids: string | string[]) {
    if (!this.trail) {
      throw new ReferenceError('Audit trail has not been initialized')
    }

    this.trail?.info(this.formatMessage(userId, action, ids))
  }
}
