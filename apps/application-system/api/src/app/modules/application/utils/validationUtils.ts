import {
  Application,
  ApplicationTemplateHelper,
  FormatMessage,
  FormValue,
  validateAnswers,
} from '@island.is/application/core'
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { Unwrap } from '@island.is/shared/types'
import { logger } from '@island.is/logging'
import { ValidationProblem } from '@island.is/nest/problem'

import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import { environment } from '../../../../environments'

const isRunningOnProductionEnvironment =
  environment.production === true &&
  environment.name !== 'local' &&
  environment.name !== 'dev' &&
  environment.name !== 'staging'

export async function validateThatApplicationIsReady(application: Application) {
  const applicationTemplate = await getApplicationTemplateByTypeId(
    application.typeId,
  )

  if (!applicationTemplate) {
    throw new BadRequestException(
      `No template exists for type: ${application.typeId}`,
    )
  }

  validateThatTemplateIsReady(applicationTemplate)
}

export function isTemplateReady(
  template: Pick<
    Unwrap<typeof getApplicationTemplateByTypeId>,
    'readyForProduction'
  >,
) {
  if (isRunningOnProductionEnvironment && !template.readyForProduction) {
    return false
  }

  return true
}

export function validateThatTemplateIsReady(
  template: Unwrap<typeof getApplicationTemplateByTypeId>,
) {
  if (!isTemplateReady(template)) {
    throw new BadRequestException(
      `Template ${template.type} is not ready for production`,
    )
  }
}

export async function validateApplicationSchema(
  application: Pick<Application, 'typeId'>,
  newAnswers: FormValue,
  formatMessage: FormatMessage,
) {
  const applicationTemplate = await getApplicationTemplateByTypeId(
    application.typeId,
  )

  if (applicationTemplate === null) {
    throw new BadRequestException(
      `No template exists for type: ${application.typeId}`,
    )
  }

  validateThatTemplateIsReady(applicationTemplate)

  const schemaFormValidationError = validateAnswers({
    dataSchema: applicationTemplate.dataSchema,
    answers: newAnswers,
    isFullSchemaValidation: false,
    formatMessage,
  })

  if (schemaFormValidationError) {
    logger.error('Failed to validate schema', schemaFormValidationError)
    throw new ValidationProblem(schemaFormValidationError)
  }
}

export async function validateIncomingAnswers(
  application: Application,
  newAnswers: FormValue | undefined,
  nationalId: string,
  isStrict = true,
  formatMessage: FormatMessage,
): Promise<FormValue> {
  if (!newAnswers) {
    return {}
  }

  const template = await getApplicationTemplateByTypeId(application.typeId)
  const role = template.mapUserToRole(nationalId, application)

  if (!role) {
    throw new UnauthorizedException(
      'Current user does not have a role in this application state',
    )
  }

  const helper = new ApplicationTemplateHelper(application, template)
  const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
    role,
  )

  let trimmedAnswers: FormValue

  if (writableAnswersAndExternalData === 'all') {
    trimmedAnswers = newAnswers
  } else {
    if (
      isStrict &&
      (!writableAnswersAndExternalData ||
        !writableAnswersAndExternalData?.answers)
    ) {
      throw new ForbiddenException(
        `Current user is not permitted to update answers in this state: ${application.state}`,
      )
    }

    const permittedAnswers = writableAnswersAndExternalData?.answers ?? []
    trimmedAnswers = {}
    const illegalAnswers: string[] = []

    Object.keys(newAnswers).forEach((key) => {
      if (permittedAnswers.indexOf(key) === -1) {
        illegalAnswers.push(key)
      } else {
        trimmedAnswers[key] = newAnswers[key]
      }
    })

    if (isStrict && illegalAnswers.length > 0) {
      throw new ForbiddenException(
        `Current user is not permitted to update the following answers: ${illegalAnswers.toString()}`,
      )
    }
  }

  try {
    const errorMap = await helper.applyAnswerValidators(
      newAnswers,
      formatMessage,
    )
    if (errorMap) {
      throw new ValidationProblem(errorMap)
    }
  } catch (error) {
    logger.error('Failed to validate answers', error)
    throw error
  }

  return trimmedAnswers
}

export async function validateIncomingExternalDataProviders(
  application: Application,
  providerDto: PopulateExternalDataDto,
  nationalId: string,
) {
  const { dataProviders } = providerDto
  if (!dataProviders.length) {
    return
  }
  const template = await getApplicationTemplateByTypeId(application.typeId)
  const role = template.mapUserToRole(nationalId, application)
  if (!role) {
    throw new UnauthorizedException(
      'Current user does not have a role in this application state',
    )
  }
  const helper = new ApplicationTemplateHelper(application, template)
  const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
    role,
  )
  if (writableAnswersAndExternalData === 'all') {
    return
  }
  if (
    !writableAnswersAndExternalData ||
    !writableAnswersAndExternalData?.externalData
  ) {
    throw new BadRequestException(
      `Current user is not permitted to update external data in this state: ${application.state}`,
    )
  }
  const permittedDataProviders = writableAnswersAndExternalData.externalData

  const illegalDataProviders: string[] = []

  dataProviders.forEach(({ id }) => {
    if (permittedDataProviders.indexOf(id) === -1) {
      illegalDataProviders.push(id)
    }
  })
  if (illegalDataProviders.length > 0) {
    throw new BadRequestException(
      `Current user is not permitted to update the following data providers: ${illegalDataProviders.toString()}`,
    )
  }
}
