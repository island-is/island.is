import {
  BadRequestException,
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
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { HttpProblemResponse } from '@island.is/nest/problem'
import { HmsRentalAgreementService } from '@island.is/clients/hms-rental-agreement'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

/**
 * HMS never populates document_mime on its contract documents, so we can't
 * trust the client's declared mime type — sniff the actual file signature
 * instead of assuming everything is a PDF.
 */
const sniffFileType = (
  buffer: Buffer,
): { mime: string; extension: string } => {
  if (buffer.subarray(0, 4).toString('latin1') === '%PDF') {
    return { mime: 'application/pdf', extension: 'pdf' }
  }
  if (buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) {
    return {
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: 'docx',
    }
  }
  if (buffer.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]))) {
    return { mime: 'application/msword', extension: 'doc' }
  }
  return { mime: 'application/pdf', extension: 'pdf' }
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.hms)
@Controller('rental-agreements')
export class RentalAgreementsController {
  constructor(
    private readonly service: HmsRentalAgreementService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/:contractId')
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get the latest rental agreement pdf from HMS',
  })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  async getLatestRentalAgreementPdf(
    @Param('contractId') contractId: string | undefined,
    @CurrentUser() user: User,
  ) {
    if (!contractId) {
      throw new BadRequestException('Missing contractId')
    }

    const documentResponse = await this.service.getLatestRentalAgreementPdf(
      user,
      contractId,
    )

    if (!documentResponse) {
      throw new NotFoundException('Rental agreement document not found')
    }

    this.auditService.audit({
      action: 'getLatestRentalAgreementPdf',
      auth: user,
      resources: contractId,
    })

    const buffer = Buffer.from(documentResponse.document, 'base64')
    const { mime, extension } = sniffFileType(buffer)

    this.logger.info('Serving rental agreement document', {
      contractId,
      mime,
    })

    return new StreamableFile(buffer, {
      type: mime,
      disposition: `attachment; filename="${user.nationalId}-rental-agreement-${contractId}.${extension}"`,
      length: buffer.length,
    })
  }

  @Post('/:contractId/:documentId')
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a specific rental agreement document pdf from HMS',
  })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  async getRentalAgreementDocumentPdf(
    @Param('contractId') contractId: string | undefined,
    @Param('documentId') documentId: string | undefined,
    @CurrentUser() user: User,
  ) {
    if (!contractId) {
      throw new BadRequestException('Missing contractId')
    }
    if (!documentId) {
      throw new BadRequestException('Missing documentId')
    }

    const documentResponse = await this.service.getRentalAgreementDocumentPdf(
      user,
      +contractId,
      +documentId,
    )

    if (!documentResponse) {
      throw new NotFoundException('Rental agreement document not found')
    }

    this.auditService.audit({
      action: 'getRentalAgreementDocumentPdf',
      auth: user,
      resources: `${contractId}/${documentId}`,
    })

    const buffer = Buffer.from(documentResponse.document, 'base64')
    const { mime, extension } = sniffFileType(buffer)

    this.logger.info('Serving rental agreement document', {
      contractId,
      documentId,
      mime,
    })

    return new StreamableFile(buffer, {
      type: mime,
      disposition: `attachment; filename="${user.nationalId}-rental-agreement-${contractId}-${documentId}.${extension}"`,
      length: buffer.length,
    })
  }
}
