import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Resource } from './resource.model'
import { ResourceService } from './resource.service'
import { ResourceDto } from './dto/resource.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AccessGuard } from '../authz/access.guard'

@UseGuards(AuthGuard('jwt'), AccessGuard)
@ApiTags('resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @ApiCreatedResponse({ type: Resource })
  async create(@Body() resource: ResourceDto): Promise<Resource> {
    return await this.resourceService.create(resource)
  }

  @Get(':nationalId')
  @ApiOkResponse({ type: Resource })
  async findOne(@Param('nationalId') nationalId: string): Promise<Resource> {
    
    const resource = await this.resourceService.findByNationalId(nationalId)

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }
}
