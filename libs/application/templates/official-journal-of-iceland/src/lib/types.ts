import { Application, FieldBaseProps } from '@island.is/application/types'
import { dataSchema, type answerSchemas } from './dataSchema'
import { INSTITUTION_INDEX, MEMBER_INDEX } from './constants'

export const InputFields = {
  prerequisites: {
    approveExternalData: 'prerequisites.approveExternalData',
  },
  advert: {
    department: 'advert.department',
    type: 'advert.type',
    subType: 'advert.subType',
    title: 'advert.title',
    template: 'advert.template',
    documentContents: 'advert.documentContents',
    signatureType: 'advert.signatureType',
    signatureContents: 'advert.signatureContents',
    signature: {
      regular: {
        institution: `advert.signature.regular-${INSTITUTION_INDEX}.institution`,
        date: `advert.signature.regular-${INSTITUTION_INDEX}.date`,
        members: {
          textAbove: `advert.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textAbove`,
          name: `advert.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.name`,
          textBelow: `advert.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textBelow`,
          textAfter: `advert.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textAfter`,
        },
      },
      committee: {
        institution: 'advert.signature.committee.institution',
        date: 'advert.signature.committee.date',
        chairman: {
          textAbove: 'advert.signature.committee.chairman.textAbove',
          name: 'advert.signature.committee.chairman.name',
          textAfter: 'advert.signature.committee.chairman.textAfter',
          textBelow: 'advert.signature.committee.chairman.textBelow',
        },
        members: {
          name: `advert.signature.committee.members-${MEMBER_INDEX}.name`,
          textBelow: `advert.signature.committee.members-${MEMBER_INDEX}.textBelow`,
        },
      },
      additonalSignature: 'advert.signature.additonalSignature',
    },
  },
  additionsAndDocuments: {
    files: 'additionsAndDocuments.files',
    fileNames: 'additionsAndDocuments.fileNames',
  },
  publishingPreferences: {
    date: 'publishingPreferences.date',
    fastTrack: 'publishingPreferences.fastTrack',
    communicationChannels: 'publishingPreferences.communicationChannels',
    message: 'publishingPreferences.message',
  },
}

type Option = {
  id: string
  title: string
  slug: string
}

type AdvertPaging = {}

export type AdvertOption<Key extends string> = {
  [key in Key]: Array<Option>
}

export type SignatureType = 'regular' | 'committee'
export type RegularSignatureState =
  answerSchemas['advert']['signature']['regular']
export type CommitteeSignatureState =
  answerSchemas['advert']['signature']['committee']

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

export enum AnswerOption {
  YES = 'yes',
  NO = 'no',
}

type MinistryStatusRespnose =
  | { type: 'success' }
  | { type: 'error'; reason: string }

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

  validateApplication: {
    data: MinistryStatusRespnose
    date: string
    status: StatusProvider
  }

  submitApplication: {
    data: MinistryStatusRespnose
    date: string
    status: StatusProvider
  }
}

export type OJOIApplication = Override<
  Application,
  {
    answers: answerSchemas
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
