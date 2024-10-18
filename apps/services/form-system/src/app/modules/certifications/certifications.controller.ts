import { Controller, Post, VERSION_NEUTRAL } from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { CertificationsService } from './certifications.service'
import { CertificationDto } from './models/dto/certification.dto'
import { CreateFormCertificationDto } from './models/dto/createFormCertification.dto'

@ApiTags('certifications')
@Controller({ path: 'certifications', version: ['1', VERSION_NEUTRAL] })
export class CertificationsController {
  // constructor(private readonly certificationsService: CertificationsService){}
  // @ApiOperation({summary: 'Add certification to the form'})
  // @ApiCreatedResponse({
  //   description: 'Add certification to the form',
  //   type: CertificationDto
  // })
  // @ApiBody({type: CreateFormCertificationDto})
  // @Post()
  // create(@Body()createFormCertificationDto: CreateFormCertificationDto,): Promise<FormCertifica
}
