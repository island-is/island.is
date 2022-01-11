import {
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import {
  HTMLText,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
  RegName,
  URLString,
} from '@island.is/regulations'
import { Kennitala, RegulationType, MinistryList } from '@island.is/regulations'
import { Step } from '../types'
import { MessageDescriptor } from 'react-intl'

export type StepNav = {
  name: Step
  prev?: Step
  next?: Step
}

export type InputType = 'text' | 'html'

export type DraftField<Type> = {
  value: Type
  required?: boolean
  dirty?: boolean
  guessed?: boolean
  error?: MessageDescriptor
  type?: InputType
}

// TODO: Figure out how the Editor components lazy valueRef.current() getter fits into this
export type HtmlDraftField = DraftField<HTMLText>

export type AppendixDraftForm = {
  title: DraftField<PlainText>
  text: HtmlDraftField
  key: string
}

export type BodyDraftFields = {
  title: DraftField<PlainText>
  text: HtmlDraftField
  appendixes: Array<AppendixDraftForm>
  comments: HtmlDraftField
}

type DraftImpactFields<
  ImpactType extends DraftRegulationChange | DraftRegulationCancel
> = Readonly<
  // always prefilled on "create" - non-editable
  Pick<ImpactType, 'id' | 'type' | 'name'>
> & {
  date: DraftField<Date>
  regTitle: string
  error?: MessageDescriptor
}

export type ChangeDraftFields = DraftImpactFields<DraftRegulationChange> &
  BodyDraftFields

export type CancelDraftFields = DraftImpactFields<DraftRegulationCancel>

// ---------------------------------------------------------------------------

export type RegDraftForm = BodyDraftFields & {
  id: RegulationDraftId
  readonly draftingStatus: DraftingStatus // non-editable except via saveStatus or propose actions

  idealPublishDate: DraftField<Date | undefined>
  signatureDate: DraftField<Date | undefined>
  effectiveDate: DraftField<Date | undefined>
  lawChapters: DraftField<Array<LawChapterSlug>>
  ministry: DraftField<MinistrySlug | undefined>
  type: DraftField<RegulationType | undefined>

  signatureText: HtmlDraftField
  signedDocumentUrl: DraftField<URLString | undefined>

  mentioned: Array<RegName>
  impacts: Array<ChangeDraftFields | CancelDraftFields>

  draftingNotes: HtmlDraftField
  authors: DraftField<Array<Kennitala>>

  fastTrack: DraftField<boolean>
}

export type DraftingState = {
  isEditor: boolean
  stepName: Step
  draft: RegDraftForm
  ministries: MinistryList
  saving?: boolean
  shipping?: boolean
  error?: Error
}

// -----------------------------

export type AppendixFieldNameValuePair = {
  [Key in AppendixFormSimpleProps]: {
    name: Key
    value: AppendixDraftForm[Key]['value']
  }
}[AppendixFormSimpleProps]

export type AppendixFormSimpleProps = Extract<
  keyof AppendixDraftForm,
  'title' | 'text'
>

export type FieldNameValuePair = {
  [Key in RegDraftFormSimpleProps]: {
    name: Key
    value: RegDraftForm[Key]['value']
  }
}[RegDraftFormSimpleProps]

export type RegDraftFormSimpleProps = Extract<
  keyof RegDraftForm,
  | 'title'
  | 'text'
  | 'idealPublishDate' // This prop needs its own action that checks for working days and updates the `fastTrack` flag accordingly
  | 'fastTrack'
  | 'effectiveDate' // Need to be checked and must never be **before** `idealPublishDate`
  | 'signatureDate' // Need to be checked and must never be **after* `idealPublishDate`
  | 'signatureText'
  | 'signedDocumentUrl'
  // | 'lawChapters'
  | 'ministry'
  | 'type'
  | 'draftingNotes'
  | 'authors'
>

export type Action =
  | {
      type: 'CHANGE_STEP'
      stepName: Step
    }
  | {
      type: 'SAVING_STATUS'
    }
  | {
      type: 'SAVING_STATUS_DONE'
      error?: Error
    }
  | {
      type: 'UPDATE_LAWCHAPTER_PROP'
      action?: 'add' | 'delete'
      value: LawChapterSlug
    }
  | {
      type: 'UPDATE_MULTIPLE_PROPS'
      multiData: Partial<RegDraftForm>
    }
  | ({
      type: 'UPDATE_PROP'
      explicit?: boolean
    } & FieldNameValuePair)
  | {
      type: 'APPENDIX_ADD'
    }
  | ({
      type: 'APPENDIX_SET_PROP'
      idx: number
    } & AppendixFieldNameValuePair)
  | {
      type: 'APPENDIX_MOVE_UP'
      idx: number
    }
  | {
      type: 'APPENDIX_REMOVE'
      idx: number
    }
  | {
      type: 'SHIP'
    }

export type ActionName = Action['type']

export type UpdateAction = Extract<Action, { type: 'UPDATE_PROP' }>
