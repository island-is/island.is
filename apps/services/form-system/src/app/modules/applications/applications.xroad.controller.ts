import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ApplicationDto } from './models/dto/application.dto'
import { ApplicationsXRoadService } from './applications.xroad.service'

@Controller({ path: 'xroad/applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsXRoadController {
  constructor(
    private readonly applicationsXRoadService: ApplicationsXRoadService,
  ) {}

  @ApiOperation({ summary: 'Get application by id (X-Road)' })
  @ApiOkResponse({ type: ApplicationDto, description: 'Get application by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({
    name: 'X-Road-Client',
    description: 'X-Road client identifier',
    required: true,
  })
  @Get(':id')
  async getApplicationExternal(
    @Param('id') id: string,
  ): Promise<ApplicationDto> {
    return await this.applicationsXRoadService.getApplication(id)
  }
}
