import {
  Body,
  Controller,
  Delete,
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
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FormApplicantTypesService } from './formApplicantTypes.service'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import { UpdateFormApplicantTypeDto } from './models/dto/updateFormApplicantType.dto'
import { FormApplicantTypeDto } from './models/dto/formApplicantType.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('form applicant types')
@Controller({ path: 'formApplicantTypes', version: ['1', VERSION_NEUTRAL] })
export class FormApplicantTypesController {
  constructor(
    private readonly formApplicantTypesService: FormApplicantTypesService,
  ) {}

  @ApiOperation({ summary: 'Add form applicant type' })
  @ApiCreatedResponse({
    description: 'Add form applicant type',
    type: FormApplicantTypeDto,
  })
  @ApiBody({ type: CreateFormApplicantTypeDto })
  @Post()
  create(
    @Body() createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<FormApplicantTypeDto> {
    return this.formApplicantTypesService.create(createFormApplicantTypeDto)
  }

  @ApiOperation({ summary: 'Update form applicant' })
  @ApiNoContentResponse({
    description: 'Update form applicant',
  })
  @ApiBody({ type: UpdateFormApplicantTypeDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormApplicantTypeDto: UpdateFormApplicantTypeDto,
  ): Promise<void> {
    await this.formApplicantTypesService.update(id, updateFormApplicantTypeDto)
  }

  @ApiOperation({ summary: 'Delete form applicant' })
  @ApiNoContentResponse({
    description: 'Delete form applicant',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formApplicantTypesService.delete(id)
  }
}
