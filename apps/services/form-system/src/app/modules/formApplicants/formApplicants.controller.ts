import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
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
import { FormApplicantsService } from './formApplicants.service'
import { FormApplicantDto } from './models/dto/formApplicant.dto'
import { CreateFormApplicantDto } from './models/dto/createFormApplicant.dto'
import { UpdateFormApplicantDto } from './models/dto/updateFormApplicant.dto'

@ApiTags('form applicants')
@Controller({ path: 'formApplicants', version: ['1', VERSION_NEUTRAL] })
export class FormApplicantsController {
  constructor(private readonly formApplicantsService: FormApplicantsService) {}

  @ApiOperation({ summary: 'Create new form applicant' })
  @ApiCreatedResponse({
    description: 'Create new form applicant',
    type: FormApplicantDto,
  })
  @ApiBody({ type: CreateFormApplicantDto })
  @Post()
  create(
    @Body() createFormApplicantDto: CreateFormApplicantDto,
  ): Promise<FormApplicantDto> {
    return this.formApplicantsService.create(createFormApplicantDto)
  }

  @ApiOperation({ summary: 'Update form applicant' })
  @ApiCreatedResponse({
    description: 'Update form applicant',
  })
  @ApiBody({ type: UpdateFormApplicantDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormApplicantDto: UpdateFormApplicantDto,
  ): Promise<void> {
    await this.formApplicantsService.update(id, updateFormApplicantDto)
  }

  @ApiOperation({ summary: 'Delete form applicant' })
  @ApiNoContentResponse({
    description: 'Delete form applicant',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formApplicantsService.delete(id)
  }
}
