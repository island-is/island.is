import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { IdsAuthGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { Documentation } from '@island.is/nest/swagger'

import { ApplicationService } from '@island.is/application/api/core'
import { FileService } from '@island.is/application/api/files'
import { AttachmentPresignedUrlsResponseDto } from './dto/attachmentPresignedUrls.response.dto'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('applications')
@ApiBearerAuth()
@Controller()
export class ApplicationInternalController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Get('applications/:id/attachments/presigned-urls')
  @Scopes(ApplicationScope.read)
  @Documentation({
    description:
      'Gets presigned urls for all attachments of an application. Intended for service-to-service use.',
    response: { status: 200, type: AttachmentPresignedUrlsResponseDto },
    request: {
      query: {},
      params: {
        id: {
          type: 'string',
          description: 'application id',
          required: true,
        },
      },
    },
  })
  async getAllAttachmentPresignedURLs(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AttachmentPresignedUrlsResponseDto> {
    const existingApplication = await this.applicationService.findOneById(id)

    if (!existingApplication) {
      throw new NotFoundException(`Application with id ${id} not found`)
    }

    if (
      !existingApplication.attachments ||
      Object.keys(existingApplication.attachments).length === 0
    ) {
      return { attachments: [] }
    }

    const attachments = await Promise.all(
      Object.entries(
        existingApplication.attachments as Record<string, string>,
      ).map(async ([key, fileName]) => {
        try {
          const { url } = await this.fileService.getAttachmentPresignedURL(
            fileName,
          )
          return { key, url: url ?? '' }
        } catch {
          return { key, url: '' }
        }
      }),
    )

    const validAttachments = attachments.filter((a) => a.url !== '')

    if (validAttachments.length !== attachments.length) {
      this.logger.warn(
        `Some attachments failed to get presigned URL for application ${id}. ${
          attachments.length - validAttachments.length
        } attachments failed.`,
      )
    }

    return { attachments: validAttachments }
  }
}
