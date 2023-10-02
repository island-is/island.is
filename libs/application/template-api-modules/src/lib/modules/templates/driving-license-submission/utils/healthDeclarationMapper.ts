import {
  PostTemporaryLicenseWithHealthDeclaration,
  HealthDeclarationModel,
} from '@island.is/clients/driving-license'
import { dataSchema } from '@island.is/application/templates/driving-license'
import { infer as zinfer } from 'zod'

export type DrivingLicenseSchema = zinfer<typeof dataSchema>

export const PostTemporaryLicenseWithHealthDeclarationMapper = (
  answers: DrivingLicenseSchema,
): PostTemporaryLicenseWithHealthDeclaration => {
  const propertyMapping: Record<
    string,
    keyof PostTemporaryLicenseWithHealthDeclaration
  > = {
    jurisdiction: 'authority',
    healthDeclaration: 'bringsHealthCertificate',
    willBringQualityPhoto: 'bringNewPhoto',
    // a: 'sendLicenseInMail',
    // b: 'sendToAddress',
    drivingInstructor: 'instructorSSN',
    email: 'email',
    phone: 'gsm',
  }

  const mappedAnswers: PostTemporaryLicenseWithHealthDeclaration = {
    authority: 0,
    bringsHealthCertificate: false,
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
          return [key, value]
        }
      }),
    )
  }

  for (const [key, value] of Object.entries(answers)) {
    if (key in propertyMapping) {
      const mappedKey = propertyMapping[
        key
      ] as keyof PostTemporaryLicenseWithHealthDeclaration
      ;(mappedAnswers[mappedKey] as any) = value
    } else if (key === 'healthDeclaration') {
      mappedAnswers.healthDeclaration = healthDeclarationMapper(
        answers['healthDeclaration'],
      )
    }
  }

  return mappedAnswers
}
