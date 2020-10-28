import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiOAuth2,
} from '@nestjs/swagger'
import {
  IdentityResource,
  ResourcesService,
  ApiScope,
  ApiResource,
  ApiScopesDTO,
  IdentityResourcesDTO,
} from '@island.is/auth-api-lib'
import { AuthGuard } from '@nestjs/passport'

@ApiOAuth2(['@identityserver.api/read'])
@UseGuards(AuthGuard('jwt'))
@ApiTags('resources')
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('identity-resources')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  async FindIdentityResourcesByScopeName(
    @Query('scopeNames') scopeNames: string,
  ): Promise<IdentityResource[]> {
    const identityResources = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return identityResources
  }

  @Get('api-scopes')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  async FindApiScopesByNameAsync(
    @Query('scopeNames') scopeNames: string,
  ): Promise<ApiScope[]> {
    const apiScopes = await this.resourcesService.findApiScopesByNameAsync(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return apiScopes
  }

  @Get('api-resources')
  @ApiQuery({ name: 'apiResourceNames', required: false })
  @ApiQuery({ name: 'apiScopeNames', required: false })
  @ApiOkResponse({ type: ApiResource, isArray: true })
  async FindApiResourcesByNameAsync(
    @Query('apiResourceNames') apiResourceNames: string,
    @Query('apiScopeNames') apiScopeNames: string,
  ): Promise<ApiResource[]> {
    if (apiResourceNames && apiScopeNames) {
      throw new Error(
        'Specifying both apiResourceNames and apiScopeNames is not supported.',
      )
    }

    if (apiResourceNames) {
      return await this.resourcesService.findApiResourcesByNameAsync(
        apiResourceNames.split(','),
      ) // TODO: Check if we can use ParseArrayPipe from v7
    } else {
      return await this.resourcesService.findApiResourcesByScopeNameAsync(
        apiScopeNames ? apiScopeNames.split(',') : null,
      ) // TODO: Check if we can use ParseArrayPipe from v7
    }
  }

  @Post('identity-resource')
  @ApiCreatedResponse({ type: IdentityResource })
  async createIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    return await this.resourcesService.createIdentityResource(identityResource)
  }

  @Put('identity-resource/:name')
  @ApiOkResponse({ type: IdentityResource })
  async updateIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
    @Param('name') name: string,
  ): Promise<IdentityResource> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.updateIdentityResource(
      identityResource,
      name,
    )
  }

  @Delete('identity-resource/:id')
  @ApiOkResponse()
  async deleteIdentityResource(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteIdentityResource(name)
  }

  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  async createApiScope(@Body() apiScope: ApiScopesDTO): Promise<ApiScope> {
    return await this.resourcesService.createApiScope(apiScope)
  }

  @Put('api-scope/:name')
  @ApiOkResponse({ type: ApiScope })
  async updateApiScope(
    @Body() apiScope: ApiScopesDTO,
    @Param('name') name: string,
  ): Promise<ApiScope> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.updateApiScope(apiScope, name)
  }

  @Delete('api-scope/:id')
  @ApiOkResponse()
  async deleteApiScope(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteApiScope(name)
  }
}
