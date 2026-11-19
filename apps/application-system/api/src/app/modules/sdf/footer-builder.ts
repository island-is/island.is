import {
  CallToAction,
  FormValue,
  ExternalData,
  SubmitField,
} from '@island.is/application/types'
import { shouldShowFormItem } from '@island.is/application/core'
import { BffUser } from '@island.is/shared/types'
import { FooterButtonDto } from './dto/screen.dto'
import { FormTextResolver } from './i18n-resolver.service'
import { SdfActionType } from './dto/action.dto'

const eventToString = (event: CallToAction['event']): string =>
  typeof event === 'string'
    ? event
    : (event as { type?: string })?.type ?? String(event)

const CALL_TO_ACTION_VARIANT_MAP: Record<string, string> = {
  primary: 'PRIMARY',
  subtle: 'GHOST',
  reject: 'REJECT',
  sign: 'SIGN',
  signGhost: 'GHOST',
  rejectGhost: 'GHOST',
}

function mapCallToActionType(): string {
  // Footer buttons are built exclusively from the current state's role actions,
  // which are always state-machine transition events (SUBMIT, PAYMENT, APPROVE,
  // REJECT, ABORT, ...). They must dispatch SUBMIT carrying the event name so
  // the backend advances the XState machine — never NEXT_PAGE, which only moves
  // the page cursor and would no-op on the final screen. (Page navigation is
  // synthesized separately in `buildFooter` for non-final screens.)
  return SdfActionType.SUBMIT
}

export function buildFooterButtons(
  actions: CallToAction[] | undefined,
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
  resolver: FormTextResolver,
  submitField?: SubmitField,
): FooterButtonDto[] {
  if (!actions || actions.length === 0) return []

  // The transition event must come from the state-machine role action (so the
  // dispatched SUBMIT advances XState correctly), but the *label* should come
  // from the form's submitField when one matches by event — mirroring legacy
  // `ScreenFooter`, where the button text is the submitField action's
  // (translatable) `name`. Role-action names are often authored literals
  // (e.g. 'Staðfesta') that bypass translation, so preferring the submitField
  // label is what makes the button localize.
  const labelByEvent = new Map<string, CallToAction['name']>()
  for (const action of submitField?.actions ?? []) {
    labelByEvent.set(eventToString(action.event), action.name)
  }

  return actions
    .filter((action) => {
      if (!action.condition) return true
      return shouldShowFormItem(
        { condition: action.condition } as any,
        answers,
        externalData,
        user,
      )
    })
    .map((action) => {
      const eventStr = eventToString(action.event)
      return {
        id: eventStr,
        text: resolver.resolve(labelByEvent.get(eventStr) ?? action.name),
        variant: CALL_TO_ACTION_VARIANT_MAP[action.type] ?? 'PRIMARY',
        actionType: mapCallToActionType(),
      }
    })
}
