import { coreErrorMessages } from '@island.is/application/core'
import type {
  DisplayField,
  Field,
  FormLeaf,
  FormText,
  FormTextWithLocale,
  ImageField,
  RepeaterItem,
  StaticText,
  TextField,
} from '@island.is/application/types'
import { FieldTypes } from '@island.is/application/types'
import type { MessageDescriptorInfo } from '@island.is/application/types'
import {
  extractMessageDescriptorsFromFormText,
  extractMessageDescriptorsFromPropsDeep,
  isMessageDescriptor,
  mergeMessageDescriptors,
  extractStaticText,
} from './message-descriptor.util'

export const extractDisplayFieldMessageDescriptors = (
  df: DisplayField,
): MessageDescriptorInfo[] => {
  const extra: MessageDescriptorInfo[] = []
  if (df.label != null && isMessageDescriptor(df.label)) {
    extra.push({
      id: String(df.label.id),
      defaultMessage: df.label.defaultMessage as string | undefined,
      description: df.label.description as string | undefined,
    })
  }
  if (df.suffix != null && isMessageDescriptor(df.suffix)) {
    extra.push({
      id: String(df.suffix.id),
      defaultMessage: df.suffix.defaultMessage as string | undefined,
      description: df.suffix.description as string | undefined,
    })
  }
  return extra
}

export const displayFieldStaticIntrospectionFromLeaf = (
  leaf: FormLeaf,
):
  | {
      displayLabelMessageId: string | null
      displaySuffixMessageId: string | null
      displayLabelStatic: string | null
      displaySuffixStatic: string | null
    }
  | Record<string, never> => {
  if (leaf.type !== FieldTypes.DISPLAY) {
    return {}
  }
  const df = leaf as DisplayField
  let displayLabelMessageId: string | null = null
  let displaySuffixMessageId: string | null = null
  let displayLabelStatic: string | null = null
  let displaySuffixStatic: string | null = null
  if (df.label != null) {
    if (isMessageDescriptor(df.label)) {
      displayLabelMessageId = String(df.label.id)
    } else {
      displayLabelStatic = df.label
    }
  }
  if (df.suffix != null) {
    if (isMessageDescriptor(df.suffix)) {
      displaySuffixMessageId = String(df.suffix.id)
    } else {
      displaySuffixStatic = df.suffix
    }
  }
  return {
    displayLabelMessageId,
    displaySuffixMessageId,
    displayLabelStatic,
    displaySuffixStatic,
  }
}

export const textFieldIntrospectionFromLeaf = (
  leaf: FormLeaf,
):
  | {
      textFieldVariant: string
      textFieldRows?: number | null
    }
  | Record<string, never> => {
  if (leaf.type !== FieldTypes.TEXT) {
    return {}
  }
  const tf = leaf as TextField
  const variant = tf.variant ?? 'text'
  if (variant === 'textarea' && typeof tf.rows === 'number') {
    return {
      textFieldVariant: variant,
      textFieldRows: tf.rows,
    }
  }
  return { textFieldVariant: variant }
}

export const imageFieldIntrospectionFromLeaf = (
  leaf: FormLeaf,
):
  | {
      imageUrl: string | null
      imageSvgComponentName: string | null
      imageAlt: string | null
      imageWidth: unknown
      imagePosition: unknown
    }
  | Record<string, never> => {
  if (leaf.type !== FieldTypes.IMAGE) {
    return {}
  }
  const im = leaf as ImageField
  let imageUrl: string | null = null
  let imageSvgComponentName: string | null = null
  if (typeof im.image === 'string') {
    imageUrl = im.image
  } else if (typeof im.image === 'function') {
    const fn = im.image as Function & { displayName?: string }
    const name = (fn.displayName || fn.name || '').trim()
    imageSvgComponentName = name && name !== 'anonymous' ? name : null
  }
  return {
    imageUrl,
    imageSvgComponentName,
    imageAlt: im.alt ?? null,
    imageWidth: im.imageWidth ?? null,
    imagePosition: im.imagePosition ?? null,
  }
}

