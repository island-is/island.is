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
 * Field types that do NOT own a persisted answer — their `defaultValue` (if any)
 * must never be written into answers.
 *
 * The critical entry is `DISPLAY`: SDF display fields are recomputed from source
 * (answers + externalData) at render/submit time, so persisting a snapshot of
 * their computed value would go stale. The rest are layout/copy/action fields
 * that carry no answer at all.
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
 * The fields the user just interacted with on the page being left. Only the page
 * itself (a multiField) or a single leaf field can seed answers; repeaters and
 * external-data-provider screens are skipped (repeater rows have their own
 * per-row default handling and EDP screens own no input answers).
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

  // A bare leaf field rendered as its own screen.
  return 'id' in screen ? [screen as FieldDef] : []
}

/**
 * Persist resolved field defaults into answers, mirroring how the legacy
 * application-system web renderer keeps every field's resolved `defaultValue`
 * in form state and commits it on submit.
 *
 * SDF text fields otherwise only write to answers on user edit, so a disabled or
 * untouched field that carries a `defaultValue` (e.g. the applicant base-info
 * fields populated from external data) never reaches `answers`. This pass closes
 * that gap on page advance for every value-bearing, visible field that has no
 * answer yet, so downstream readers (overview, submit DTO mappers, notifications)
 * see the same values the user saw on screen — without per-app seeding glue.
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

  // Normalize a Sequelize model into a plain object first: its attributes
  // (`externalData`, `answers`, …) live behind prototype getters, so the object
  // spread below would otherwise drop them — leaving externalData-derived
  // defaults (e.g. applicant base info) resolving to empty and never persisting.
  const maybeModel = application as unknown as {
    toJSON?: () => Application
  }
  const plainApplication =
    typeof maybeModel.toJSON === 'function' ? maybeModel.toJSON() : application

  // Resolve closures against the in-progress answers, not just the persisted
  // ones, so a default that derives from another field on this page is current.
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
      // Mirror `resolveFieldProp`: a throwing default closure is treated as "no
      // default" rather than failing the whole advance.
      continue
    }

    if (isEmptyAnswer(value)) continue

    // `field.id` may be a dotted path (e.g. `applicant.name`); `set` writes it
    // nested, matching how the rest of the answers tree is shaped.
    set(mergedAnswers, field.id, value)
  }

  return mergedAnswers
}
