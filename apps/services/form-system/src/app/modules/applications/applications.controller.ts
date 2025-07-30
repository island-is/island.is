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
import { ApplicationResponseDto } from './models/dto/application.response.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'

@UseGuards(IdsUserGuard)
@ApiTags('applications')
@Controller({ path: 'applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @ApiOperation({ summary: 'Get an application by id' })
  @ApiOkResponse({
    description: 'Get an application by id',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'id', type: String })
  @Get(
    'form/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})',
  )
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
    @Query('isTest') isTest: boolean,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.findAllBySlugAndUser(
      slug,
      user,
      isTest,
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

  // @ApiOperation({ summary: 'Get all applications by user and formId' })
  // @ApiOkResponse({
  //   type: ApplicationResponseDto,
  //   description: 'Get all applications by user and formId',
  // })
  // @ApiParam({ name: 'formId', type: String })
  // @Get('nationalId/:nationalId/formId/:formId')
  // async findAllByUserAndFormId(
  //   @Param('formId') formId: string,
  //   @CurrentUser()
  //   user: User,
  // ): Promise<ApplicationResponseDto> {
  //   return await this.applicationsService.findAllByUserAndFormId(user, formId)
  // }
}
