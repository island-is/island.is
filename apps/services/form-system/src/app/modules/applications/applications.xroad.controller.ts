import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ApplicationDto } from './models/dto/application.dto'
import { ApplicationsXRoadService } from './applications.xroad.service'
import { FileResponseDto } from './models/dto/file.response.dto'

@Controller({ path: 'api/', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsXRoadController {
  constructor(
    private readonly applicationsXRoadService: ApplicationsXRoadService,
  ) {}

  @ApiOperation({ summary: 'Get application by id via X-Road' })
  @ApiOkResponse({ type: ApplicationDto, description: 'Get application by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({
    name: 'X-Road-Client',
    description: 'X-Road client identifier',
    required: true,
  })
  @Get('application/:id')
  async getApplication(@Param('id') id: string): Promise<ApplicationDto> {
    return await this.applicationsXRoadService.getApplication(id)
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
  async getFile(@Param('id') id: string): Promise<FileResponseDto> {
    return await this.applicationsXRoadService.getFile(id)
  }
}
