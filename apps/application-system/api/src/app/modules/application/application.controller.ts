import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { ApplicationDto } from './dto/application.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApplicationValidationPipe } from './application.pipe'

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiCreatedResponse({ type: Application })
  async create(
    @Body(new ApplicationValidationPipe(false)) application: ApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(application)
  }

  @Get(':id')
  @ApiOkResponse({ type: Application })
  async findOne(@Param('id') id: string): Promise<Application> {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException("This application doesn't exist")
    }

    return application
  }

  @Put(':id')
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id') id: string,
    @Body(new ApplicationValidationPipe(true)) application: ApplicationDto,
  ): Promise<Application> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, application)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Application doesn't exist")
    }

    return updatedApplication
  }
}
