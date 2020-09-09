import {
  FormType,
  FormValue,
  getFormByTypeId,
  validateAnswers,
} from '@island.is/application/template'
import { BadRequestException } from '@nestjs/common'

export function validateApplicationSchema(
  typeId: FormType,
  answers: FormValue,
  partialValidation: boolean,
): void {
  const applicationForm = getFormByTypeId(typeId)
  if (applicationForm === null) {
    throw new BadRequestException(
      `No application form definition exists for type: ${typeId}`,
    )
  }
  const schemaFormValidation = validateAnswers(
    answers,
    partialValidation,
    applicationForm.schema,
  )

  if (schemaFormValidation) {
    throw new BadRequestException(schemaFormValidation.message)
  }
}
