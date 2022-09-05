import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { ApiScope } from '@island.is/auth/scopes'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { GetVehicleHistoryDocumentDto } from './dto/getVehicleHistoryDocument.dto'
import { PdfApi } from '@island.is/clients/vehicles'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly vehiclePDFService: PdfApi,
    private readonly auditService: AuditService,
  ) {}

  @Post('/history/:permno')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a history document from the Vehicle service',
  })
  async getVehicleHistoryPdf(
    @Param('permno') permno: string,
    @CurrentUser() user: User,
    @Body() resource: GetVehicleHistoryDocumentDto,
    @Res() res: Response,
  ) {
    const authUser: User = {
      ...user,
      authorization: `Bearer ${resource.__accessToken}`,
    }

    const documentResponse = await this.vehiclePDFService
      .withMiddleware(new AuthMiddleware(authUser))
      .vehicleReportPdfGet({ permno: permno })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleHistoryPdf',
        auth: user,
        resources: permno,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-ferilskyrsla-${permno}.pdf`,
      )
      res.header('Content-Type: application/pdf')
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }

  @Post('/ownership/:ssn')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a pdf ownership document from the Vehicle service',
  })
  async getVehicleOwnership(
    @Param('ssn') ssn: string,
    @CurrentUser() user: User,
    @Body() resource: GetVehicleHistoryDocumentDto,
    @Res() res: Response,
  ) {
    const authUser: User = {
      ...user,
      authorization: `Bearer ${resource.__accessToken}`,
    }

    const documentResponse = await this.vehiclePDFService
      .withMiddleware(new AuthMiddleware(authUser))
      .ownershipReportPdfGet({ ssn: ssn })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleOwnershipPdf',
        auth: user,
        resources: ssn,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-eignaferill.pdf`,
      )
      res.header('Content-Type: application/pdf')
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
