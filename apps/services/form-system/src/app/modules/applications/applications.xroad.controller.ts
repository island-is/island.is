import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Req,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsXRoadService } from './applications.xroad.service'
import { FileResponseDto } from './models/dto/file.response.dto'
import { ApplicationJsonDto } from './models/dto/application.json.dto'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

@ApiTags('api')
@Controller({ path: 'api', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsXRoadController {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly applicationsXRoadService: ApplicationsXRoadService,
  ) {}

  private getValidatedXRoadClient(req: Request): string {
    const xRoadClientHeader = req.headers['x-road-client']

    if (typeof xRoadClientHeader === 'undefined') {
      throw new BadRequestException('Missing required header: X-Road-Client')
    }

    if (Array.isArray(xRoadClientHeader)) {
      throw new BadRequestException(
        'Invalid X-Road-Client header: must be a single string',
      )
    }

    if (typeof xRoadClientHeader !== 'string') {
      throw new BadRequestException(
        'Invalid X-Road-Client header: must be a string',
      )
    }

    const xRoadClient = xRoadClientHeader.trim()
    if (!xRoadClient) {
      throw new BadRequestException(
        'Invalid X-Road-Client header: must be non-empty',
      )
    }

    return xRoadClient
  }

  @ApiOperation({ summary: 'Get application by id via X-Road' })
  @ApiOkResponse({
    type: ApplicationJsonDto,
    description: 'Get application by id',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({
    name: 'X-Road-Client',
    description: 'X-Road client identifier',
    required: true,
  })
  @Get('application/:id')
  async getApplication(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ApplicationJsonDto> {
    const xRoadClient = this.getValidatedXRoadClient(req)
    this.logger.info('Fetching application by id via X-Road', {
      id,
      xRoadClient,
    })
    return await this.applicationsXRoadService.getApplication(id, xRoadClient)
  }

  @ApiOperation({ summary: 'Get file by id via X-Road' })
  @ApiOkResponse({ type: FileResponseDto, description: 'Get file by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({
    name: 'X-Road-Client',
    description: 'X-Road client identifier',
    required: true,
  })
  @Get('file/:id')
  async getFile(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FileResponseDto> {
    const xRoadClient = this.getValidatedXRoadClient(req)
    this.logger.info('Fetching file by id via X-Road', { id, xRoadClient })
    return await this.applicationsXRoadService.getFile(id, xRoadClient)
  }
}
