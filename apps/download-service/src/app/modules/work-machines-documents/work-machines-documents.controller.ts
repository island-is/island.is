import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Controller, Header, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { WorkMachinesClientService } from '@island.is/clients/work-machines'
import { AuditService } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Controller('workMachines')
export class WorkMachinesController {
  constructor(
    private readonly docService: WorkMachinesClientService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/export/:fileType')
  @Header('Content-Type', 'application/octet-stream')
  @ApiOkResponse({
    content: { 'application/octet-stream': {} },
    description: 'Get an csv export from the work machines service',
  })
  async getWorkMachinesCollection(
    @Param('fileType') fileType: 'csv' | 'excel',
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.docService.getDocuments(user, {
      fileType,
    })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getWorkMachinesCollection',
        auth: user,
        resources: fileType,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-work-machines-overview${
          fileType === 'excel' ? '.xls' : '.csv'
        }`,
      )
      res.header('Content-Type: application/octet-stream')
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
