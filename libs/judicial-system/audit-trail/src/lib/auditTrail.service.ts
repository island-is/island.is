import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'
import { createHash } from 'crypto'

import { Inject, Injectable } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

export enum AuditedAction {
  LOGIN = 'LOGIN',
  GET_CASES = 'GET_CASES',
  GET_CASE = 'GET_CASE',
  CREATE_CASE = 'CREATE_CASE',
  UPDATE_CASE = 'UPDATE_CASE',
  TRANSITION_CASE = 'TRANSITION_CASE',
  REQUEST_COURT_RECORD_SIGNATURE = 'REQUEST_COURT_RECORD_SIGNATURE',
  CONFIRM_COURT_RECORD_SIGNATURE = 'CONFIRM_COURT_RECORD_SIGNATURE',
  REQUEST_RULING_SIGNATURE = 'REQUEST_RULING_SIGNATURE',
  CONFIRM_RULING_SIGNATURE = 'CONFIRM_RULING_SIGNATURE',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  EXTEND_CASE = 'EXTEND_CASE',
  GET_USERS = 'GET_USERS',
  GET_USER = 'GET_USER',
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  CREATE_COURT_CASE = 'CREATE_COURT_CASE',
  GET_REQUEST_PDF = 'GET_REQUEST_PDF',
  GET_CASE_FILES_PDF = 'GET_CASE_FILES_PDF',
  GET_RULING_PDF = 'GET_RULING_PDF',
  GET_COURT_RECORD = 'GET_COURT_RECORD',
  GET_CUSTODY_NOTICE_PDF = 'GET_CUSTODY_NOTICE_PDF',
  GET_INSTITUTIONS = 'GET_INSTITUTIONS',
  CREATE_PRESIGNED_POST = 'CREATE_PRESIGNED_POST',
  CREATE_FILE = 'CREATE_FILE',
  UPDATE_FILES = 'UPDATE_FILES',
  GET_SIGNED_URL = 'GET_SIGNED_URL',
  DELETE_FILE = 'DELETE_FILE',
  UPLOAD_FILE_TO_COURT = 'UPLOAD_FILE_TO_COURT',
  GET_POLICE_CASE_FILES = 'GET_POLICE_CASE_FILES',
  UPLOAD_POLICE_CASE_FILE = 'UPLOAD_POLICE_CASE_FILE',
  CREATE_DEFENDANT = 'CREATE_DEFENDANT',
  UPDATE_DEFENDANT = 'UPDATE_DEFENDANT',
  DELETE_DEFENDANT = 'DELETE_DEFENDANT',
  CREATE_INDICTMENT_COUNT = 'CREATE_INDICTMENT_COUNT',
  UPDATE_INDICTMENT_COUNT = 'UPDATE_INDICTMENT_COUNT',
  DELETE_INDICTMENT_COUNT = 'DELETE_INDICTMENT_COUNT',
}

export const AUDIT_TRAIL_OPTIONS = 'AUDIT_TRAIL_OPTIONS'

export interface AuditTrailOptions {
  useGenericLogger: boolean // should be false in production environments
  groupName?: string
  serviceName?: string
  region?: string
}

@Injectable()
export class AuditTrailService {
  constructor(
    @Inject(AUDIT_TRAIL_OPTIONS)
    private readonly options: AuditTrailOptions,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.initTrail()
  }

  private trail?: Logger
  private useGenericLogger = true

  private formatMessage(
    userId: string,
    action: AuditedAction,
    ids: string | string[] | undefined,
    error?: unknown,
  ) {
    const message = {
      user: userId,
      action,
      entities: ids,
      error,
    }

    // The generic logger expects a string, whereas the CloudWatch trail expect a json object
    return this.useGenericLogger ? JSON.stringify(message) : message
  }

  private initTrail() {
    this.useGenericLogger = this.options.useGenericLogger

    if (this.useGenericLogger) {
      this.logger.info('Using generic logger for audit trail')

      this.trail = this.logger
    } else {
      this.logger.info(
        `Creating a dedicated logger for audit trail ${this.options.groupName}<<<${this.options.serviceName}`,
      )

      // Create a log stream with a randomized (time-based) hash so that multiple
      // instances of the service don't log to the same stream.
      const serviceName = this.options.serviceName
      const startTime = new Date().toISOString()
      this.trail = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            name: 'CloudWatch',
            logGroupName: this.options.groupName,
            logStreamName: function () {
              // Spread log streams across dates
              return `${serviceName}-${
                new Date().toISOString().split('T')[0]
              }-${createHash('md5').update(startTime).digest('hex')}`
            },
            awsRegion: this.options.region,
            jsonMessage: true,
          }),
        ],
      })
    }
  }

  private writeToTrail(
    userId: string,
    actionType: AuditedAction,
    ids: string | string[] | undefined,
    error?: unknown,
  ) {
    if (!this.trail) {
      throw new ReferenceError('Audit trail has not been initialized')
    }

    this.trail.info(this.formatMessage(userId, actionType, ids, error))
  }

  private async auditResult<R>(
    userId: string,
    actionType: AuditedAction,
    result: R,
    auditedResult: string | ((result: R) => string | string[]),
  ): Promise<R> {
    this.writeToTrail(
      userId,
      actionType,
      typeof auditedResult === 'string' ? auditedResult : auditedResult(result),
    )

    return result
  }

  private async auditPromisedResult<R>(
    userId: string,
    actionType: AuditedAction,
    action: Promise<R>,
    auditedResult: string | ((result: R) => string | string[]),
  ): Promise<R> {
    try {
      const result = await action

      return await this.auditResult(userId, actionType, result, auditedResult)
    } catch (e) {
      this.writeToTrail(
        userId,
        actionType,
        typeof auditedResult === 'string' ? auditedResult : undefined,
        e,
      )

      throw e
    }
  }

  async audit<R>(
    userId: string,
    actionType: AuditedAction,
    action: Promise<R> | R,
    auditedResult: string | ((result: R) => string | string[]),
  ): Promise<R> {
    if (action instanceof Promise) {
      return await this.auditPromisedResult<R>(
        userId,
        actionType,
        action,
        auditedResult,
      )
    } else {
      return await this.auditResult(userId, actionType, action, auditedResult)
    }
  }
}
