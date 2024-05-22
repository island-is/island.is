import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { AuditTrailService } from '@island.is/judicial-system/audit-trail'

import { digitalMailboxModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(digitalMailboxModuleConfig.KEY)
    private readonly config: ConfigType<typeof digitalMailboxModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(nationalId: string): Promise<string> {
    return `OK ${nationalId}`
  }

  async testConnection(nationalId: string): Promise<string> {
    return this.test(nationalId)
  }
}
