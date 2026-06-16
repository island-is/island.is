import {
  CallToAction,
  FormValue,
  ExternalData,
} from '@island.is/application/types'
import { shouldShowFormItem } from '@island.is/application/core'
import { BffUser } from '@island.is/shared/types'
import { FooterButtonDto } from './dto/screen.dto'
import { FormTextResolver } from './i18n-resolver.service'
import { SdfActionType } from './dto/action.dto'

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
): FooterButtonDto[] {
  if (!actions || actions.length === 0) return []

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
      const eventStr =
        typeof action.event === 'string'
          ? action.event
          : (action.event as any)?.type ?? String(action.event)
      return {
        id: eventStr,
        text: resolver.resolve(action.name),
        variant: CALL_TO_ACTION_VARIANT_MAP[action.type] ?? 'PRIMARY',
        actionType: mapCallToActionType(),
      }
    })
}
