import {
  Controller,
  Header,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiGatewayTimeoutResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { EstatesClientService } from '@island.is/clients/estates'
import {
  type Logger,
  LOGGER_PROVIDER,
  withLoggingContext,
} from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { HttpProblemResponse } from '@island.is/nest/problem'

import { withTimeout } from '../../utils/withTimeout'
import { EstateDocumentParamsDto } from './dto/estateDocumentParams.dto'

// One second under createEnhancedFetch's 20s default, so the 504 wins over the client's timeout error
const DOCUMENT_TIMEOUT_MS = 19000

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.estates)
@FeatureFlag(Features.isServicePortalEstatesEnabled)
@Controller('estates')
export class EstatesDocumentsController {
  constructor(
    private readonly estatesService: EstatesClientService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/document/:documentId')
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get an estate document pdf from the district commissioners',
  })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse({ type: HttpProblemResponse })
  @ApiGatewayTimeoutResponse({ type: HttpProblemResponse })
  async getEstateDocumentPdf(
    @Param() { documentId }: EstateDocumentParamsDto,
    @CurrentUser() user: User,
  ) {
    this.logger.debug('Serving estate document request', { documentId })

    return withLoggingContext({ documentId }, async () => {
      const document = await withTimeout(DOCUMENT_TIMEOUT_MS, (signal) =>
        this.estatesService.getDocument(user, documentId, signal),
      )

      if (!document?.documentContentBase64) {
        throw new NotFoundException('Estate document not found')
      }

      this.auditService.audit({
        action: 'getEstateDocumentPdf',
        auth: user,
        resources: documentId,
      })

      const buffer = Buffer.from(document.documentContentBase64, 'base64')

      return new StreamableFile(buffer, {
        type: 'application/pdf',
        disposition: `attachment; filename="danarbu-skjal-${documentId}.pdf"`,
        length: buffer.length,
      })
    })
  }
}
