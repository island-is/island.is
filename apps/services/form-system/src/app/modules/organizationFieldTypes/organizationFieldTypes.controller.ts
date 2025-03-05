import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
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
import { OrganizationFieldTypesService } from './organizationFieldTypes.service'
import { OrganizationFieldTypeDto } from './models/dto/organizationFieldType.dto'
import { CreateOrganizationFieldTypeDto } from './models/dto/createOrganizationFieldType.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystemAdmin)
@ApiTags('organization field types')
@Controller({
  path: 'organizationFieldTypes',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationFieldTypesController {
  constructor(
    private organizationFieldTypesService: OrganizationFieldTypesService,
  ) {}

  @ApiOperation({ summary: 'Add organization field type' })
  @ApiCreatedResponse({
    description: 'Add organization field type',
    type: OrganizationFieldTypeDto,
  })
  @ApiBody({ type: CreateOrganizationFieldTypeDto })
  @Post()
  create(
    @Body()
    createOrganizationFieldTypeDto: CreateOrganizationFieldTypeDto,
  ): Promise<OrganizationFieldTypeDto> {
    return this.organizationFieldTypesService.create(
      createOrganizationFieldTypeDto,
    )
  }

  @ApiOperation({ summary: 'Remove organization field type' })
  @ApiNoContentResponse({
    description: 'Remove organization field type',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.organizationFieldTypesService.delete(id)
  }
}
