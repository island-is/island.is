import { createHash } from 'crypto'
import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { auditTrailModuleConfig } from './auditTrail.config'

export enum AuditedAction {
  LOGIN = 'LOGIN',
  GET_CASES = 'GET_CASES',
  GET_CASES_STATISTICS = 'GET_CASES_STATISTICS',
  GET_CASE = 'GET_CASE',
  GET_CONNECTED_CASES = 'GET_CONNECTED_CASES',
  GET_INDICTMENTS = 'GET_INDICTMENTS',
  GET_INDICTMENT = 'GET_INDICTMENT',
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
  GET_INDICTMENT_PDF = 'GET_INDICTMENT_PDF',
  GET_SUBPOENA_PDF = 'GET_SUBPOENA_PDF',
  GET_SUBPOENA_SERVICE_CERTIFICATE_PDF = 'GET_SUBPOENA_SERVICE_CERTIFICATE_PDF',
  GET_VERDICT_SERVICE_CERTIFICATE_PDF = 'GET_VERDICT_SERVICE_CERTIFICATE_PDF',
  GET_INDICTMENT_RULING_SENT_TO_PRISON_ADMIN_PDF = 'GET_INDICTMENT_RULING_SENT_TO_PRISON_ADMIN_PDF',
  GET_ALL_FILES_ZIP = 'GET_ALL_FILES_ZIP',
  GET_INSTITUTIONS = 'GET_INSTITUTIONS',
  CREATE_PRESIGNED_POST = 'CREATE_PRESIGNED_POST',
  CREATE_FILE = 'CREATE_FILE',
  UPDATE_FILES = 'UPDATE_FILES',
  GET_SIGNED_URL = 'GET_SIGNED_URL',
  DELETE_FILE = 'DELETE_FILE',
  UPLOAD_CRIMINAL_RECORD_CASE_FILE = 'UPLOAD_CRIMINAL_RECORD_CASE_FILE',
  UPLOAD_FILE_TO_COURT = 'UPLOAD_FILE_TO_COURT',
  GET_POLICE_CASE_FILES = 'GET_POLICE_CASE_FILES',
  GET_POLICE_CASE_INFO = 'GET_POLICE_CASE_INFO',
  UPLOAD_POLICE_CASE_FILE = 'UPLOAD_POLICE_CASE_FILE',
  CREATE_DEFENDANT = 'CREATE_DEFENDANT',
  UPDATE_DEFENDANT = 'UPDATE_DEFENDANT',
  DELETE_DEFENDANT = 'DELETE_DEFENDANT',
  CREATE_INDICTMENT_COUNT = 'CREATE_INDICTMENT_COUNT',
  UPDATE_INDICTMENT_COUNT = 'UPDATE_INDICTMENT_COUNT',
  DELETE_INDICTMENT_COUNT = 'DELETE_INDICTMENT_COUNT',
  CREATE_COURT_SESSION = 'CREATE_COURT_SESSION',
  UPDATE_COURT_SESSION = 'UPDATE_COURT_SESSION',
  DELETE_COURT_SESSION = 'DELETE_COURT_SESSION',
  UPDATE_SUBPOENA = 'UPDATE_SUBPOENA',
  GET_SUBPOENA = 'GET_SUBPOENA',
  CREATE_CIVIL_CLAIMANT = 'CREATE_CIVIL_CLAIMANT',
  UPDATE_CIVIL_CLAIMANT = 'UPDATE_CIVIL_CLAIMANT',
  DELETE_CIVIL_CLAIMANT = 'DELETE_CIVIL_CLAIMANT',
  CREATE_OFFENSE = 'CREATE_OFFENSE',
  UPDATE_OFFENSE = 'UPDATE_OFFENSE',
  DELETE_OFFENSE = 'DELETE_OFFENSE',
  DELIVER_SUBPOENA_TO_NATIONAL_COMMISSIONERS_OFFICE = 'DELIVER_SUBPOENA_TO_NATIONAL_COMMISSIONERS_OFFICE',
  CREATE_VICTIM = 'CREATE_VICTIM',
  UPDATE_VICTIM = 'UPDATE_VICTIM',
  DELETE_VICTIM = 'DELETE_VICTIM',
  GET_CASE_TABLE = 'GET_CASE_TABLE',
  SEARCH_CASES = 'SEARCH_CASES',
  CREATE_VERDICTS = 'CREATE_VERDICTS',
  GET_VERDICT = 'GET_VERDICT',
  GET_VERDICT_SUPPLEMENTS = 'GET_VERDICT_SUPPLEMENTS',
  UPDATE_VERDICT = 'UPDATE_VERDICT',
  UPDATE_VERDICT_APPEAL_DECISION = 'UPDATE_VERDICT_APPEAL_DECISION',
  DELIVER_CASE_VERDICT = 'DELIVER_CASE_VERDICT',
  DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT = 'DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT',
  CREATE_COURT_DOCUMENT = 'CREATE_COURT_DOCUMENT',
  UPDATE_COURT_DOCUMENT = 'UPDATE_COURT_DOCUMENT',
  FILE_COURT_DOCUMENT = 'FILE_COURT_DOCUMENT',
  DELETE_COURT_DOCUMENT = 'DELETE_COURT_DOCUMENT',
  SPLIT_DEFENDANT_FROM_CASE = 'SPLIT_DEFENDANT_FROM_CASE',
}

