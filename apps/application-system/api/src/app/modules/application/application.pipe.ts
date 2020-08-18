import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import {
  validateAnswers,
  FormValue,
  getFormByTypeId,
} from '@island.is/application/schema'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'

@Injectable()
export class ApplicationValidationPipe implements PipeTransform {
  constructor(private partialValidation: boolean) {}

  transform(application: CreateApplicationDto | UpdateApplicationDto) {
    const applicationForm = getFormByTypeId(application.typeId)
    if (applicationForm === null) {
      throw new BadRequestException(
        `No application form definition exists for type: ${application.typeId}`,
      )
    }
    const schemaFormValidation = validateAnswers(
      application.answers as FormValue,
      this.partialValidation,
      applicationForm.schema,
    )

    if (schemaFormValidation) {
      throw new BadRequestException(schemaFormValidation.message)
    }
    return application
  }
}
