import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
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
} from '@island.is/auth-api'
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
    ) // TODO: Use ParseArrayPipe from v7

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
    ) // TODO: Use ParseArrayPipe from v7

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
      ) // TODO: Use ParseArrayPipe from v7
    } else {
      return await this.resourcesService.findApiResourcesByScopeNameAsync(
        apiScopeNames ? apiScopeNames.split(',') : null,
      ) // TODO: Use ParseArrayPipe from v7
    }
  }

  @Post('identity-resource')
  @ApiCreatedResponse({ type: IdentityResource })
  async createIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    return await this.resourcesService.createIdentityResource(identityResource)
  }

  // @Put('identity-resource/:id')
  // @ApiOkResponse({ type: IdentityResource })
  // async updateIdentityResource(
  //   @Body() identityResource: IdentityResourcesDTO,
  //   @Param('id') id: string,
  // ): Promise<IdentityResource> {
  //   return await this.resourcesService.updateIdentityResource(
  //     identityResource,
  //     id,
  //   )
  // }

  // @Delete('identity-resource/:id')
  // @ApiOkResponse()
  // async deleteIdentityResource(@Param('id') id: string): Promise<number> {
  //   return await this.resourcesService.deleteIdentityResource(id)
  // }

  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  async createApiScope(@Body() apiScope: ApiScopesDTO): Promise<ApiScope> {
    return await this.resourcesService.createApiScope(apiScope)
  }

  // @Put('api-scope/:id')
  // @ApiOkResponse({ type: ApiScope })
  // async updateApiScope(
  //   @Body() apiScope: ApiScopesDTO,
  //   @Param('id') id: string,
  // ): Promise<ApiScope> {
  //   return await this.resourcesService.updateApiScope(apiScope, id)
  // }

  // @Delete('api-scope/:id')
  // @ApiOkResponse()
  // async deleteApiScope(@Param('id') id: string): Promise<number> {
  //   return await this.resourcesService.deleteApiScope(id)
  // }
}
