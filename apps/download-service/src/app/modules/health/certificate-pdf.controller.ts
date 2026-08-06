import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { HealthDirectorateHealthService } from '@island.is/clients/health-directorate'
import { AuditService } from '@island.is/nest/audit'
import { Features, FeatureFlagService } from '@island.is/nest/feature-flags'
import { Controller, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.health)
@Controller('health/certificates')
export class HealthCertificatePdfController {
  constructor(
    private readonly healthService: HealthDirectorateHealthService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Post(':id/pdf')
  @ApiOkResponse({
    description: 'Downloads an issued health certificate PDF',
  })
  async getCertificatePdf(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const featureAllowed = await this.featureFlagService.getValue(
      Features.isServicePortalHealthMessagesPageEnabled,
      false,
      user,
    )

    if (!featureAllowed) {
      return res.status(403).json({ statusCode: 403, message: 'Not allowed' })
    }

    const result = await this.healthService.getCertificatePdf(user, id)

    if (!result) {
      return res.status(404).json({ statusCode: 404, message: 'Not found' })
    }

    if (result.status === 402) {
      return res.status(402).json({
        resourceType: result.resourceType,
        resourceId: result.resourceId,
      })
    }

    this.auditService.audit({
      action: 'getHealthCertificatePdf',
      auth: user,
      resources: id,
    })

    const buffer = Buffer.from(result.data)
    res.header('Content-Length', buffer.length.toString())
    res.header('Content-Type', result.contentType)
    res.header('Pragma', 'no-cache')
    res.header('Cache-Control', 'no-store, private, max-age=0')
    return res.status(200).end(buffer)
  }
}
