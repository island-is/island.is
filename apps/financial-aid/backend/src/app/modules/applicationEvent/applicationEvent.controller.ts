import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { ApplicationEventService } from './applicationEvent.service'
import { ApplicationEventModel } from './models'

import { CreateApplicationEventDto } from './dto'
import { apiBasePath } from '@island.is/financial-aid/shared/lib'
import { TokenGuard } from '@island.is/financial-aid/auth'

@UseGuards(TokenGuard)
@Controller(apiBasePath)
@ApiTags('applicationEvents')
export class ApplicationEventController {
  constructor(
    private readonly applicationEventService: ApplicationEventService,
  ) {}

  @Get('applicationEvents')
  @ApiOkResponse({
    type: ApplicationEventModel,
    isArray: true,
    description: 'Gets all existing application events',
  })
  getAll(): Promise<ApplicationEventModel[]> {
    return this.applicationEventService.getAll()
  }

  @Get('applicationEvents/:id')
  @ApiOkResponse({
    type: ApplicationEventModel,
    description: 'Gets application event/s',
  })
  async getById(@Param('id') id: string) {
    const applicationEvent = await this.applicationEventService.findById(id)

    if (!applicationEvent) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return applicationEvent
  }

  @Post('applicationEvent')
  @ApiCreatedResponse({
    type: ApplicationEventModel,
    description: 'Creates a new application event',
  })
  create(
    @Body() applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationEventModel> {
    return this.applicationEventService.create(applicationEvent)
  }
}
