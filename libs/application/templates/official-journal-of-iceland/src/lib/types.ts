import { Application, FieldBaseProps } from '@island.is/application/types'
import { StringOption as Option } from '@island.is/island-ui/core'
import type { answerSchemas } from './dataSchema'

export const InputFields = {
  prerequisites: {
    approveExternalData: 'prerequisites.approveExternalData',
  },
  case: {
    department: 'case.department',
    category: 'case.category',
    title: 'case.title',
    template: 'case.template',
    documentContents: 'case.documentContents',
    signatureType: 'case.signatureType',
    signatureContents: 'case.signatureContents',
    signatureDate: 'case.signatureDate',
  },
  additionsAndDocuments: {
    files: 'additionsAndDocuments.files',
    fileNames: 'additionsAndDocuments.fileNames',
  },
  originalData: {
    files: 'originalData.files',
  },
  publishingPreferences: {
    date: 'publishingPreferences.date',
    fastTrack: 'publishingPreferences.fastTrack',
    communicationChannels: 'publishingPreferences.communicationChannels',
    message: 'publishingPreferences.message',
  },
}

export enum TemplateApiActions {
  getOptions = 'getOptions',
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

type StatusProvider = 'success' | 'failure'

export enum BooleanValue {
  YES = 'yes',
  NO = 'no',
}

export type ErrorSchema = NestedType<answerSchemas>

type Options = {
  departments: Option[]
  categories: Option[]
  subCategories: Option[]
  templates: Option[]
  signatureTypes: Option[]
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
  }
>
