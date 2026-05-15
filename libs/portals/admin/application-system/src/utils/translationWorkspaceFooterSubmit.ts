import { FieldTypes, FormItemTypes } from '@island.is/application/types'
import type {
  ResolvePreviewString,
  ScreenIntrospection,
  SubmitActionIntrospection,
} from '../types/translationWorkspace'

export const isFooterPlacementSubmit = (
  screen: ScreenIntrospection,
): boolean =>
  screen.type === FieldTypes.SUBMIT && screen.submitPlacement !== 'screen'

/**
 * Matches `findSubmitField` / `SubmitFormField`: footer CTAs live outside the field stack.
 */
export const findFooterSubmitScreen = (
  screens: ScreenIntrospection[],
): ScreenIntrospection | undefined => {
  for (const s of screens) {
    if (isFooterPlacementSubmit(s)) {
      return s
    }
    if (s.type === FormItemTypes.MULTI_FIELD && s.children?.length) {
      const nested = s.children.find((c) => isFooterPlacementSubmit(c))
      if (nested) return nested
    }
  }
  return undefined
}

export const resolveSubmitActionLabel = (
  action: SubmitActionIntrospection,
  resolvePreviewString: ResolvePreviewString,
): string => {
  if (action.labelMessageId) {
    return resolvePreviewString(
      action.labelMessageId,
      action.labelDefaultMessage,
    )
  }
  return action.labelDefaultMessage ?? action.event
}
