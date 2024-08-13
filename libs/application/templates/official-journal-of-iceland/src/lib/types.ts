import { Application, FieldBaseProps } from '@island.is/application/types'
import { SIGNATURE_INDEX, MEMBER_INDEX, Routes } from './constants'
import {
  OfficialJournalOfIcelandAdvert,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandPaging,
} from '@island.is/api/schema'
import { partialSchema } from './dataSchema'

export const InputFields = {
  [Routes.REQUIREMENTS]: {
    approveExternalData: 'requirements.approveExternalData',
  },
  [Routes.ADVERT]: {
    departmentId: 'advert.department',
    typeId: 'advert.type',
    title: 'advert.title',
    html: 'advert.document',
    requestedDate: 'advert.requestedDate',
    categories: 'advert.categories',
    channels: 'advert.channels',
    message: 'advert.message',
  },
  [Routes.SIGNATURE]: {
    institution: `signature-${SIGNATURE_INDEX}.institution`,
    date: `signature-${SIGNATURE_INDEX}.date`,
    additonalSignature: 'signature.additonalSignature',
    chairman: {
      above: 'signature.chairman.above',
      name: 'signature.chairman.name',
      after: 'signature.chairman.after',
      below: 'signature.chairman.below',
    },
    members: {
      above: `signature-${SIGNATURE_INDEX}.member-${MEMBER_INDEX}.above`,
      name: `signature-${SIGNATURE_INDEX}.member-${MEMBER_INDEX}.name`,
      below: `signature-${SIGNATURE_INDEX}.member-${MEMBER_INDEX}.below`,
      after: `signature-${SIGNATURE_INDEX}.member-${MEMBER_INDEX}.after`,
    },
  },
}

export type LocalError = {
  type: string
  message: string
}

type Option = {
  id: string
  title: string
  slug: string
}

export type AdvertOption<Key extends string> = {
  [key in Key]: Array<Option>
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

type StatusProvider = 'success' | 'failure'

export type ErrorSchema = NestedType<partialSchema>

export interface ExternalData {
  departments: {
    data: AdvertOption<'departments'>
    date: string
    status: StatusProvider
  }
  types: {
    data: AdvertOption<'types'>
    date: string
    status: StatusProvider
  }
  submitApplication: {
    data: { application: OfficialJournalOfIcelandAdvert }
    date: string
    status: StatusProvider
  }
}

export type OJOIApplication = Override<
  Application,
  {
    answers: partialSchema
    externalData: ExternalData
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
