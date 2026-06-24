import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsXRoadService } from './applications.xroad.service'
import { FileResponseDto } from './models/dto/file.response.dto'
import { ApplicationJsonDto } from './models/dto/application.json.dto'

@ApiTags('api')
@Controller({ path: 'api', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsXRoadController {
  constructor(
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
    return await this.applicationsXRoadService.getApplication(id, xRoadClient)
  }

  @ApiOperation({ summary: 'Get file by id via X-Road' })
  @ApiOkResponse({ type: FileResponseDto, description: 'Get file by id' })
  @ApiQuery({
    name: 's3Key',
    type: String,
    description: 'URL-encoded S3 key for the file',
    required: true,
  })
  @ApiHeader({
    name: 'X-Road-Client',
    description: 'X-Road client identifier',
    required: true,
  })
  @Get('file')
  async getFile(
    @Query('s3Key') s3Key: string,
    @Req() req: Request,
  ): Promise<FileResponseDto> {
    if (!s3Key?.trim()) {
      throw new BadRequestException('Missing required query parameter: s3Key')
    }

    const xRoadClient = this.getValidatedXRoadClient(req)
    return await this.applicationsXRoadService.getFile(s3Key, xRoadClient)
  }
}
