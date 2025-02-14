import { Application, FieldBaseProps } from '@island.is/application/types'
import { Routes } from './constants'
import {
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandPaging,
} from '@island.is/api/schema'
import {
  memberItemSchema,
  partialSchema,
  regularSignatureItemSchema,
  signatureValidationSchema,
} from './dataSchema'
import { z } from 'zod'

export const InputFields = {
  [Routes.REQUIREMENTS]: {
    approveExternalData: 'requirements.approveExternalData',
  },
  [Routes.ADVERT]: {
    department: 'advert.department',
    mainType: 'advert.mainType',
    type: 'advert.type',
    title: 'advert.title',
    html: 'advert.html',
    requestedDate: 'advert.requestedDate',
    categories: 'advert.categories',
    channels: 'advert.channels',
    message: 'advert.message',
    involvedPartyId: 'advert.involvedPartyId',
    additions: 'advert.additions',
  },
  [Routes.SIGNATURE]: {
    regular: 'signature.regular',
    committee: 'signature.committee',
  },
  [Routes.MISC]: {
    signatureType: 'misc.signatureType',
    selectedTemplate: 'misc.selectedTemplate',
    asDocument: 'misc.asDocument',
    asRoman: 'misc.asRoman',
  },
}

export const RequiredInputFieldsNames = {
  [Routes.ADVERT]: {
    department: 'Deild',
    type: 'Tegund',
    title: 'Titill',
    html: 'Auglýsing',
    requestedDate: 'Útgáfudagur',
    categories: 'Efnisflokkar',
  },
}

export enum TemplateApiActions {
  departments = 'getDepartments',
  types = 'getAdvertTypes',
  postApplication = 'postApplication',
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ErrorSchema = NestedType<partialSchema>

export type OJOIApplication = Override<
  Application,
  {
    answers: partialSchema
  }
>

export type Answers = OJOIApplication['answers']

export type Signature = z.infer<typeof signatureValidationSchema>
export type SignatureItem = z.infer<typeof regularSignatureItemSchema>
export type SignatureMember = z.infer<typeof memberItemSchema>

export type OJOIFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: OJOIApplication
    errors: ErrorSchema
  }
>

export type CreateParentKey<Key extends string> =
  `officialJournalOfIceland${Capitalize<Key>}`

export type OfficialJournalOfIcelandGraphqlResponse<
  Key extends string,
  Value = OfficialJournalOfIcelandAdvertEntity[],
> = {
  [key in CreateParentKey<Key>]: {
    [key in Key]: Value
  } & {
    paging: OfficialJournalOfIcelandPaging
  }
}
