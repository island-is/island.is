import {
  Application,
  ApplicationTemplateHelper,
  FormValue,
  validateAnswers,
} from '@island.is/application/core'
import {
  BadRequestException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common'

import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import { environment } from '../../../../environments'

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
  } else if (
    environment.environment === 'production' &&
    !applicationTemplate.readyForProduction
  ) {
    throw new BadRequestException(
      `Template ${application.typeId} is not ready for production`,
    )
  }
  const schemaFormValidationError = validateAnswers(
    applicationTemplate.dataSchema,
    newAnswers,
    false,
  )

  if (schemaFormValidationError) {
    // TODO improve error message
    throw new HttpException(`Schema validation has failed`, 403)
  }
}

export async function validateIncomingAnswers(
  application: Application,
  newAnswers: FormValue | undefined,
  nationalId: string,
  isStrict = true,
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
      throw new HttpException(
        `Current user is not permitted to update answers in this state: ${application.state}`,
        403,
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
      throw new HttpException(
        `Current user is not permitted to update the following answers: ${illegalAnswers.toString()}`,
        403,
      )
    }
  }

  try {
    await helper.applyAnswerValidators(newAnswers)
  } catch (error) {
    throw new HttpException(error, 403)
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
