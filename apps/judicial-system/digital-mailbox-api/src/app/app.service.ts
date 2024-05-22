import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { AuditTrailService } from '@island.is/judicial-system/audit-trail'

import { authModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(): Promise<string> {
    return 'OK'
  }

  async testConnection(): Promise<string> {
    return this.test()
  }
}
