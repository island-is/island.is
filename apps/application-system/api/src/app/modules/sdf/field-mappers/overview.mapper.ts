import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'

import { FieldMapper } from './types'
import { asResolvableFormText, isEmpty } from './utils'

type OverviewItemsFn = (
  answers: FormValue,
  externalData: ExternalData,
  userNationalId: string,
  locale: string,
) => KeyValueItem[]

type OverviewAttachmentsFn = (
  answers: FormValue,
  externalData: ExternalData,
) => AttachmentItem[]

type OverviewBackId =
  | string
  | ((answers: FormValue, externalData: ExternalData) => string | undefined)

/**
 * Maps a `buildOverviewField`/`addOverviewField` definition into a fully
 * resolved overview payload. Unlike the legacy React `OverviewFormField`, the
 * SDF client receives plain strings: every `keyText`/`valueText` (which the SDF
 * GraphQL schema types as `String`) is resolved here via `resolver.resolve()`,
 * so an unresolved `MessageDescriptor` can never reach the GraphQL response.
 *
 * `items` may return a `valueText` that is itself an array of FormText — those
 * are resolved element-by-element and joined, matching how the legacy renderer
 * displayed them.
 */
export const mapOverviewField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const { answers, externalData } = application
  const nationalId = application.applicant ?? ''
  const locale = resolver.currentLocale

  const itemsFn = raw.items as OverviewItemsFn | undefined
  const attachmentsFn = raw.attachments as OverviewAttachmentsFn | undefined

  const rawItems =
    typeof itemsFn === 'function'
      ? itemsFn(answers, externalData, nationalId, locale)
      : []

  const resolveValueText = (
    valueText: KeyValueItem['valueText'],
  ): string => {
    if (Array.isArray(valueText)) {
      return valueText
        .map((part) => resolver.resolve(asResolvableFormText(part)))
        .filter((part) => part.length > 0)
        .join(', ')
    }
    return resolver.resolve(asResolvableFormText(valueText))
  }

  component.overviewItems = (rawItems ?? [])
    .map((item) => ({
      width: item.width,
      keyText: resolver.resolve(asResolvableFormText(item.keyText)),
      valueText: resolveValueText(item.valueText),
      inlineKeyText: item.inlineKeyText,
      boldValueText: item.boldValueText,
      lineAboveKeyText: item.lineAboveKeyText,
    }))
    // Mirror the legacy renderer: drop items flagged `hideIfEmpty` with no value
    // (the divider-only items, with no keyText/valueText, are kept).
    .filter(
      (item, index) =>
        !rawItems[index]?.hideIfEmpty || !isEmpty(item.valueText),
    )

  const rawAttachments =
    typeof attachmentsFn === 'function'
      ? attachmentsFn(answers, externalData)
      : []

  component.overviewAttachments = (rawAttachments ?? []).map((attachment) => ({
    width: attachment.width,
    fileName: resolver.resolve(asResolvableFormText(attachment.fileName)),
    fileType: resolver.resolve(asResolvableFormText(attachment.fileType)),
    fileSize: resolver.resolve(asResolvableFormText(attachment.fileSize)),
  }))

  const rawBackId = raw.backId as OverviewBackId | undefined
  const backId =
    typeof rawBackId === 'function'
      ? rawBackId(answers, externalData)
      : rawBackId
  if (typeof backId === 'string') {
    component.backId = backId
  }

  if (typeof raw.bottomLine === 'boolean') {
    component.bottomLine = raw.bottomLine
  }
  if (typeof raw.displayTitleAsAccordion === 'boolean') {
    component.displayTitleAsAccordion = raw.displayTitleAsAccordion
  }
  if (typeof raw.titleVariant === 'string') {
    component.titleVariant = raw.titleVariant
  }
}
