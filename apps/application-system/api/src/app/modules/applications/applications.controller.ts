import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { Application } from '../../core/db/models/application.model'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './dto/application.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get()
  @ApiOkResponse({ type: [Application] })
  async findAll(): Promise<Array<Application>> {
    return await this.applicationService.findAll()
  }

  @Post()
  @ApiCreatedResponse({ type: Application })
  async create(@Body() application: ApplicationDto): Promise<Application> {
    return await this.applicationService.create(application)
  }

  @Get(':id')
  @ApiOkResponse({ type: Application })
  async findOne(@Param('id') id: string): Promise<Application> {
    const application = await this.applicationService.findOne(id)

    if (!application) {
      throw new NotFoundException("This application doesn't exist")
    }

    return application
  }

  @Put(':id')
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id') id: string,
    @Body() application: ApplicationDto,
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
