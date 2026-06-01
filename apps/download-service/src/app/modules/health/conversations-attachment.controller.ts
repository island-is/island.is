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
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.health)
@Controller('health/conversations')
export class HealthConversationsAttachmentController {
  constructor(
    private readonly healthService: HealthDirectorateHealthService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Get(':conversationId/:messageId/:attachmentId')
  @ApiOkResponse({
    description: 'Downloads a health message attachment',
  })
  async getConversationAttachment(
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
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

    const attachment = await this.healthService.getMessageAttachment(
      user,
      conversationId,
      messageId,
      attachmentId,
    )

    if (!attachment) {
      return res.status(404).json({ statusCode: 404, message: 'Not found' })
    }

    this.auditService.audit({
      action: 'getHealthConversationAttachment',
      auth: user,
      resources: `${conversationId}/${messageId}/${attachmentId}`,
    })

    const buffer = Buffer.from(attachment.data)
    res.header('Content-Length', buffer.length.toString())
    res.header('Content-Type', attachment.contentType)
    res.header('Pragma', 'no-cache')
    res.header('Cache-Control', 'no-cache, max-age=0')
    return res.status(200).end(buffer)
  }
}
