import { Application, FieldBaseProps } from '@island.is/application/types'
import { Routes } from './constants'
import {
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandPaging,
} from '@island.is/api/schema'
import { partialSchema } from './dataSchema'

export const InputFields = {
  [Routes.REQUIREMENTS]: {
    approveExternalData: 'requirements.approveExternalData',
  },
  [Routes.ADVERT]: {
    departmentId: 'advert.departmentId',
    typeName: 'advert.typeName',
    typeId: 'advert.typeId',
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
    regular: 'signatures.regular',
    committee: 'signatures.committee',
    additionalSignature: {
      regular: 'signatures.additionalSignature.regular',
      committee: 'signatures.additionalSignature.committee',
    },
  },
  [Routes.MISC]: {
    signatureType: 'misc.signatureType',
    selectedTemplate: 'misc.selectedTemplate',
  },
}

export const RequiredInputFieldsNames = {
  [Routes.ADVERT]: {
    departmentId: 'Deild',
    typeId: 'Tegund',
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
