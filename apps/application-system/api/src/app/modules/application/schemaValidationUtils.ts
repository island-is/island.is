import {
  Application,
  FormValue,
  getApplicationTemplateByTypeId,
  validateAnswers,
} from '@island.is/application/template'
import { BadRequestException } from '@nestjs/common'

export function validateApplicationSchema(
  application: Application,
  newAnswers: FormValue,
): void {
  const applicationTemplate = getApplicationTemplateByTypeId(application.typeId)
  if (applicationTemplate === null) {
    throw new BadRequestException(
      `No template exists for type: ${application.typeId}`,
    )
  }
  const schemaFormValidation = validateAnswers(
    newAnswers,
    true,
    applicationTemplate.dataSchema,
  )

  if (schemaFormValidation) {
    throw new BadRequestException(schemaFormValidation.message)
  }
}
