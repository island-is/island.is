import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  Controller,
  Header,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { VehiclesClientService } from '@island.is/clients/vehicles'
import { AuditService } from '@island.is/nest/audit'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly auditService: AuditService,
    private readonly vehicleService: VehiclesClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
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
    @Res() res: Response,
  ) {
    const documentResponse = await this.vehicleService.vehicleReport(user, {
      vehicleId: permno,
    })

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

  @Post('/ownership/excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Pragma', 'no-cache')
  @Header('Cache-Control', 'no-cache')
  @Header('Cache-Control', 'nmax-age=0')
  @ApiOkResponse({
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {},
    },
    description: 'Get an excel export from the work machines service',
  })
  async getVehicleOwnershipExcel(
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.vehicleService.ownershipReportExcel(
      user,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleOwnershipExcel',
        auth: user,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=eignastoduvottord-${user.nationalId}.xlsx`,
      )
      return res.status(200).end(buffer)
    }
    return res.end()
  }

  @Post('/ownership/pdf/:ssn')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a pdf ownership document from the Vehicle service',
  })
  async getVehicleOwnershipPdf(
    @Param('ssn') ssn: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.vehicleService.ownershipReportPdf(
      user,
      { personNationalId: ssn },
    )

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
      res.header('Content-Type', 'application/pdf')
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
