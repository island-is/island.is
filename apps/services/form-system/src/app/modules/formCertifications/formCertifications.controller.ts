import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
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
import { FormCertificationsService } from './formCertifications.service'
import { FormCertificationDto } from './models/dto/formCertification.dto'
import { CreateFormCertificationDto } from './models/dto/createFormCertification.dto'

@ApiTags('form certifications')
@Controller({ path: 'formCertifications', version: ['1', VERSION_NEUTRAL] })
export class FormCertificationsController {
  constructor(
    private readonly formCertificationsService: FormCertificationsService,
  ) {}

  @ApiOperation({ summary: 'Create new form certification' })
  @ApiCreatedResponse({
    description: 'Create new form certification',
    type: FormCertificationDto,
  })
  @ApiBody({ type: CreateFormCertificationDto })
  @Post()
  create(
    @Body() createFormCertificationDto: CreateFormCertificationDto,
  ): Promise<FormCertificationDto> {
    return this.formCertificationsService.create(createFormCertificationDto)
  }

  @ApiOperation({ summary: 'Delete form certification' })
  @ApiNoContentResponse({
    description: 'Delete form certification',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formCertificationsService.delete(id)
  }
}
