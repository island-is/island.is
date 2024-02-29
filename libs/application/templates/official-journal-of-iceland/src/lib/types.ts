import { Application, FieldBaseProps } from '@island.is/application/types'
import { type answerSchemas } from './dataSchema'
import { INSTITUTION_INDEX, MEMBER_INDEX, Routes } from './constants'
import {
  MinistryOfJusticeAdvert,
  MinistryOfJusticeAdvertEntity,
  MinistryOfJusticePaging,
} from '@island.is/api/schema'

export const InputFields = {
  [Routes.TEST]: {
    name: 'test.name',
    department: 'test.department',
    job: 'test.job',
  },
  [Routes.REQUIREMENTS]: {
    approveExternalData: 'requirements.approveExternalData',
  },
  [Routes.ADVERT]: {
    department: 'advert.department',
    type: 'advert.type',
    subType: 'advert.subType',
    title: 'advert.title',
    template: 'advert.template',
    document: 'advert.document',
  },
  [Routes.SIGNATURE]: {
    type: 'signature.type',
    contents: 'signature.contents',
    regular: {
      institution: `signature.regular-${INSTITUTION_INDEX}.institution`,
      date: `signature.regular-${INSTITUTION_INDEX}.date`,
      members: {
        above: `signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.above`,
        name: `signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.name`,
        below: `signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.below`,
        after: `signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.after`,
      },
    },
    committee: {
      institution: 'signature.committee.institution',
      date: 'signature.committee.date',
      chairman: {
        above: 'signature.committee.chairman.above',
        name: 'signature.committee.chairman.name',
        after: 'signature.committee.chairman.after',
        below: 'signature.committee.chairman.below',
      },
      members: {
        name: `signature.committee.members-${MEMBER_INDEX}.name`,
        below: `signature.committee.members-${MEMBER_INDEX}.below`,
      },
    },
    additonalSignature: 'signature.additonalSignature',
  },
  [Routes.ATTACHMENTS]: {
    files: 'additionsAndDocuments.files',
    fileNames: 'additionsAndDocuments.fileNames',
  },
  [Routes.ORIGINAL]: {
    files: 'original.files',
  },
  [Routes.PUBLISHING]: {
    date: 'publishing.date',
    fastTrack: 'publishing.fastTrack',
    contentCategories: 'publishing.contentCategories',
    communicationChannels: 'publishing.communicationChannels',
    message: 'publishing.message',
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

export type SignatureType = 'regular' | 'committee'

export type RegularSignatureState = NonNullable<
  answerSchemas['signature']['regular']
>
export type CommitteeSignatureState = NonNullable<
  answerSchemas['signature']['committee']
>

export enum TemplateApiActions {
  departments = 'departments',
  types = 'types',
  submitApplication = 'submitApplication',
  validateAdvert = 'validateAdvert',
  cancelApplication = 'cancelApplication',
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

type StatusProvider = 'success' | 'failure'

export type ErrorSchema = NestedType<answerSchemas>

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
    data: { application: MinistryOfJusticeAdvert }
    date: string
    status: StatusProvider
  }
}

export type OJOIApplication = Override<
  Application,
  {
    answers: Partial<answerSchemas>
    externalData: ExternalData
  }
>

export type OJOIFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: OJOIApplication
    errors: ErrorSchema
  }
>

export type CreateParentKey<Key extends string> =
  `ministryOfJustice${Capitalize<Key>}`

export type MinistryOfJusticeGraphqlResponse<
  Key extends string,
  Value = MinistryOfJusticeAdvertEntity[],
> = {
  [key in CreateParentKey<Key>]: {
    [key in Key]: Value
  } & {
    paging: MinistryOfJusticePaging
  }
}
