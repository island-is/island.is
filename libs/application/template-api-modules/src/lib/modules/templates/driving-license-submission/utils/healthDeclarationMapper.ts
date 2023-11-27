import {
  PostTemporaryLicenseWithHealthDeclaration,
  HealthDeclarationModel,
} from '@island.is/clients/driving-license'
import { dataSchema } from '@island.is/application/templates/driving-license'
import { infer as zinfer } from 'zod'

import { removeCountryCode } from './'

export type DrivingLicenseSchema = zinfer<typeof dataSchema>

export const PostTemporaryLicenseWithHealthDeclarationMapper = (
  answers: DrivingLicenseSchema,
): PostTemporaryLicenseWithHealthDeclaration => {
  const propertyMapping: Record<
    string,
    keyof PostTemporaryLicenseWithHealthDeclaration
  > = {
    jurisdiction: 'authority',
    willBringQualityPhoto: 'bringNewPhoto',
    drivingInstructor: 'instructorSSN',
    email: 'email',
    phone: 'gsm',
  }

  const mappedAnswers: PostTemporaryLicenseWithHealthDeclaration = {
    authority: 0,
    bringsHealthCertificate: true,
    bringNewPhoto: false,
    sendLicenseInMail: false,
    sendToAddress: null,
    instructorSSN: '',
    email: null,
    gsm: null,
    healthDeclaration: {},
  }

  const healthDeclarationMapper = (
    answers: DrivingLicenseSchema['healthDeclaration'],
  ): HealthDeclarationModel => {
    return Object.fromEntries(
      Object.entries(answers).map(([key, value]) => {
        if (value === 'yes') {
          return [key, true]
        } else if (value === 'no') {
          return [key, false]
        } else {
          return [key, false]
        }
      }),
    )
  }

  for (const key in answers) {
    if (key in propertyMapping) {
      let value = answers[key as keyof DrivingLicenseSchema]
      if (key === 'phone') {
        value = typeof value === 'string' ? removeCountryCode(value) : value
      }
      const mappedKey = propertyMapping[
        key
      ] as keyof PostTemporaryLicenseWithHealthDeclaration
      const mappedValue =
        value === 'yes' ? true : value === 'no' ? false : value
      ;(mappedAnswers[
        mappedKey
      ] as DrivingLicenseSchema[keyof DrivingLicenseSchema]) = mappedValue
    } else if (key === 'healthDeclaration') {
      mappedAnswers.healthDeclaration = healthDeclarationMapper(
        answers['healthDeclaration'],
      )
    }
  }

  return mappedAnswers
}
