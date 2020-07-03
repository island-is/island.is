import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common'
import { Application } from '../../core/db/models/application.model'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './dto/application.dto'

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get()
  async findAll() {
    return await this.applicationService.findAll()
  }

  @Post()
  async create(
    @Body() application: ApplicationDto,
    @Request() req,
  ): Promise<Application> {
    // Validate answers based of typeId
    // GET schema for typeId
    return await this.applicationService.create(application)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    const application = await this.applicationService.findOne(id)

    if (!application) {
      throw new NotFoundException("This application doesn't exist")
    }

    return application
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() application: any,
    @Request() req,
  ): Promise<any> {
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
