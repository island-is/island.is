import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { AuditService } from '@island.is/nest/audit'
import { Controller, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('vmst')
export class VmstAttachmentController {
  constructor(
    private readonly vmstService: VmstUnemploymentClientService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/attachment/:attachmentId')
  @ApiOkResponse({
    description: 'Get a VMST attachment document by ID',
  })
  async getAttachment(
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const attachment = await this.vmstService.getAttachment(attachmentId)

    if (attachment?.data) {
      this.auditService.audit({
        action: 'getVmstAttachment',
        auth: user,
        resources: attachmentId,
      })

      const buffer = Buffer.from(attachment.data, 'base64')

      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename="${attachment.name}"`)
      res.header('Content-Type', attachment.contentType)
      res.header('Pragma', 'no-cache')
      res.header(
        'Cache-Control',
        'no-cache, no-store, max-age=0, must-revalidate',
      )
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
