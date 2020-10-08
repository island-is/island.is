import {
  Application,
  FormValue,
  validateAnswers,
} from '@island.is/application/core'
import { BadRequestException } from '@nestjs/common'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

export async function validateApplicationSchema(
  application: Pick<Application, 'typeId'>,
  newAnswers: FormValue,
) {
  const applicationTemplate = await getApplicationTemplateByTypeId(
    application.typeId,
  )
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
