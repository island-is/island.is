import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'
import { TransformableInfo } from 'logform'
import { createHash } from 'crypto'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Auth } from '@island.is/auth-nest-tools'
import type { AuditOptions } from './audit.options'
import { AUDIT_OPTIONS } from './audit.options'
import isString from 'lodash/isString'

type CommonMessageFields = {
  action: string
  namespace?: string
  resources?: string | string[]
  meta?: Record<string, unknown>
}

type SystemMessageFields = {
  system: true
}

type DefaultMessageFields = {
  auth: Auth
}

type SystemAuditMessage = CommonMessageFields & SystemMessageFields
type DefaultAuditMessage = CommonMessageFields & DefaultMessageFields
type AuditMessage = SystemAuditMessage | DefaultAuditMessage

// Template types
type CommonAuditTemplateFields<ResultType> = {
  action: string
  namespace?: string
  resources?:
    | string
    | string[]
    | ((result: ResultType) => string | string[] | undefined)
  meta?:
    | Record<string, unknown>
    | ((result: ResultType) => Record<string, unknown>)
}

type SystemAuditTemplate<T> = CommonAuditTemplateFields<T> & SystemMessageFields
type DefaultAuditTemplate<T> = CommonAuditTemplateFields<T> &
  DefaultMessageFields

export type AuditTemplate<T> = SystemAuditTemplate<T> | DefaultAuditTemplate<T>

const isDefaultAuditMessage = (obj: AuditMessage): obj is DefaultAuditMessage =>
  Object.prototype.hasOwnProperty.call(obj, 'auth')

const isDefaultAuditTemplate = <T>(
  obj: AuditTemplate<T>,
): obj is DefaultAuditTemplate<T> =>
  Object.prototype.hasOwnProperty.call(obj, 'auth')

@Injectable()
export class AuditService {
  private auditLog?: Logger
  private useDevLogger: boolean
  private defaultNamespace?: string

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(AUDIT_OPTIONS)
    private options: AuditOptions,
  ) {
    this.useDevLogger =
      options.groupName === undefined && process.env.NODE_ENV !== 'production'
    this.defaultNamespace = options.defaultNamespace

    if (this.useDevLogger) {
      this.logger.info('Using generic logger for audit')

      this.auditLog = this.logger
    } else {
      if (!options.groupName || !options.serviceName) {
        throw new Error('Audit service is not configured.')
      }

      this.logger.info(
        `Creating a dedicated logger for audit trail ${options.groupName}<<<${options.serviceName}`,
      )

      // Create a log stream with a randomized (time-based) hash so that multiple
      // instances of the service don't log to the same stream.
      const startTime = new Date().toISOString()
      const processHash = createHash('md5').update(startTime).digest('hex')
      this.auditLog = winston.createLogger({
        transports: [
          new WinstonCloudWatch({
            name: 'CloudWatch',
            logGroupName: options.groupName,
            messageFormatter: (info: TransformableInfo) => {
              // Flatten message to avoid top level object with "level" and "message".
              return JSON.stringify(info.message)
            },
            logStreamName: function () {
              // Spread log streams across dates
              const date = new Date().toISOString().split('T')[0]
              return `${options.serviceName}-${date}-${processHash}`
            },
          }),
        ],
      })
    }
  }

  private getClients(auth: Auth) {
    const clients: string[] = []
    let act = auth.act
    while (act) {
      clients.unshift(act.client_id)
      act = act.act
    }
    clients.unshift(auth.client)
    return clients
  }

  private formatMessage(message: AuditMessage) {
    const {
      namespace = this.defaultNamespace,
      action,
      resources,
      meta,
    } = message

    if (!namespace) {
      throw new Error(
        'Audit namespace is required. Did you configure a defaultNamespace?',
      )
    }

    const commonFields = {
      action: `${namespace}#${action}`,
      resources: isString(resources) ? [resources] : resources,
      meta,
      appVersion: process.env.APP_VERSION,
      ...(this.useDevLogger && { message: 'Audit record' }),
    }

    if (isDefaultAuditMessage(message)) {
      const { auth } = message

      return {
        ...commonFields,
        subject: auth.nationalId,
        actor: auth.actor ? auth.actor.nationalId : auth.nationalId,
        client: this.getClients(auth),
        ip: auth.ip,
        userAgent: auth.userAgent,
      }
    }

    return {
      ...commonFields,
      system: message.system,
    }
  }

  private unwrap<PropType, ResultType>(prop: PropType, result: ResultType) {
    return typeof prop === 'function' ? prop(result) : prop
  }

  audit(message: AuditMessage) {
    this.auditLog?.info(this.formatMessage(message))
  }

  auditPromise<T>(template: AuditTemplate<T>, promise: Promise<T>): Promise<T> {
    return promise.then((result) => {
      const commonFields = {
        action: template.action,
        namespace: template.namespace,
        resources: this.unwrap(template.resources, result),
        meta: this.unwrap(template.meta, result),
      }

      if (isDefaultAuditTemplate(template)) {
        this.audit({
          ...commonFields,
          auth: template.auth,
        })
      } else {
        this.audit({
          ...commonFields,
          system: template.system,
        })
      }

      return result
    })
  }
}
