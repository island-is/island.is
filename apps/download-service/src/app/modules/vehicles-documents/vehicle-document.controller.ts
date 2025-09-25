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
import * as XLSX from 'xlsx'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { VehiclesClientService } from '@island.is/clients/vehicles'
import { AuditService } from '@island.is/nest/audit'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import format from 'date-fns/format'
import csvStringify from 'csv-stringify/lib/sync'

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

  @Post('/mileagetemplate/:fileType')
  @Header('Content-Type', 'application/octet-stream')
  @ApiOkResponse({
    content: { 'application/octet-stream': {} },
    description: 'Get a file export from the vehicle service',
  })
  async getVehicleMileageTemplate(
    @Param('fileType') fileType: 'csv' | 'excel',
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (fileType !== 'csv' && fileType !== 'excel') {
      return res.status(400).send('Unsupported fileType')
    }

    const documentResponse = await this.vehicleService.getVehiclesUnknownArray(
      user,
      {
        pageSize: 20000,
        page: 1,
        includeNextMainInspectionDate: false,
        onlyMileageRegisterableVehicles: true,
      },
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleMileageTemplateExcel',
        auth: user,
        resources: fileType,
      })

      if (fileType === 'excel') {
        const sheetName = `km_template_${format(new Date(), 'ddMMyyyy')}.xlsx`
          .replace(/[:\\/?*[\]]/g, '_')
          .trim()

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.aoa_to_sheet(documentResponse)
        const workbook: XLSX.WorkBook = {
          Sheets: { [sheetName]: worksheet },
          SheetNames: [sheetName],
        }

        const excelBuffer = XLSX.writeXLSX(workbook, {
          bookType: 'xlsx',
          type: 'buffer',
        })

        res.header(
          'Content-length',
          Buffer.byteLength(excelBuffer, 'utf8').toString(),
        )
        res.header('Content-Disposition', `attachment; filename=${sheetName}`)
        res.type(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        return res.status(200).end(excelBuffer)
      } else {
        const sheetName = `km_template_${format(new Date(), 'ddMMYyyyy')}.csv`
          .replace(/[:\\/?*[\]]/g, '_')
          .trim()

        const csvString = csvStringify(documentResponse, { bom: true })
        res.header(
          'Content-length',
          Buffer.byteLength(csvString, 'utf8').toString(),
        )
        res.header('Content-Disposition', `attachment; filename=${sheetName}`)
        res.type('text/csv; charset=utf-8')
        return res.status(200).end(csvString)
      }
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

  @Post('/ownership/pdf')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a pdf ownership document from the Vehicle service',
  })
  async getVehicleOwnershipPdf(
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.vehicleService.ownershipReportPdf(user)

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleOwnershipPdf',
        auth: user,
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
