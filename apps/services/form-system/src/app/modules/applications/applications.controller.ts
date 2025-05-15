import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import { ApplicationListDto } from './models/dto/applicationList.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@ApiTags('applications')
@Controller({ path: 'applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Get an application by id' })
  @ApiOkResponse({
    description: 'Get an application by id',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getApplication(@Param('id') id: string): Promise<ApplicationDto> {
    return await this.applicationsService.getApplication(id)
  }

  @ApiOperation({ summary: 'Create new application' })
  @ApiCreatedResponse({
    description: 'Create new application',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'slug', type: String })
  @ApiBody({ type: CreateApplicationDto })
  @Post(':slug')
  async create(
    @Param('slug') slug: string,
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationDto> {
    return await this.applicationsService.create(
      slug,
      createApplicationDto,
      user,
    )
  }

  @ApiOperation({ summary: 'Update application dependencies' })
  @ApiNoContentResponse({
    description: 'Update application dependencies',
  })
  @ApiBody({ type: UpdateApplicationDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<void> {
    await this.applicationsService.update(id, updateApplicationDto)
  }

  @ApiOperation({ summary: 'Submit application' })
  @ApiNoContentResponse({
    description: 'Submit application',
  })
  @ApiParam({ name: 'id', type: String })
  @Post('submit/:id')
  async submit(@Param('id') id: string): Promise<void> {
    await this.applicationsService.submit(id)
  }

  @ApiOperation({ summary: 'validate and save input values of a screen' })
  @ApiCreatedResponse({
    description: 'validate and save input values of a screen',
  })
  @ApiParam({ name: 'screenId', type: String })
  @ApiBody({ type: ApplicationDto })
  @Post('/submitScreen:screenId')
  async submitScreen(
    @Param('screenId') screenId: string,
    @Body() applicationDto: ApplicationDto,
  ): Promise<ScreenValidationResponse> {
    return await this.applicationsService.submitScreen(screenId, applicationDto)
  }

  @ApiOperation({ summary: 'Get all applications belonging to organization' })
  @ApiOkResponse({
    type: ApplicationListDto,
    description: 'Get all applications belonging to organization',
  })
  @ApiParam({ name: 'organizationId', type: String })
  @Get('organization/:organizationId')
  async findAllByOrganization(
    @Param('organizationId') organizationId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('isTest') isTest: boolean,
  ): Promise<ApplicationListDto> {
    return await this.applicationsService.findAllByOrganization(
      organizationId,
      page,
      limit,
      isTest,
    )
  }
}
