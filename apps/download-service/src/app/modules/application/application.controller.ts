import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ApplicationScope } from '@island.is/auth/scopes'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { GetApplicationPdfDto } from './dto/getApplicationPdf'
import { ApplicationsApi } from '@island.is/clients/application'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApplicationScope.read)
@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationApi: ApplicationsApi) {}

  applicationApiWithAuth(auth: Auth, authorizationToken: string) {
    auth.authorization = `Bearer ${authorizationToken}`
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  @Post('/:applicationId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a PDF document for an application',
  })
  async getApplicationPdf(
    @Param('applicationId') applicationId: string,
    @CurrentUser() user: User,
    @Body() resource: GetApplicationPdfDto,
    @Res() res: Response,
  ) {
    const application = await this.applicationApiWithAuth(
      user,
      resource.__accessToken,
    ).applicationControllerFindOne({
      id: applicationId,
    })

    const externalData = application.externalData as {
      sendApplication: {
        data: {
          pdfContent: string
        }
      }
    }

    const documentBase64 = externalData?.sendApplication?.data?.pdfContent
    if (documentBase64) {
      const buffer = Buffer.from(documentBase64, 'base64')

      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${applicationId}.pdf`)
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')

      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
