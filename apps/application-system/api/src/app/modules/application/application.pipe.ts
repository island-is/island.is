import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import {
  areAnswersValid,
  FormValue,
  getFormByTypeId,
} from '@island.is/application/schema'
import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationValidationPipe implements PipeTransform {
  constructor(private partialValidation: boolean) {}

  transform(application: ApplicationDto) {
    const applicationForm = getFormByTypeId(application.typeId)
    if (applicationForm === null) {
      throw new BadRequestException(
        `No application form definition exists for type: ${application.typeId}`,
      )
    }
    const schemaFormValidation = areAnswersValid(
      application.answers as FormValue,
      this.partialValidation,
      applicationForm.schema,
    )

    if (schemaFormValidation) {
      throw new BadRequestException(schemaFormValidation.message)
    }
  }
}