export const extractMessageDescriptorsFromField = (
  field: Field,
): MessageDescriptorInfo[] => {
  const descriptors: MessageDescriptorInfo[] = []
  const f = field as unknown as Record<string, unknown>

  descriptors.push(...extractMessageDescriptorsFromFormText(field.title))
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.description as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.placeholder as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(f.tooltip as FormText | undefined),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.message as FormText | FormTextWithLocale | undefined,
    ),
  )

  const links = f.links
  if (Array.isArray(links)) {
    for (const link of links) {
      if (link && typeof link === 'object') {
        const linkRecord = link as Record<string, unknown>
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(
            linkRecord.title as FormText | undefined,
          ),
        )
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(
            linkRecord.url as FormText | undefined,
          ),
        )
      }
    }
  }

  const options = f.options
  if (Array.isArray(options)) {
    for (const option of options) {
      if (option && typeof option === 'object') {
        descriptors.push(...extractMessageDescriptorsFromFormText(option.label))
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(option.tooltip),
        )
      }
    }
  }

  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.customNationalIdLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.customNameLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.phoneLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.emailLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(f.link as FormText | undefined),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.buttonTitle as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(f.s3key as FormText | undefined),
  )

  const propsRaw = f.props
  if (propsRaw && typeof propsRaw === 'object') {
    const fromProps = extractMessageDescriptorsFromPropsDeep(
      propsRaw,
      0,
      new WeakSet<object>(),
    )
    for (const d of fromProps) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return mergeMessageDescriptors(
    descriptors,
    field.type === FieldTypes.DISPLAY
      ? extractDisplayFieldMessageDescriptors(field as DisplayField)
      : [],
  )
}

export const enrichNationalIdWithNameFieldDescriptors = (
  nif: {
    customNationalIdLabel?: StaticText
    customNameLabel?: StaticText
    showPhoneField?: boolean
    showEmailField?: boolean
    phoneLabel?: StaticText
    emailLabel?: StaticText
  },
  descriptors: MessageDescriptorInfo[],
): MessageDescriptorInfo[] => {
  let out = [...descriptors]
  if (!nif.customNationalIdLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryNationalId as FormText,
      ),
    )
  }
  if (!nif.customNameLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryName as FormText,
      ),
    )
  }
  if (nif.showPhoneField && !nif.phoneLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryPhone as FormText,
      ),
    )
  }
  if (nif.showEmailField && !nif.emailLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryEmail as FormText,
      ),
    )
  }
  return out
}

export const enrichNationalIdWithNameRepeaterItemDescriptors = (
  item: RepeaterItem,
  descriptors: MessageDescriptorInfo[],
): MessageDescriptorInfo[] => {
  if (item.component !== 'nationalIdWithName') {
    return descriptors
  }
  return enrichNationalIdWithNameFieldDescriptors(item, descriptors)
}

/**
 * Template `field.backgroundColor` for input-like fields (exposed to translation preview as `inputBackgroundColor`).
 */
export const extractInputBackgroundColorFromLeaf = (
  leaf: FormLeaf,
): string | null | undefined => {
  const withBg = new Set<FieldTypes>([
    FieldTypes.TEXT,
    FieldTypes.EMAIL,
    FieldTypes.PHONE,
    FieldTypes.DATE,
    FieldTypes.SELECT,
    FieldTypes.ASYNC_SELECT,
    FieldTypes.BANK_ACCOUNT,
    FieldTypes.COMPANY_SEARCH,
    FieldTypes.NATIONAL_ID_WITH_NAME,
    FieldTypes.COPY_LINK,
    FieldTypes.HIDDEN_INPUT,
    FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE,
    FieldTypes.FIND_VEHICLE,
    FieldTypes.VEHICLE_RADIO,
    FieldTypes.VEHICLE_SELECT,
    FieldTypes.VEHICLE_PERMNO_WITH_INFO,
  ])
  if (!withBg.has(leaf.type as FieldTypes)) {
    return undefined
  }
  const bg = (leaf as { backgroundColor?: string }).backgroundColor
  if (bg === 'white' || bg === 'blue') {
    return bg
  }
  return undefined
}
