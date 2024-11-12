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
import { FormCertificationTypesService } from './formCertificationTypes.service'
// import { FormCertificationDto } from './models/dto/formCertification.dto'
import { CreateFormCertificationTypeDto } from './models/dto/createFormCertificationType.dto'
import { CertificationType } from '../../dataTypes/certificationTypes/certificationType.model'

@ApiTags('form certification types')
@Controller({ path: 'formCertificationTypes', version: ['1', VERSION_NEUTRAL] })
export class FormCertificationTypesController {
  constructor(
    private readonly formCertificationTypesService: FormCertificationTypesService,
  ) {}

  @ApiOperation({ summary: 'Add form certification type' })
  @ApiCreatedResponse({
    description: 'Add form certification type',
    type: String,
  })
  @ApiBody({ type: CreateFormCertificationTypeDto })
  @Post()
  create(
    @Body() createFormCertificationTypeDto: CreateFormCertificationTypeDto,
  ): Promise<CertificationType> {
    return this.formCertificationTypesService.create(
      createFormCertificationTypeDto,
    )
  }

  @ApiOperation({ summary: 'Remove form certification type' })
  @ApiNoContentResponse({
    description: 'Remove form certification type',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formCertificationTypesService.delete(id)
  }
}
