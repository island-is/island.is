import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Audit } from '@island.is/nest/audit'

import { Resource } from './resource.model'
import { ResourceService } from './resource.service'
import { ResourceDto } from './dto/resource.dto'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

// Optionally for Scope authorization add ScopeGuard and then @Scopes(...) on each action
@UseGuards(IdsUserGuard)
@ApiTags('resource')
@Controller('resource')
@Audit()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // To use scope authorization and scopes should be defined in libs/auth/scopes
  // @Scopes(ResourceScope.Write)
  @Post()
  @ApiCreatedResponse({
    description: 'Creates a resource record.',
    type: Resource,
  })
  @Audit<Resource>({
    resources: (resource) => resource.id,
  })
  async create(@Body() resource: ResourceDto): Promise<Resource> {
    return await this.resourceService.create(resource)
  }

  // To use scope authorization and scopes should be defined in libs/auth/scopes
  // @Scopes(ResourceScope.Read)
  @Get(':nationalId')
  @ApiOkResponse({
    description: 'Finds one record using national id',
  })
  @Audit<Resource>({
    resources: (resource) => resource.id,
  })
  async findOne(@Param('nationalId') nationalId: string): Promise<Resource> {
    const resource = await this.resourceService.findByNationalId(nationalId)

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }
}
