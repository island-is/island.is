import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Controller, Header, Inject, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {  VehiclesClientService } from '@island.is/clients/vehicles'
import { AuditService } from '@island.is/nest/audit'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly auditService: AuditService,
    private readonly vehicleService: VehiclesClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger
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
    const documentResponse = await this.vehicleService.vehicleReport(user, {vehicleId: permno})

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
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Pragma', 'no-cache')
  @Header('Cache-Control', 'no-cache')
  @Header('Cache-Control', 'nmax-age=0')
  @ApiOkResponse({
    content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {} },
    description: 'Get an excel export from the work machines service',
  })
  async getVehicleOwnershipExcel(
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.vehicleService.ownershipReportExcel(user)

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleOwnershipExcel',
        auth: user,
      })

      const ble = "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nPnYkFMlGtalK74ECu+GzXe14owv4LR7rRA22uu/gGO4QUL6FzRyKjyWn4FH/ACqAOWHTijJS8mRBOltmYzGYHW6mNBpXe/3jJUnIid+n8fTQsTzo9RSxN9A+PYRT0dWwK16Kok3TJY3rD45LT55zGzl3118fB/Id+CbasaUTP+J8ABuDcGPRA4UpZxG+NrfUEsDBBQAAAAAABx5r1qBRGnn2gEAANoBAABRAAAAcGFja2FnZS9zZXJ2aWNlcy9tZXRhZGF0YS9jb3JlLXByb3BlcnRpZXMvODQwNGQwZjBiMGM3NGI1MWFjMzBjODI2OTBlYjY1OGMucHNtZGNw77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48Y29yZVByb3BlcnRpZXMgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpkY3Rlcm1zPSJodHRwOi8vcHVybC5vcmcvZGMvdGVybXMvIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4bWxucz0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9tZXRhZGF0YS9jb3JlLXByb3BlcnRpZXMiPjxkY3Rlcm1zOmNyZWF0ZWQgeHNpOnR5cGU9ImRjdGVybXM6VzNDRFRGIj4yMDI1LTA1LTE1VDE1OjA4OjU2LjkzNjU2MjdaPC9kY3Rlcm1zOmNyZWF0ZWQ+PGRjdGVybXM6bW9kaWZpZWQgeHNpOnR5cGU9ImRjdGVybXM6VzNDRFRGIj4yMDI1LTA1LTE1VDE1OjA4OjU2LjkzNjU2MzdaPC9kY3Rlcm1zOm1vZGlmaWVkPjwvY29yZVByb3BlcnRpZXM+UEsDBBQAAAAAABx5r1pQJ55XnAIAAJwCAAALAAAAX3JlbHMvLnJlbHPvu788P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJ1dGYtOCI/PjxSZWxhdGlvbnNoaXBzIHhtbG5zPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMiPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9vZmZpY2VEb2N1bWVudCIgVGFyZ2V0PSIveGwvd29ya2Jvb2sueG1sIiBJZD0iUjYwM2RlY2Y3MTNlNzQ1NjMiIC8+PFJlbGF0aW9uc2hpcCBUeXBlPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL2V4dGVuZGVkLXByb3BlcnRpZXMiIFRhcmdldD0iL2RvY1Byb3BzL2FwcC54bWwiIElkPSJySWQxIiAvPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzL21ldGFkYXRhL2NvcmUtcHJvcGVydGllcyIgVGFyZ2V0PSIvcGFja2FnZS9zZXJ2aWNlcy9tZXRhZGF0YS9jb3JlLXByb3BlcnRpZXMvODQwNGQwZjBiMGM3NGI1MWFjMzBjODI2OTBlYjY1OGMucHNtZGNwIiBJZD0iUjgzZTI5NTljNDYyNTQ1OTciIC8+PC9SZWxhdGlvbnNoaXBzPlBLAwQUAAAACAAcea9aDNxIs+MAAAC+AgAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxztZJBTsMwEEWvYs2eTFpQhVDdbrrptvQCljOJoya25ZnS9mwsOBJXwAQJYcSCTTa2/Mfz9Mby++vbensdB/VCifvgNSyqGhR5G5redxrO0t49wnazPtBgJN9g10dWucWzBicSnxDZOhoNVyGSz5U2pNFIPqYOo7En0xEu63qF6ScDSqY63iL9hxjatre0C/Y8kpc/wMjOJGqeJeUJGNTRpI5EA16HslRlMqh9oyHtm3tQOJ+R3Ab6rTJlhcPDnA6XkE7siKTU+I4/3y1vi8JoOaeR5F4qbaboay1FVpMIFr9w8wFQSwMEFAAAAAgAHHmvWlo7UkA8AQAANwQAABMAAABbQ29udGVudF9UeXBlc10ueG1srZRNTsMwEIWvEnmLYrcsEEJNuwC2UAkuYNmTxKr/5JmW9mwsOBJXYJqiglBFBe3GljMz73se23l/fZvM1sFXKyjoUmzEWI5EBdEk62LXiCW19bWYTSfPmwxYcWrERvRE+UYpND0EjTJliBxpUwmaeFk6lbVZ6A7U5Wh0pUyKBJFq2mqI6eQOWr30VN2v+fMOy+Wiut3lbVGN0Dl7ZzRxWK2i/QGpU9s6AzaZZeASibmAttgDUPBymGXQLl4MwuogM2OwJv8N+7kvaVKBOheOFnKAv2EKePwfhCuHHOxd/kI88lkVZ6Ga60IPOrCe4j7M2QwqVpan9hK23i3YQ/s7BF97hb0uYJ+o8KVBee7D/KZ91AhtPJzdwSB6DP2SymKoQG4HT+Mzu9jrHzNC/CphN57uYZDZE9XwG5h+AFBLAQIUABQAAAAIABx5r1rf8ke/CwEAAMUBAAAPAAAAAAAAAAAAAAAAAAAAAAB4bC93b3JrYm9vay54bWxQSwECFAAUAAAACAAcea9a9RCZNGgBAABhAwAAEAAAAAAAAAAAAAAAAAA4AQAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUABQAAAAIABx5r1pUU0pWLwMAAOgMAAAUAAAAAAAAAAAAAAAAAM4CAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQIUABQAAAAIABx5r1odciCnagIAALsLAAANAAAAAAAAAAAAAAAAAC8GAAB4bC9zdHlsZXMueG1sUEsBAhQAFAAAAAgAHHmvWnZaKj7IBgAA5CoAABgAAAAAAAAAAAAAAAAAxAgAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQIUABQAAAAIABx5r1pgTIeztQUAALgbAAATAAAAAAAAAAAAAAAAAMIPAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAhQAFAAAAAAAHHmvWoFEaefaAQAA2gEAAFEAAAAAAAAAAAAAAAAAqBUAAHBhY2thZ2Uvc2VydmljZXMvbWV0YWRhdGEvY29yZS1wcm9wZXJ0aWVzLzg0MDRkMGYwYjBjNzRiNTFhYzMwYzgyNjkwZWI2NThjLnBzbWRjcFBLAQIUABQAAAAAABx5r1pQJ55XnAIAAJwCAAALAAAAAAAAAAAAAAAAAPEXAABfcmVscy8ucmVsc1BLAQIUABQAAAAIABx5r1oM3Eiz4wAAAL4CAAAaAAAAAAAAAAAAAAAAALYaAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQIUABQAAAAIABx5r1paO1JAPAEAADcEAAATAAAAAAAAAAAAAAAAANEbAABbQ29udGVudF9UeXBlc10ueG1sUEsFBgAAAAAKAAoAwAIAAD4dAAAAAA=="


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
    const documentResponse = await this.vehicleService.ownershipReportPdf(user, {personNationalId: ssn})

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
