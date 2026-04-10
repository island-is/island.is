import { Controller, Get, Param, Req, VERSION_NEUTRAL } from '@nestjs/common'
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
import { ApplicationXroadDto } from './models/dto/application.xroad.dto'

@ApiTags('api')
@Controller({ path: 'api', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsXRoadController {
  constructor(
    private readonly applicationsXRoadService: ApplicationsXRoadService,
  ) {}

  @ApiOperation({ summary: 'Get application by id via X-Road' })
  @ApiOkResponse({
    type: ApplicationXroadDto,
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
  ): Promise<ApplicationXroadDto> {
    const xRoadClient = req.headers['x-road-client']
    return await this.applicationsXRoadService.getApplication(
      id,
      xRoadClient as string,
    )
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
    const xRoadClient = req.headers['x-road-client']
    return await this.applicationsXRoadService.getFile(
      id,
      xRoadClient as string,
    )
  }
}
