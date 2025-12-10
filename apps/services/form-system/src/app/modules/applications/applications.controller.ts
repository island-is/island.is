import {
  Body,
  Controller,
  Delete,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import { ApplicationResponseDto } from './models/dto/application.response.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'
import { MyPagesApplicationResponseDto } from './models/dto/myPagesApplication.response.dto'
import type { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard)
@ApiTags('applications')
@Controller({ path: 'applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({
    summary: 'Get all applications belonging to a user to display on my pages',
  })
  @ApiOkResponse({
    type: [MyPagesApplicationResponseDto],
    description:
      'Get all applications belonging to a user to display on my pages',
  })
  @ApiQuery({ name: 'locale', type: String, required: true })
  @Get('user')
  async findAllByUser(
    @Query('locale') locale: Locale,
    @CurrentUser()
    user: User,
  ): Promise<MyPagesApplicationResponseDto[]> {
    return await this.applicationsService.findAllByNationalId(locale, user)
  }

  @ApiOperation({ summary: 'Get all applications belonging to organization' })
  @ApiOkResponse({
    type: ApplicationResponseDto,
    description: 'Get all applications belonging to organization',
  })
  @ApiParam({ name: 'organizationNationalId', type: String })
  @Get('organization/:organizationNationalId')
  async findAllByOrganization(
    @Param('organizationNationalId') organizationNationalId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('isTest') isTest: boolean,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.findAllByOrganization(
      organizationNationalId,
      page,
      limit,
      isTest,
    )
  }

  @ApiOperation({ summary: 'Get an application by id' })
  @ApiOkResponse({
    description: 'Get an application by id',
    type: ApplicationResponseDto,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'slug', type: String })
  @Get(':slug/:id')
  async getApplication(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.getApplication(id, slug, user)
  }

  @ApiOperation({ summary: 'Create new application' })
  @ApiCreatedResponse({
    description: 'Create new application',
    type: ApplicationResponseDto,
  })
  @ApiParam({ name: 'slug', type: String })
  @ApiBody({ type: CreateApplicationDto })
  @Post(':slug')
  async create(
    @Param('slug') slug: string,
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.create(
      slug,
      createApplicationDto,
      user,
    )
  }

  @ApiOperation({
    summary: 'Get all unfinished applications of type slug belonging to user ',
  })
  @ApiOkResponse({
    type: ApplicationResponseDto,
    description:
      'Get all unfinished applications of type slug belonging to user ',
  })
  @ApiParam({ name: 'slug', type: String })
  @Get(':slug')
  async findAllBySlugAndUser(
    @Param('slug') slug: string,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.findAllBySlugAndUser(slug, user)
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
    type: ScreenValidationResponse,
  })
  @ApiParam({ name: 'screenId', type: String })
  @ApiBody({ type: ApplicationDto })
  @Post('submitScreen/:screenId')
  async submitScreen(
    @Param('screenId') screenId: string,
    @Body() applicationDto: ApplicationDto,
  ): Promise<ScreenValidationResponse> {
    return await this.applicationsService.submitScreen(screenId, applicationDto)
  }

  @ApiOperation({ summary: 'Save screen data' })
  @ApiCreatedResponse({
    description: 'Screen saved successfully',
    type: ScreenDto,
  })
  @ApiBody({ type: SubmitScreenDto })
  @Put('submitScreen/:screenId')
  async saveScreen(
    @Param('screenId') screenId: string,
    @Body() screenDto: SubmitScreenDto,
  ): Promise<ScreenDto> {
    return await this.applicationsService.saveScreen(screenId, screenDto)
  }

  @ApiOperation({ summary: 'Set section to completed' })
  @ApiCreatedResponse({
    description: 'Section set to completed successfully',
  })
  @Put('submitSection/:applicationId/:sectionId')
  async submitSection(
    @Param('applicationId') applicationId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.applicationsService.submitSection(applicationId, sectionId)
  }

  @ApiOperation({ summary: 'Delete an application by id' })
  @ApiNoContentResponse({
    description: 'Delete an application by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete('deleteApplication/:id')
  async deleteApplication(@Param('id') id: string): Promise<void> {
    return await this.applicationsService.deleteApplication(id)
  }
}
