import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { AccordionItemTag } from '@island.is/application/types'
import { editUnemploymentInfoDataSchema } from '../lib/dataSchema'

const missingTag: AccordionItemTag = {
  label: 'Vantar upplýsingar',
  variant: 'red',
}

type SchemaKey = keyof typeof editUnemploymentInfoDataSchema.shape

export const schemaSectionTag =
  (key: SchemaKey) =>
  (application: Application): AccordionItemTag | undefined => {
    const value = getValueViaPath(application.answers, key)
    const result = editUnemploymentInfoDataSchema.shape[key].safeParse(value)
    return result.success ? undefined : missingTag
  }

export const addressTag = schemaSectionTag('otherAddress')
export const passwordTag = schemaSectionTag('password')
export const bankAccountTag = schemaSectionTag('bankAccount')
export const jobWishesTag = schemaSectionTag('jobWishes')
export const driversLicenseTag = schemaSectionTag('licenses')
export const euresTag = schemaSectionTag('euresAgreement')
