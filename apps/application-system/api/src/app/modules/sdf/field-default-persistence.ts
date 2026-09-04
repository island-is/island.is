import set from 'lodash/set'

import {
  Application,
  FieldTypes,
  FormExpression,
  FormItemTypes,
  FormValue,
} from '@island.is/application/types'
import {
  evaluateFormExpression,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldDef,
  FormScreen,
  MultiFieldScreen,
} from '@island.is/application/screen-compiler'
import type { Locale } from '@island.is/shared/types'

/**
 * Field types whose `defaultValue` must never be written into answers. Notably
 * `DISPLAY`, which is recomputed from source at render time (a persisted snapshot
 * would go stale); the rest are layout/copy/action fields carrying no answer.
 */
const NON_VALUE_BEARING_FIELD_TYPES = new Set<string>([
  FieldTypes.DISPLAY,
  FieldTypes.DESCRIPTION,
  FieldTypes.EXPANDABLE_DESCRIPTION,
  FieldTypes.DIVIDER,
  FieldTypes.ALERT_MESSAGE,
  FieldTypes.SUBMIT,
  FieldTypes.KEY_VALUE,
  FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
  FieldTypes.LINK,
  FieldTypes.PAYMENT_CHARGE_OVERVIEW,
  FieldTypes.PAYMENT_PENDING,
  FieldTypes.IMAGE,
  FieldTypes.PDF_LINK_BUTTON,
  FieldTypes.ACTION_CARD_LIST,
  FieldTypes.STATIC_TABLE,
  FieldTypes.INFORMATION_CARD,
  FieldTypes.ACCORDION,
  FieldTypes.TITLE,
  FieldTypes.OVERVIEW,
  FieldTypes.COPY_LINK,
  FieldTypes.REDIRECT_TO_SERVICE_PORTAL,
])

const isEmptyAnswer = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

/**
 * Fields on the page being left that can seed answers: a multiField's children or
 * a bare leaf field. Repeaters (own per-row handling) and EDP screens (no input
 * answers) are skipped.
 */
const collectPageFields = (screen: FormScreen | undefined): FieldDef[] => {
  if (!screen || !('type' in screen)) return []

  if (screen.type === FormItemTypes.MULTI_FIELD) {
    return (screen as MultiFieldScreen).children ?? []
  }

  if (
    screen.type === FormItemTypes.REPEATER ||
    screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER
  ) {
    return []
  }

  return 'id' in screen ? [screen as FieldDef] : []
}

/**
 * Persist resolved field defaults into answers, mirroring the legacy web renderer
 * which commits every field's resolved `defaultValue` on submit. SDF fields
 * otherwise only write on user edit, so an untouched field with a `defaultValue`
 * (e.g. applicant base info from external data) never reaches `answers`. This pass
 * seeds every visible, value-bearing field that has no answer yet on page advance.
 *
 * `mergedAnswers` is mutated in place and also returned.
 */
export const applyResolvedFieldDefaults = (
  screen: FormScreen | undefined,
  mergedAnswers: FormValue,
  application: Application,
  locale: Locale,
): FormValue => {
  const fields = collectPageFields(screen)
  if (fields.length === 0) return mergedAnswers

  // Normalize a Sequelize model to a plain object: its attributes live behind
  // prototype getters that the spread below would drop, leaving externalData-derived
  // defaults resolving to empty.
  const maybeModel = application as unknown as {
    toJSON?: () => Application
  }
  const plainApplication =
    typeof maybeModel.toJSON === 'function' ? maybeModel.toJSON() : application

  // Resolve closures against the in-progress answers so a default deriving from
  // another field on this page is current.
  const workingApplication = {
    ...plainApplication,
    answers: mergedAnswers,
  } as Application

  for (const field of fields) {
    if (!field || typeof field.id !== 'string') continue
    // Hidden by a server `condition` (already reflected in `isNavigable`).
    if (field.isNavigable === false) continue
    if (NON_VALUE_BEARING_FIELD_TYPES.has(field.type as string)) continue

    const rawDefault = (field as { defaultValue?: unknown }).defaultValue
    if (rawDefault === undefined) continue

    // Hidden by a same-page `clientShowWhen` — don't seed what the user can't see.
    const clientShowWhen = (field as { clientShowWhen?: FormExpression })
      .clientShowWhen
    if (
      clientShowWhen &&
      !evaluateFormExpression(
        clientShowWhen,
        mergedAnswers as Record<string, unknown>,
      )
    ) {
      continue
    }

    // A user-entered or previously-persisted value always wins.
    if (!isEmptyAnswer(getValueViaPath(mergedAnswers, field.id))) continue

    let value: unknown
    try {
      value =
        typeof rawDefault === 'function'
          ? (
              rawDefault as (
                application: Application,
                field: FieldDef,
                locale: Locale,
              ) => unknown
            )(workingApplication, field, locale)
          : rawDefault
    } catch {
      // A throwing default closure is treated as "no default".
      continue
    }

    if (isEmptyAnswer(value)) continue

    // `field.id` may be a dotted path; `set` writes it nested.
    set(mergedAnswers, field.id, value)
  }

  return mergedAnswers
}
