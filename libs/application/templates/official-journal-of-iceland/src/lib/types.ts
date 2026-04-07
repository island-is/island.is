import { Application, FieldBaseProps } from '@island.is/application/types'
import { Routes } from './constants'
import { partialSchema } from './dataSchema'

export const InputFields = {
  [Routes.REQUIREMENTS]: {
    approveExternalData: 'requirements.approveExternalData',
  },
  [Routes.TYPE_SELECTION]: {
    applicationType: 'applicationType',
    reader: 'reader',
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
    involvedPartyTitle: 'advert.involvedPartyTitle',
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
    titlePrefix: 'misc.titlePrefix',
    asRoman: 'misc.asRoman',
    mainTextAsFile: 'misc.mainTextAsFile',
    mainTextFilename: 'misc.mainTextFilename',
  },
  regulation: {
    draftId: 'regulation.draftId',
    effectiveDate: 'regulation.effectiveDate',
    fastTrack: 'regulation.fastTrack',
    lawChapters: 'regulation.lawChapters',
    draftingNotes: 'regulation.draftingNotes',
    impacts: 'regulation.impacts',
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
  regulation: {
    title: 'Titill',
    html: 'Texti reglugerðar',
    effectiveDate: 'Gildistökudagur',
    lawChapters: 'Lagakaflar',
  },
}

export enum TemplateApiActions {
  departments = 'getDepartments',
  types = 'getAdvertTypes',
  postApplication = 'postApplication',
  syncRegulationDraft = 'syncRegulationDraft',
}

export const isAdApplication = (answers: partialSchema | undefined) =>
  !answers?.applicationType || answers.applicationType === 'ad'

export const isRegulationApplication = (answers: partialSchema | undefined) =>
  answers?.applicationType === 'base_regulation' ||
  answers?.applicationType === 'amending_regulation'

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

export type OJOIFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: OJOIApplication
    errors: ErrorSchema
  }
>
