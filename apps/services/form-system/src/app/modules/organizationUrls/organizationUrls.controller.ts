import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { OrganizationUrlsService } from './organizationUrls.service'
import { OrganizationUrlDto } from './models/dto/organizationUrl.dto'
import { CreateOrganizationUrlDto } from './models/dto/createOrganizationUrl.dto'
import { UpdateOrganizationUrlDto } from './models/dto/updateOrganizationUrl.dto'

@ApiTags('organization urls')
@Controller({
  path: 'organizationUrls',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationUrlsController {
  constructor(private organizationUrlsService: OrganizationUrlsService) {}

  @ApiOperation({ summary: 'Add organization url' })
  @ApiCreatedResponse({
    description: 'Add organization url',
    type: OrganizationUrlDto,
  })
  @ApiBody({ type: CreateOrganizationUrlDto })
  @Post()
  create(
    @Body()
    createOrganizationUrlDto: CreateOrganizationUrlDto,
  ): Promise<OrganizationUrlDto> {
    return this.organizationUrlsService.create(createOrganizationUrlDto)
  }

  @ApiOperation({ summary: 'Update an organization url' })
  @ApiCreatedResponse({
    description: 'Update an organization url',
  })
  @ApiBody({ type: UpdateOrganizationUrlDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationUrlDto: UpdateOrganizationUrlDto,
  ): Promise<void> {
    return await this.organizationUrlsService.update(
      id,
      updateOrganizationUrlDto,
    )
  }

  @ApiOperation({ summary: 'Remove organization url' })
  @ApiNoContentResponse({
    description: 'Remove organization url',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.organizationUrlsService.delete(id)
  }
}
