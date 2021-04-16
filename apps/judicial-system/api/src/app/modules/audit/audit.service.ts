import { Injectable } from '@nestjs/common'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { environment } from '../../../environments'

@Injectable()
export class AuditService {
  constructor(private readonly auditTrailService: AuditTrailService) {
    auditTrailService.initTrail(environment.auditTrail)
  }

  async audit<R>(
    userId: string,
    actionType: AuditedAction,
    action: Promise<R> | R,
    auditedResult: string | ((result: R) => string | string[]),
  ): Promise<R> {
    const result = action instanceof Promise ? await action : action

    this.auditTrailService.audit(
      userId,
      actionType,
      typeof auditedResult === 'string' ? auditedResult : auditedResult(result),
    )

    return result
  }
}
