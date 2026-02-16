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
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import { ApplicationResponseDto } from './models/dto/application.response.dto'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'
import { MyPagesApplicationResponseDto } from './models/dto/myPagesApplication.response.dto'
import type { Locale } from '@island.is/shared/types'
import { SubmitApplicationResponseDto } from './models/dto/submitApplication.response.dto'
import { NotificationResponseDto } from './models/dto/validation.response.dto'
import { NotificationRequestDto } from './models/dto/notification.dto'

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

  @ApiOperation({ summary: 'Send notification to external system' })
  @ApiOkResponse({
    description: 'Send notification to external system',
    type: NotificationResponseDto,
  })
  @ApiBody({ type: NotificationRequestDto })
  @Post('notify')
  async notify(
    @Body() notificationRequestDto: NotificationRequestDto,
    @CurrentUser() user: User,
  ): Promise<NotificationResponseDto> {
    return await this.applicationsService.notifyExternalService(
      notificationRequestDto.notificationDto,
      notificationRequestDto.url,
      user,
    )
  }

  @ApiOperation({ summary: 'Create new application' })
  @ApiCreatedResponse({
    description: 'Create new application',
    type: ApplicationResponseDto,
  })
  @ApiParam({ name: 'slug', type: String })
  @Post(':slug')
  async create(
    @Param('slug') slug: string,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationResponseDto> {
    return await this.applicationsService.create(slug, user)
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

  @ApiOperation({ summary: 'Save screen data' })
  @ApiNoContentResponse({
    description: 'Screen saved successfully',
  })
  @ApiBody({ type: SubmitScreenDto })
  @Put('submitScreen')
  async saveScreen(
    @Body() screenDto: SubmitScreenDto,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    await this.applicationsService.saveScreen(screenDto, user)
  }

  @ApiOperation({
    summary: 'Update application dependencies and completed array',
  })
  @ApiNoContentResponse({
    description: 'Update application dependencies and completed array',
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
  @ApiOkResponse({
    type: SubmitApplicationResponseDto,
    description: 'Submit application',
  })
  @ApiParam({ name: 'id', type: String })
  @Post('submit/:id')
  async submit(@Param('id') id: string): Promise<SubmitApplicationResponseDto> {
    return await this.applicationsService.submit(id)
  }

  @ApiOperation({ summary: 'Delete an application by id' })
  @ApiNoContentResponse({
    description: 'Delete an application by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete('deleteApplication/:id')
  async deleteApplication(
    @Param('id') id: string,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    return await this.applicationsService.deleteApplication(id, user)
  }
}
