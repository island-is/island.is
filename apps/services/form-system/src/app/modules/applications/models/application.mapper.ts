import { Injectable } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationMapper {
  mapFormToApplicationDto(form: Form): ApplicationDto {
    return new ApplicationDto()
  }
}
