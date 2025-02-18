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
import { OrganizationCertificationTypesService } from './organizationCertificationTypes.service'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  CreateOrganizationCertificationTypeDto,
  OrganizationCertificationTypeDto,
} from '@island.is/form-system-dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystemSuperUser)
@ApiTags('organization certification types')
@Controller({
  path: 'organizationCertificationTypes',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationCertificationTypesController {
  constructor(
    private organizationCertificationTypesService: OrganizationCertificationTypesService,
  ) {}

  @ApiOperation({ summary: 'Add organization certification type' })
  @ApiCreatedResponse({
    description: 'Add organization certification type',
    type: OrganizationCertificationTypeDto,
  })
  @ApiBody({ type: CreateOrganizationCertificationTypeDto })
  @Post()
  create(
    @Body()
    createOrganizationCertificationTypeDto: CreateOrganizationCertificationTypeDto,
  ): Promise<OrganizationCertificationTypeDto> {
    return this.organizationCertificationTypesService.create(
      createOrganizationCertificationTypeDto,
    )
  }

  @ApiOperation({ summary: 'Remove organization certification type' })
  @ApiNoContentResponse({
    description: 'Remove organization certification type',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.organizationCertificationTypesService.delete(id)
  }
}
