import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    ValidationPipe
  } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger'
import { IdentityResource } from './identity-resource.model'
import { ResourcesService } from './resources.service'
import { ApiScope } from './api-scope.model'
  
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

      const identityResources = await this.resourcesService.FindApiScopesByNameAsync(scopeNames ? scopeNames.split(',') : null) // TODO: Use ParseArrayPipe from v7
  
      return identityResources
    }
  }
