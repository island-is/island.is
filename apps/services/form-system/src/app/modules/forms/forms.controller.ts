import {
  Body,
  Controller,
  Delete,
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
  ApiNoContentResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FormsService } from './forms.service'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormResponseDto } from './models/dto/form.response.dto'
import { UpdateFormDto } from './models/dto/updateForm.dto'
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
  @ApiBody({ type: CreateFormDto })
  @Post()
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponseDto> {
    return await this.formsService.create(createFormDto)
  }

  @ApiOperation({ summary: 'Get all forms belonging to organization' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Get all forms belonging to organization',
  })
  @Get('organization')
  async findAll(
    @CurrentUser()
    user: User,
  ): Promise<FormResponseDto> {
    return await this.formsService.findAll(user)
  }

  @ApiOperation({ summary: 'Get form by idd' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Get form by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FormResponseDto> {
    return await this.formsService.findOne(id)
  }

  @ApiOperation({ summary: 'Update form' })
  @ApiCreatedResponse({
    description: 'Update form',
  })
  @ApiBody({ type: UpdateFormDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<void> {
    return await this.formsService.update(id, updateFormDto)
  }

  @ApiOperation({ summary: 'Change published form' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Change published form',
  })
  @ApiParam({ name: 'id', type: String })
  @Put('changePublished/:id')
  async changePublishedForm(@Param('id') id: string): Promise<FormResponseDto> {
    return await this.formsService.changePublished(id)
  }

  @ApiOperation({ summary: 'Publish form' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Publish form',
  })
  @ApiParam({ name: 'id', type: String })
  @Put('publish/:id')
  async publish(@Param('id') id: string): Promise<FormResponseDto> {
    return await this.formsService.publish(id)
  }

  @ApiOperation({ summary: 'Delete form' })
  @ApiNoContentResponse({
    description: 'Delete field',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.formsService.delete(id)
  }
}
