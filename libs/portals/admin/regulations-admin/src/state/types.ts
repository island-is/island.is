import {
  DraftImpactId,
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import {
  HTMLText,
  LawChapter,
  LawChapterSlug,
  PlainText,
  RegName,
  URLString,
} from '@island.is/regulations'
import { Kennitala, RegulationType, MinistryList } from '@island.is/regulations'
import { Step } from '../types'
import { MessageDescriptor } from 'react-intl'
import { WarningList } from '@dmr.is/regulations-tools/useTextWarnings'

export type StepNav = {
  name: Step
  prev?: Step
  next?: Step
}

export type DraftField<Type, InputType extends string = ''> = {
  value: Type
  required?: boolean | MessageDescriptor
  dirty?: boolean
  error?: MessageDescriptor
  showError?: true
  type?: InputType
}

export type HtmlDraftField = DraftField<HTMLText, 'html'> & {
  // list of warnings from useHighAngstWarnings
  warnings: WarningList
}

export type DateDraftField = DraftField<Date | undefined, 'date'> & {
  min?: Date
  max?: Date
}

export type AppendixDraftForm = {
  title: DraftField<PlainText, 'text'>
  text: HtmlDraftField

  diff?: HtmlDraftField
  /**
   * Appendixes may be revoked by `RegulationChange`s.
   *
   * Instead of being deleted, they're only emptied,
   * to guarantee sane diffing between arbitrary
   * historic versions of the regulation.
   *
   * The rules is that appendixes can neither be deleted
   * nor re-ordered by `RegulationChange`s.
   *
   * `RegulationChange`s may only add new appendixes,
   * or "revoke" (i.e. "empty") existing ones.
   *
   * However, to make the Regulation (or RegulationDiff) nicer to
   * consume, we filter out those empty appendixes on the API server.
   */
  revoked?: boolean
  key: string
}

export type BodyDraftFields = {
  title: DraftField<PlainText, 'text'>
  text: HtmlDraftField
  appendixes: Array<AppendixDraftForm>
}

type DraftImpactBaseFields<
  ImpactType extends DraftRegulationChange | DraftRegulationCancel,
> = Readonly<
  // always prefilled on "create" - non-editable
  Pick<ImpactType, 'id' | 'type' | 'name'>
> & {
  date: DateDraftField
  regTitle: string
  error?: MessageDescriptor | string
}

export type DraftChangeForm = DraftImpactBaseFields<DraftRegulationChange> &
  BodyDraftFields & {
    /** A.k.a. „Athugsemdir ritstjóra“ */
    comments: HtmlDraftField
    diff?: HtmlDraftField
  }

export type DraftCancelForm = DraftImpactBaseFields<DraftRegulationCancel>

export type DraftImpactForm = DraftChangeForm | DraftCancelForm

// ---------------------------------------------------------------------------

export type GroupedDraftImpactForms = Record<string, DraftImpactForm[]>

export type RegDraftForm = BodyDraftFields & {
  id: RegulationDraftId
  readonly draftingStatus: DraftingStatus // non-editable except via saveStatus or propose actions

  idealPublishDate: DateDraftField
  effectiveDate: DateDraftField
  lawChapters: DraftField<Array<LawChapterSlug>>

  signatureDate: DateDraftField
  ministry: DraftField<PlainText | undefined, 'text'>
  type: DraftField<RegulationType | undefined>

  signatureText: HtmlDraftField
  signedDocumentUrl: DraftField<URLString | undefined>

  /** A list of likely `RegName`s found in the draft't `text`
   * that is used to populate a Selectbox for picking impacted
   * regulations.
   *
   * Mentioned is a 100% derived value, not to be saved on the server
   */
  mentioned: Array<RegName>
  impacts: GroupedDraftImpactForms

  draftingNotes: HtmlDraftField
  authors: DraftField<Array<Kennitala>>

  fastTrack: DraftField<boolean>

  name: DraftField<PlainText | undefined, 'text'>
}

// ---------------------------------------------------------------------------

export type DraftingState = {
  /** Users split into "authors" and "editors" (with publishing privileges) */
  isEditor: boolean
  /** Info about the currently active step in the editing UI */
  step: StepNav
  /** The form containing the RegulationDraft and its impacts */
  draft: RegDraftForm
  /** Static list of ministries, loaded on init */
  ministries: MinistryList
  /** Static list of law chapters, loaded on init */
  lawChapters: {
    list: Array<LawChapter>
    bySlug: Record<string, string>
  }

  /** true while saving the draft */
  saving?: boolean
  /** "Toastable" errror that occur during loading/saving/etc. */
  error?: { message: MessageDescriptor | string; error?: Error }

  /** The impact that's currently being edited */
  activeImpact?: DraftImpactId
}

// -----------------------------

export type RegDraftFormSimpleProps = Extract<
  keyof RegDraftForm,
  | 'title'
  | 'text'
  | 'idealPublishDate' // Needs to be checked and must never be in the past
  | 'fastTrack'
  | 'effectiveDate' // Need to be checked and must never be **before** `idealPublishDate`
  | 'signatureDate' // Need to be checked and must never be **after* `idealPublishDate`
  | 'signatureText'
  | 'signedDocumentUrl'
  | 'lawChapters'
  | 'ministry'
  | 'type'
  | 'draftingNotes'
  | 'authors'
  | 'name'
  // | 'impacts'
>
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
      error?: DraftingState['error']
    }
  | {
      type: 'UPDATE_LAWCHAPTER_PROP'
      action?: 'add' | 'delete'
      value: LawChapterSlug
    }
  | {
      type: 'SET_MINISTRY'
      value?: PlainText
    }
  | ({
      type: 'UPDATE_PROP'
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
      type: 'APPENDIX_MOVE_DOWN'
      idx: number
    }
  | {
      type: 'APPENDIX_DELETE'
      idx: number
    }
  | {
      type: 'SET_IMPACT'
      impactId: DraftImpactId | undefined
    }

// TODO: Implement appendix actions for DraftChanges
// TODO: Also Implement revocation action for DraftChange appendixes
// | {
//     type: 'APPENDIX_REVOKE'
//     idx: number
//     revoked: boolean
//   }

export type ActionName = Action['type']

export type UpdateAction = Extract<Action, { type: 'UPDATE_PROP' }>
