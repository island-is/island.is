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
import { OrganizationListTypesService } from './organizationListTypes.service'
import { OrganizationListTypeDto } from './models/dto/organizationListType.dto'
import { CreateOrganizationListTypeDto } from './models/dto/createOrganizationListType.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystemSuperUser)
@ApiTags('organization list types')
@Controller({
  path: 'organizationListTypes',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationListTypesController {
  constructor(
    private organizationListTypesService: OrganizationListTypesService,
  ) {}

  @ApiOperation({ summary: 'Add organization list type' })
  @ApiCreatedResponse({
    description: 'Add organization list type',
    type: OrganizationListTypeDto,
  })
  @ApiBody({ type: CreateOrganizationListTypeDto })
  @Post()
  create(
    @Body()
    createOrganizationListTypeDto: CreateOrganizationListTypeDto,
  ): Promise<OrganizationListTypeDto> {
    return this.organizationListTypesService.create(
      createOrganizationListTypeDto,
    )
  }

  @ApiOperation({ summary: 'Remove organization list type' })
  @ApiNoContentResponse({
    description: 'Remove organization list type',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.organizationListTypesService.delete(id)
  }
}
