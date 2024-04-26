import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { AuditTrailService } from '@island.is/judicial-system/audit-trail'

import appModuleConfig from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(): Promise<string> {
    return 'OK'
  }

  async testConnection(): Promise<string> {
    //TODO: Audit
    return this.test()
  }
}
