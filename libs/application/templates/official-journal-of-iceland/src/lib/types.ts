import { Application, FieldBaseProps } from '@island.is/application/types'
import { StringOption as Option } from '@island.is/island-ui/core'
import { dataSchema, type answerSchemas } from './dataSchema'
import { INSTITUTION_INDEX, MEMBER_INDEX } from './constants'

export const InputFields = {
  prerequisites: {
    approveExternalData: 'prerequisites.approveExternalData',
  },
  case: {
    department: 'case.department',
    category: 'case.category',
    subCategory: 'case.subCategory',
    title: 'case.title',
    template: 'case.template',
    documentContents: 'case.documentContents',
    signatureType: 'case.signatureType',
    signatureContents: 'case.signatureContents',
    signature: {
      regular: {
        institution: `case.signature.regular-${INSTITUTION_INDEX}.institution`,
        date: `case.signature.regular-${INSTITUTION_INDEX}.date`,
        members: {
          textAbove: `case.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textAbove`,
          name: `case.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.name`,
          textBelow: `case.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textBelow`,
          textAfter: `case.signature.regular-${INSTITUTION_INDEX}.members-${MEMBER_INDEX}.textAfter`,
        },
      },
      committee: {
        institution: 'case.signature.committee.institution',
        date: 'case.signature.committee.date',
        chairman: {
          textAbove: 'case.signature.committee.chairman.textAbove',
          name: 'case.signature.committee.chairman.name',
          textAfter: 'case.signature.committee.chairman.textAfter',
          textBelow: 'case.signature.committee.chairman.textBelow',
        },
        members: {
          name: `case.signature.committee.members-${MEMBER_INDEX}.name`,
          textBelow: `case.signature.committee.members-${MEMBER_INDEX}.textBelow`,
        },
      },
      additonalSignature: 'case.signature.additonalSignature',
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

type PartialRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export type SignatureType = 'regular' | 'committee'
export type RegularSignatureState =
  answerSchemas['case']['signature']['regular']
export type CommitteeSignatureState =
  answerSchemas['case']['signature']['committee']

export enum TemplateApiActions {
  getOptions = 'getOptions',
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

export type ErrorSchema = NestedType<answerSchemas>

type Options = {
  departments: Option[]
  categories: Option[]
  subCategories: Option[]
  templates: Option[]
}

export interface ExternalData {
  options: {
    data: Options
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
