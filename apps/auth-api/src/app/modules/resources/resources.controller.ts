import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    ValidationPipe,
    UseGuards
  } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiQuery, ApiOAuth2 } from '@nestjs/swagger'
import { IdentityResource } from './identity-resource.model'
import { ResourcesService } from './resources.service'
import { ApiScope } from './api-scope.model'
import { ApiResource } from './api-resource.model'
import { AuthGuard } from '@nestjs/passport'
  
@ApiOAuth2(['@identityserver.api/read'])
@UseGuards(AuthGuard('jwt'))
@ApiTags('resources')
  @Controller()
  export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) {}
  
    @Get('identity-resources')
    @ApiQuery({name: 'scopeNames', required: false})
    @ApiOkResponse({ type: IdentityResource, isArray: true })
    async FindIdentityResourcesByScopeName(@Query('scopeNames') scopeNames: string): Promise<IdentityResource[]> {

      const identityResources = await this.resourcesService.FindIdentityResourcesByScopeName(scopeNames ? scopeNames.split(',') : null) // TODO: Use ParseArrayPipe from v7
  
      return identityResources
    }
    
    @Get('api-scopes')
    @ApiQuery({name: 'scopeNames', required: false})
    @ApiOkResponse({ type: ApiScope, isArray: true })
    async FindApiScopesByNameAsync(@Query('scopeNames') scopeNames: string): Promise<ApiScope[]> {

      const apiScopes = await this.resourcesService.FindApiScopesByNameAsync(scopeNames ? scopeNames.split(',') : null) // TODO: Use ParseArrayPipe from v7
  
      return apiScopes
    }
    
    @Get('api-resources')
    @ApiQuery({name: 'apiResourceNames', required: false})
    @ApiQuery({name: 'apiScopeNames', required: false})
    @ApiOkResponse({ type: ApiResource, isArray: true })
    async FindApiResourcesByNameAsync(@Query('apiResourceNames') apiResourceNames: string, @Query('apiScopeNames') apiScopeNames: string): Promise<ApiResource[]> {

      if (apiResourceNames && apiScopeNames) {
        throw new Error('Specifying both apiResourceNames and apiScopeNames is not supported.')
      }

      if (apiResourceNames) {
        return await this.resourcesService.FindApiResourcesByNameAsync(apiResourceNames.split(',')) // TODO: Use ParseArrayPipe from v7
      } else {
        return await this.resourcesService.FindApiResourcesByScopeNameAsync(apiScopeNames ? apiScopeNames.split(',') : null) // TODO: Use ParseArrayPipe from v7
      }
    }
  }