@Injectable()
export class AuditTrailService {
  constructor(
    @Inject(auditTrailModuleConfig.KEY)
    private readonly config: ConfigType<typeof auditTrailModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.initTrail()
  }

  private trail?: Logger

  private formatMessage({
    userId,
    action,
    ids,
    details,
    error,
  }: {
    userId: string
    action: AuditedAction
    ids: string | string[] | undefined
    details?: { [key: string]: string | Date | boolean | undefined | null }
    error?: unknown
  }) {
    const message = {
      user: userId,
      action,
      entities: ids,
      details,
      error,
    }

    // The generic logger expects a string, whereas the CloudWatch trail expect a json object
    return this.config.useGenericLogger ? JSON.stringify(message) : message
  }

  private initTrail() {
    if (this.config.useGenericLogger) {
      this.logger.info('Using generic logger for audit trail')

      this.trail = this.logger
    } else {
      this.logger.info(
        `Creating a dedicated logger for audit trail ${this.config.groupName}<<<${this.config.serviceName}`,
      )

      // Create a log stream with a randomized (time-based) hash so that multiple
      // instances of the service don't log to the same stream.
      const serviceName = this.config.serviceName
      const startTime = new Date().toISOString()
      this.trail = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            name: 'CloudWatch',
            logGroupName: this.config.groupName,
            logStreamName: function () {
              // Spread log streams across dates
              return `${serviceName}-${
                new Date().toISOString().split('T')[0]
              }-${createHash('md5').update(startTime).digest('hex')}`
            },
            awsRegion: this.config.region,
            jsonMessage: true,
          }),
        ],
      })
    }
  }

  private writeToTrail({
    userId,
    actionType,
    ids,
    details,
    error,
  }: {
    userId: string
    actionType: AuditedAction
    ids: string | string[] | undefined
    details?: { [key: string]: string | Date | boolean | undefined | null }
    error?: unknown
  }) {
    if (!this.trail) {
      throw new ReferenceError('Audit trail has not been initialized')
    }

    this.trail.info(
      this.formatMessage({ userId, action: actionType, ids, details, error }),
    )
  }

  private async auditResult<R>({
    userId,
    actionType,
    result,
    auditedResult,
    getAuditDetails,
  }: {
    userId: string
    actionType: AuditedAction
    result: R
    auditedResult: string | ((result: R) => string | string[])
    getAuditDetails?: (
      res: R,
    ) => Promise<{ [key: string]: string | Date | boolean | undefined | null }>
  }): Promise<R> {
    const auditDetails = getAuditDetails
      ? { details: await getAuditDetails(result) }
      : {}
    this.writeToTrail({
      userId,
      actionType,
      ids:
        typeof auditedResult === 'string'
          ? auditedResult
          : auditedResult(result),
      ...auditDetails,
    })

    return result
  }

  private async auditPromisedResult<R>(
    userId: string,
    actionType: AuditedAction,
    action: Promise<R>,
    auditedResult: string | ((result: R) => string | string[]),
    getAuditDetails?: (
      res: R,
    ) => Promise<{ [key: string]: string | Date | boolean | undefined | null }>,
  ): Promise<R> {
    try {
      const result = await action

      return await this.auditResult({
        userId,
        actionType,
        result,
        auditedResult,
        getAuditDetails,
      })
    } catch (e) {
      this.writeToTrail({
        userId,
        actionType,
        ids: typeof auditedResult === 'string' ? auditedResult : undefined,
        error: e,
      })

      throw e
    }
  }

  async audit<R>(
    userId: string,
    actionType: AuditedAction,
    action: Promise<R> | R,
    auditedResult: string | ((result: R) => string | string[]),
    getAuditDetails?: (
      res: R,
    ) => Promise<{ [key: string]: string | Date | boolean | undefined | null }>,
  ): Promise<R> {
    if (action instanceof Promise) {
      return await this.auditPromisedResult<R>(
        userId,
        actionType,
        action,
        auditedResult,
        getAuditDetails,
      )
    } else {
      return await this.auditResult({
        userId,
        actionType,
        result: action,
        auditedResult,
        getAuditDetails,
      })
    }
  }
}
