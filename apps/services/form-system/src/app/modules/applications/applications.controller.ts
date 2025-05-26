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
  User,
} from '@island.is/auth-nest-tools'
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
    type: ScreenValidationResponse,
  })
  @ApiParam({ name: 'screenId', type: String })
  @ApiBody({ type: ApplicationDto })
  @Post('submitScreen/:screenId')
  async submitScreen(
    @Param('screenId') screenId: string,
    @Body() applicationDto: ApplicationDto,
  ): Promise<ScreenValidationResponse> {
    console.log('application', JSON.stringify(applicationDto, null, 2))
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

  // Not sure whether this is needed or whether we should try to fix the issues we were having.....
  // @ApiOperation({
  //   summary: 'Get all applications of the same type belonging to user',
  // })
  // @ApiOkResponse({
  //   type: ApplicationListDto,
  //   description: 'Get all applications of the same type belonging to user',
  // })
  // @ApiParam({ name: 'formId', type: String })
  // @Get('form/:formId')
  // async findAllByTypeAndUser(
  //   @Param('formId') formId: string,
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('isTest') isTest: boolean,
  //   @CurrentUser()
  //   user: User,
  // ): Promise<ApplicationListDto> {
  //   return await this.applicationsService.findAllByTypeAndUser(
  //     formId,
  //     page,
  //     limit,
  //     isTest,
  //   )
  // }

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
}
