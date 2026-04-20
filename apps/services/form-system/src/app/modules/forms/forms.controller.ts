import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FormsService } from './forms.service'
import { FormResponseDto } from './models/dto/form.response.dto'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import {
  UpdateFormResponse,
  UpdateFormStatusDto,
} from '@island.is/form-system/shared'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('forms')
@Controller({ path: 'forms', version: ['1', VERSION_NEUTRAL] })
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Create new form' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Create new form',
  })
  @ApiParam({ name: 'organizationNationalId', type: String })
  @Post(':organizationNationalId')
  async create(
    @CurrentUser() user: User,
    @Param('organizationNationalId') organizationNationalId: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.create(user, organizationNationalId)
  }

  @ApiOperation({ summary: 'Get all forms belonging to organization' })
  @ApiOkResponse({
    type: FormResponseDto,
    description: 'Get all forms belonging to organization',
  })
  @ApiParam({ name: 'nationalId', type: String })
  @Get('organization/:nationalId')
  async findAll(
    @CurrentUser()
    user: User,
    @Param('nationalId') nationalId: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.findAll(user, nationalId)
  }

  @ApiOperation({ summary: 'Get form by id' })
  @ApiOkResponse({
    type: FormResponseDto,
    description: 'Get form by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.findOne(user, id)
  }

  @ApiOperation({ summary: 'Update form status' })
  @ApiOkResponse({
    type: FormResponseDto,
    description: 'Update form status',
  })
  @ApiBody({ type: UpdateFormStatusDto })
  @ApiParam({ name: 'id', type: String })
  @Put('updateStatus/:id')
  async updateStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateFormStatusDto: UpdateFormStatusDto,
  ): Promise<FormResponseDto> {
    return await this.formsService.updateStatus(user, id, updateFormStatusDto)
  }

  @ApiOperation({ summary: 'Copy form' })
  @ApiOkResponse({
    type: FormResponseDto,
    description: 'Copy form',
  })
  @ApiParam({ name: 'id', type: String })
  @Put('copy/:id')
  async copy(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.copy(user, id)
  }

  @ApiOperation({ summary: 'Update form' })
  @ApiOkResponse({
    type: UpdateFormResponse,
    description: 'Update form',
  })
  @ApiBody({ type: UpdateFormDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async updateForm(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<UpdateFormResponse> {
    return await this.formsService.update(user, id, updateFormDto)
  }
}
