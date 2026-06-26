import { Injectable } from '@nestjs/common'
import { z, ZodIssueCode } from 'zod'
import { coreErrorMessages, coreMessages } from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationConfigurations,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'
import type {
  Application,
  Form,
  FormNode,
  FormLeaf,
  Section,
  SubSection,
  MultiField,
  Field,
  Option,
  RadioField,
  RepeaterItem,
  StaticText,
  FormText,
  FormTextArray,
  FormTextWithLocale,
  FormValue,
  ExternalData,
  DataProviderItem,
  TableRepeaterField,
  FieldsRepeaterField,
  NationalIdWithNameField,
  CheckboxField,
  StaticTableField,
  AlertMessageField,
  FileUploadField,
  Schema,
  OverviewField,
  KeyValueItem,
  SubmitField,
  DisplayField,
  TextField,
  ImageField,
  LinkField,
  MessageWithLinkButtonField,
} from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationCustomFieldMessageDescriptors,
} from '@island.is/application/template-loader'
import type { MessageDescriptor } from 'react-intl'
import type { Locale, BffUser } from '@island.is/shared/types'
import type {
  FormIntrospection,
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  RoleIntrospection,
  ScreenIntrospection,
  SectionIntrospection,
  StateIntrospection,
  SubSectionIntrospection,
  SubmitActionIntrospection,
  TemplateIntrospection,
  ValidationMessageDescriptorInfo,
} from '@island.is/application/types'

export type {
  FormIntrospection,
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  RoleIntrospection,
  ScreenIntrospection,
  SectionIntrospection,
  StateIntrospection,
  SubSectionIntrospection,
  SubmitActionIntrospection,
  TemplateIntrospection,
  ValidationMessageDescriptorInfo,
} from '@island.is/application/types'

const NAMESPACE_REGEX = /^[\w.]+:\w+(\.\w+)*$/

/**
 * Generates "invalid" skeleton data for a zod schema to trigger refinement errors.
 * Uses empty strings, zeros, and false to maximize validation failures.
 */
const generateInvalidSkeleton = (schema: z.ZodType): unknown => {
  if (schema instanceof z.ZodString) return ''
  if (schema instanceof z.ZodNumber) return 0
  if (schema instanceof z.ZodBoolean) return false
  if (schema instanceof z.ZodDate) return ''
  if (schema instanceof z.ZodEnum) return ''
  if (schema instanceof z.ZodNativeEnum) return ''
  if (schema instanceof z.ZodLiteral) return ''
  if (schema instanceof z.ZodArray) return []
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(shape)) {
      result[key] = generateInvalidSkeleton(value as z.ZodType)
    }
    return result
  }
  if (schema instanceof z.ZodOptional)
    return generateInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodNullable)
    return generateInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodDefault)
    return generateInvalidSkeleton(schema._def.innerType)
  if (schema instanceof z.ZodUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0 ? generateInvalidSkeleton(options[0]) : undefined
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0 ? generateInvalidSkeleton(options[0]) : undefined
  }
  if (schema instanceof z.ZodRecord) return {}
  if (schema instanceof z.ZodTuple) {
    return (schema.items as z.ZodType[]).map((item) =>
      generateInvalidSkeleton(item),
    )
  }
  if (schema instanceof z.ZodEffects)
    return generateInvalidSkeleton(schema.innerType())
  if (schema instanceof z.ZodLazy) {
    try {
      return generateInvalidSkeleton(schema.schema)
    } catch {
      return undefined
    }
  }
  if (schema instanceof z.ZodIntersection) {
    const left = generateInvalidSkeleton(schema._def.left)
    const right = generateInvalidSkeleton(schema._def.right)
    if (
      typeof left === 'object' &&
      typeof right === 'object' &&
      left !== null &&
      right !== null
    ) {
      return { ...left, ...right }
    }
    return left
  }
  return undefined
}

/**
 * Generates alternative invalid data (non-empty strings that fail format validations).
 */
const generateAlternativeInvalidSkeleton = (schema: z.ZodType): unknown => {
  if (schema instanceof z.ZodString) return 'x'
  if (schema instanceof z.ZodNumber) return -1
  if (schema instanceof z.ZodBoolean) return false
  if (schema instanceof z.ZodDate) return 'invalid-date'
  if (schema instanceof z.ZodEnum) return '__invalid__'
  if (schema instanceof z.ZodNativeEnum) return '__invalid__'
  if (schema instanceof z.ZodLiteral) return '__invalid__'
  if (schema instanceof z.ZodArray) return ['']
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(shape)) {
      result[key] = generateAlternativeInvalidSkeleton(value as z.ZodType)
    }
    return result
  }
  if (schema instanceof z.ZodOptional)
    return generateAlternativeInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodNullable)
    return generateAlternativeInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodDefault)
    return generateAlternativeInvalidSkeleton(schema._def.innerType)
  if (schema instanceof z.ZodUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0
      ? generateAlternativeInvalidSkeleton(options[0])
      : undefined
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0
      ? generateAlternativeInvalidSkeleton(options[0])
      : undefined
  }
  if (schema instanceof z.ZodRecord) return {}
  if (schema instanceof z.ZodTuple) {
    return (schema.items as z.ZodType[]).map((item) =>
      generateAlternativeInvalidSkeleton(item),
    )
  }
  if (schema instanceof z.ZodEffects)
    return generateAlternativeInvalidSkeleton(schema.innerType())
  if (schema instanceof z.ZodLazy) {
    try {
      return generateAlternativeInvalidSkeleton(schema.schema)
    } catch {
      return undefined
    }
  }
  if (schema instanceof z.ZodIntersection) {
    const left = generateAlternativeInvalidSkeleton(schema._def.left)
    const right = generateAlternativeInvalidSkeleton(schema._def.right)
    if (
      typeof left === 'object' &&
      typeof right === 'object' &&
      left !== null &&
      right !== null
    ) {
      return { ...left, ...right }
    }
    return left
  }
  return undefined
}

const collectDescriptorsFromIssues = (
  issues: z.ZodIssue[],
  seen: Set<string>,
  result: ValidationMessageDescriptorInfo[],
): void => {
  for (const issue of issues) {
    if (issue.code !== ZodIssueCode.custom) continue
    const params = issue.params as Record<string, unknown> | undefined
    if (!params || typeof params.id !== 'string') continue
    if (!NAMESPACE_REGEX.test(params.id)) continue
    if (seen.has(params.id)) continue
    seen.add(params.id)
    result.push({
      id: params.id,
      defaultMessage:
        typeof params.defaultMessage === 'string'
          ? params.defaultMessage
          : undefined,
      description:
        typeof params.description === 'string' ? params.description : undefined,
      fieldPath: issue.path.join('.'),
    })
  }
}

/**
 * Extracts validation message descriptors from a zod dataSchema by running
 * safeParse with multiple invalid inputs and collecting the params from
 * resulting ZodIssues that contain message descriptors.
 */
export const extractValidationDescriptors = (
  schema: Schema | z.ZodEffects<any, any, any>,
): ValidationMessageDescriptorInfo[] => {
  const result: ValidationMessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const testInputs = [
    {},
    generateInvalidSkeleton(schema),
    generateAlternativeInvalidSkeleton(schema),
  ]

  for (const input of testInputs) {
    const parseResult = schema.safeParse(input)
    if (!parseResult.success) {
      collectDescriptorsFromIssues(parseResult.error.issues, seen, result)
    }
  }

  // Also try parsing sub-schemas individually for nested objects with refinements
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodType>
    for (const [key, subSchema] of Object.entries(shape)) {
      const subInputs = [
        generateInvalidSkeleton(subSchema),
        generateAlternativeInvalidSkeleton(subSchema),
      ]
      for (const input of subInputs) {
        const parseResult = subSchema.safeParse(input)
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            if (issue.code !== ZodIssueCode.custom) continue
            const params = issue.params as Record<string, unknown> | undefined
            if (!params || typeof params.id !== 'string') continue
            if (!NAMESPACE_REGEX.test(params.id)) continue
            if (seen.has(params.id)) continue
            seen.add(params.id)
            result.push({
              id: params.id,
              defaultMessage:
                typeof params.defaultMessage === 'string'
                  ? params.defaultMessage
                  : undefined,
              description:
                typeof params.description === 'string'
                  ? params.description
                  : undefined,
              fieldPath: [key, ...issue.path].join('.'),
            })
          }
        }
      }
    }
  }

  return result
}

const extractStaticText = (text: StaticText | undefined): string | null => {
  if (!text) return null
  if (typeof text === 'string') return text
  if (typeof text === 'object' && 'defaultMessage' in text) {
    return (text.defaultMessage as string) ?? text.id ?? null
  }
  return null
}

const resolveTemplateDisplayName = (
  template: { name?: unknown },
  fallback: string,
): string => {
  if (typeof template.name === 'function') {
    const { staticText } = tryInvokeFormTextFunction(template.name as Function)
    return staticText ?? fallback
  }
  return extractStaticText(template.name as StaticText) ?? fallback
}

const templateDisplayNameCache = new Map<string, string>()

const getTemplateDisplayName = async (
  typeId: ApplicationTypes,
  fallback: string,
): Promise<string> => {
  const cached = templateDisplayNameCache.get(typeId)
  if (cached) {
    return cached
  }

  try {
    const template = await getApplicationTemplateByTypeId(typeId)
    const name = resolveTemplateDisplayName(template, fallback)
    templateDisplayNameCache.set(typeId, name)
    return name
  } catch {
    templateDisplayNameCache.set(typeId, fallback)
    return fallback
  }
}

const isMessageDescriptor = (obj: unknown): obj is MessageDescriptor => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as MessageDescriptor).id === 'string'
  )
}

const tryInvokeFormTextFunction = (
  fn: Function,
): {
  descriptors: MessageDescriptorInfo[]
  staticText: string | null
} => {
  try {
    const mockApp = {
      answers: {},
      externalData: {},
      id: '',
      state: '',
      typeId: '',
      applicant: '',
      assignees: [],
      applicantActors: [],
      modified: new Date(),
      created: new Date(),
      attachments: {},
      status: 'draft',
    }
    const result = fn(mockApp, 'is')
    if (isMessageDescriptor(result)) {
      return {
        descriptors: [
          {
            id: String(result.id),
            defaultMessage: result.defaultMessage as string | undefined,
            description: result.description as string | undefined,
          },
        ],
        staticText: extractStaticText(result as StaticText),
      }
    }
  } catch {
    // Function depends on specific application data; skip gracefully.
  }
  return { descriptors: [], staticText: null }
}

const extractMessageDescriptorsFromFormText = (
  text: FormText | FormTextWithLocale | undefined,
): MessageDescriptorInfo[] => {
  if (!text) return []
  if (typeof text === 'function') return []
  if (typeof text === 'string') return []
  if (isMessageDescriptor(text)) {
    return [
      {
        id: String(text.id),
        defaultMessage: text.defaultMessage as string | undefined,
        description: text.description as string | undefined,
      },
    ]
  }
  return []
}

const MAX_PROPS_DESCRIPTOR_DEPTH = 12

/**
 * Recursively collects `MessageDescriptor`-shaped objects from field `props` (e.g. CUSTOM fields).
 */
const extractMessageDescriptorsFromPropsDeep = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>,
): MessageDescriptorInfo[] => {
  if (depth > MAX_PROPS_DESCRIPTOR_DEPTH) {
    return []
  }
  if (value === null || value === undefined) {
    return []
  }
  const valueType = typeof value
  if (
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean' ||
    valueType === 'bigint' ||
    valueType === 'symbol'
  ) {
    return []
  }
  if (valueType === 'function') {
    return []
  }
  if (isMessageDescriptor(value)) {
    return [
      {
        id: String((value as MessageDescriptor).id),
        defaultMessage: (value as MessageDescriptor).defaultMessage as
          | string
          | undefined,
        description: (value as MessageDescriptor).description as
          | string
          | undefined,
      },
    ]
  }
  if (Array.isArray(value)) {
    if (visited.has(value)) {
      return []
    }
    visited.add(value)
    const out: MessageDescriptorInfo[] = []
    for (const el of value) {
      out.push(
        ...extractMessageDescriptorsFromPropsDeep(el, depth + 1, visited),
      )
    }
    return out
  }
  if (typeof value === 'object') {
    const obj = value as object
    if (visited.has(obj)) {
      return []
    }
    visited.add(obj)
    const out: MessageDescriptorInfo[] = []
    for (const v of Object.values(value as Record<string, unknown>)) {
      out.push(...extractMessageDescriptorsFromPropsDeep(v, depth + 1, visited))
    }
    return out
  }
  return []
}

const walkExternalDataSourceItem = (
  syntheticId: string,
  provider: DataProviderItem,
): ScreenIntrospection => {
  const descriptors: MessageDescriptorInfo[] = []
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.pageTitle as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.title as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.subTitle as FormText | undefined,
    ),
  )

  return {
    id: syntheticId,
    type: 'EXTERNAL_DATA_SOURCE',
    title: extractStaticText(provider.title as StaticText | undefined),
    description: extractStaticText(provider.subTitle as StaticText | undefined),
    pageTitle: extractStaticText(provider.pageTitle as StaticText | undefined),
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: null,
    marginBottom: null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: undefined,
  }
}

const stubApplicationForOptionPreview = (): Application => {
  return {
    answers: {},
    externalData: {},
    id: '',
    state: '',
    typeId: '',
    applicant: '',
    assignees: [],
    applicantActors: [],
    modified: new Date(),
    created: new Date(),
    attachments: {},
    status: 'draft',
  } as unknown as Application
}

const stubUserForIdPreview = (): BffUser => {
  const nationalId = '0000000000'
  return {
    nationalId,
    profile: { nationalId },
  } as unknown as BffUser
}

const extractStaticId = (id: unknown): string => {
  if (id === undefined || id === null) return ''
  if (typeof id === 'string') return id
  if (typeof id === 'function') {
    try {
      const stubApp = stubApplicationForOptionPreview()
      const stubUser = stubUserForIdPreview()
      const result = (
        id as (application: Application, user: BffUser) => string
      )(stubApp, stubUser)
      return typeof result === 'string' ? result : '[dynamic]'
    } catch {
      return '[dynamic]'
    }
  }
  return String(id)
}

/**
 * Evaluate `MaybeWithApplicationAndFieldAndLocale<Option[]>` so radio/checkbox previews
 * can show labels when templates pass option factories (e.g. `getOtherFeesPayeeOptions`).
 */
const tryResolveOptionsArrayForPreview = (
  options: RadioField['options'] | CheckboxField['options'],
  fieldContext: RadioField | CheckboxField,
): Option[] | undefined => {
  if (Array.isArray(options)) {
    return options
  }
  if (typeof options !== 'function') {
    return undefined
  }
  const stubApp = stubApplicationForOptionPreview()
  const locales: Locale[] = ['is', 'en']
  for (const locale of locales) {
    try {
      const result = (
        options as (
          application: Application,
          field: Field,
          locale: Locale,
        ) => Option[]
      )(stubApp, fieldContext, locale)
      if (Array.isArray(result)) {
        return result
      }
    } catch {
      // Factory may require real answers; try next locale or give up.
    }
  }
  return undefined
}

const extractFieldOptionsForPreview = (
  options: RadioField['options'] | CheckboxField['options'],
  fieldContext: RadioField | CheckboxField,
): RadioOptionIntrospection[] | undefined => {
  const raw = tryResolveOptionsArrayForPreview(options, fieldContext)
  if (!raw) {
    return undefined
  }
  return raw.map((option) => {
    const label = option.label
    if (isMessageDescriptor(label)) {
      return {
        value: option.value,
        labelMessageId: String(label.id),
        labelDefaultMessage:
          (label.defaultMessage as string | undefined) ?? null,
      }
    }
    if (typeof label === 'function') {
      return {
        value: option.value,
        labelDefaultMessage: option.value,
      }
    }
    if (typeof label === 'string') {
      return { value: option.value, labelDefaultMessage: label }
    }
    return {
      value: option.value,
      labelDefaultMessage: extractStaticText(label as StaticText),
    }
  })
}

const extractRadioPreviewOptions = (
  field: RadioField,
): RadioOptionIntrospection[] | undefined => {
  return extractFieldOptionsForPreview(field.options, field)
}

const extractCheckboxPreviewOptions = (
  field: CheckboxField,
): RadioOptionIntrospection[] | undefined => {
  return extractFieldOptionsForPreview(field.options, field)
}

const extractDisplayFieldMessageDescriptors = (
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

const displayFieldStaticIntrospectionFromLeaf = (
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

const textFieldIntrospectionFromLeaf = (
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

const imageFieldIntrospectionFromLeaf = (
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

const extractMessageDescriptorsFromField = (
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

const mergeMessageDescriptors = (
  base: MessageDescriptorInfo[],
  extra: MessageDescriptorInfo[],
): MessageDescriptorInfo[] => {
  const out = [...base]
  for (const x of extra) {
    if (!out.some((z) => z.id === x.id)) {
      out.push(x)
    }
  }
  return out
}

const enrichNationalIdWithNameFieldDescriptors = (
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

const enrichNationalIdWithNameRepeaterItemDescriptors = (
  item: RepeaterItem,
  descriptors: MessageDescriptorInfo[],
): MessageDescriptorInfo[] => {
  if (item.component !== 'nationalIdWithName') {
    return descriptors
  }
  return enrichNationalIdWithNameFieldDescriptors(item, descriptors)
}

const mapRepeaterItemToFieldType = (item: RepeaterItem): string => {
  switch (item.component) {
    case 'input': {
      const t = 'type' in item ? item.type : undefined
      if (t === 'email') {
        return FieldTypes.EMAIL
      }
      if (t === 'tel') {
        return FieldTypes.PHONE
      }
      return FieldTypes.TEXT
    }
    case 'phone':
      return FieldTypes.PHONE
    case 'nationalIdWithName':
      return FieldTypes.NATIONAL_ID_WITH_NAME
    case 'date':
      return FieldTypes.DATE
    case 'select':
      return FieldTypes.SELECT
    case 'selectAsync':
      return FieldTypes.ASYNC_SELECT
    case 'radio':
      return FieldTypes.RADIO
    case 'checkbox':
      return FieldTypes.CHECKBOX
    case 'fileUpload':
      return FieldTypes.FILEUPLOAD
    case 'description':
      return FieldTypes.DESCRIPTION
    case 'alertMessage':
      return FieldTypes.ALERT_MESSAGE
    case 'vehiclePermnoWithInfo':
      return FieldTypes.VEHICLE_PERMNO_WITH_INFO
    case 'hiddenInput':
      return FieldTypes.HIDDEN_INPUT
    default:
      return FieldTypes.TEXT
  }
}

const buildTableRepeaterColumnHeaderDescriptors = (
  tr: TableRepeaterField,
): MessageDescriptorInfo[] => {
  const fields = tr.fields ?? {}
  const items: Array<RepeaterItem & { id: string }> = Object.keys(fields).map(
    (id) => ({ id, ...fields[id] } as RepeaterItem & { id: string }),
  )
  const tableItems = items.filter((x) => x.displayInTable !== false)

  const tableHeader = tr.table?.header
  if (Array.isArray(tableHeader) && tableHeader.length > 0) {
    const out: MessageDescriptorInfo[] = []
    for (const h of tableHeader) {
      out.push(...extractMessageDescriptorsFromFormText(h as FormText))
    }
    return out
  }

  const out: MessageDescriptorInfo[] = []
  for (const item of tableItems) {
    if (item.component === 'nationalIdWithName') {
      out.push(
        ...extractMessageDescriptorsFromFormText(coreMessages.name as FormText),
        ...extractMessageDescriptorsFromFormText(
          coreMessages.nationalId as FormText,
        ),
      )
    } else if (item.component === 'description' && 'title' in item) {
      const t = (item as { title: StaticText }).title
      const st =
        typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
      out.push(...extractMessageDescriptorsFromFormText(st as FormText))
    } else if (item.component === 'fileUpload' && 'title' in item) {
      const t = (item as { title?: StaticText }).title
      if (t) {
        const st =
          typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
        out.push(...extractMessageDescriptorsFromFormText(st as FormText))
      }
    } else {
      const lab = item.label
      if (!lab) {
        continue
      }
      const st =
        typeof lab === 'function' ? (lab as (i: number) => StaticText)(0) : lab
      out.push(...extractMessageDescriptorsFromFormText(st as FormText))
    }
  }
  return out
}

const walkRepeaterItemToScreen = (
  repeaterId: string,
  itemKey: string,
  item: RepeaterItem,
): ScreenIntrospection => {
  const id = `${repeaterId}::repeaterItem::${itemKey}`
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  if (item.component === 'description' && 'title' in item) {
    const t = (item as { title: StaticText }).title
    const st = typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    pushText(st)
  } else if (item.component === 'fileUpload') {
    const fu = item as RepeaterItem & { component: 'fileUpload' }
    pushText(fu.title)
    pushText(fu.introduction)
    pushText(fu.uploadHeader)
    pushText(fu.uploadDescription)
    pushText(fu.uploadButtonLabel)
    pushText(fu.maxSizeErrorText)
  } else if (item.component === 'alertMessage') {
    const am = item as RepeaterItem & { component: 'alertMessage' }
    if (am.title && typeof am.title !== 'function') {
      pushText(am.title as StaticText)
    }
    if (am.message && typeof am.message !== 'function') {
      pushText(am.message as StaticText)
    }
  } else if (item.component === 'vehiclePermnoWithInfo') {
    const v = item as RepeaterItem & { component: 'vehiclePermnoWithInfo' }
    pushText(v.permnoLabel)
    pushText(v.makeAndColorLabel)
    pushText(v.errorTitle)
    pushText(v.fallbackErrorMessage)
    pushText(v.validationFailedErrorMessage)
  } else if (item.component === 'selectAsync') {
    const sa = item as RepeaterItem & { component: 'selectAsync' }
    pushText(sa.loadingError)
  } else if ('label' in item && item.label) {
    const lab = item.label
    const st =
      typeof lab === 'function' ? (lab as (i: number) => StaticText)(0) : lab
    descriptors.push(...extractMessageDescriptorsFromFormText(st as FormText))
  }
  if (item.component === 'phone' && item.phoneLabel) {
    pushText(item.phoneLabel as FormText)
  }
  if (item.component === 'nationalIdWithName') {
    if (item.customNameLabel) {
      pushText(item.customNameLabel as FormText)
    }
    if (item.customNationalIdLabel) {
      pushText(item.customNationalIdLabel as FormText)
    }
  }
  if ('placeholder' in item && item.placeholder) {
    pushText(item.placeholder)
  }
  if (
    (item.component === 'radio' ||
      item.component === 'select' ||
      item.component === 'checkbox') &&
    Array.isArray(item.options)
  ) {
    for (const opt of item.options) {
      if (opt && typeof opt === 'object' && 'label' in opt) {
        pushText((opt as { label: FormText }).label)
        if ('tooltip' in opt && (opt as { tooltip?: FormText }).tooltip) {
          pushText((opt as { tooltip: FormText }).tooltip)
        }
      }
    }
  }

  const labelStatic: StaticText | undefined = (() => {
    if (item.component === 'description' && 'title' in item) {
      const t = (item as { title: StaticText }).title
      return typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    }
    if (item.component === 'fileUpload' && 'title' in item) {
      const t = (item as { title?: StaticText }).title
      if (!t) return undefined
      return typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    }
    if (!('label' in item) || !item.label) {
      return undefined
    }
    const lab = item.label
    return typeof lab === 'function'
      ? (lab as (i: number) => StaticText)(0)
      : lab
  })()

  const title = extractStaticText(labelStatic)
  const widthStr =
    item.width === 'half' || item.width === 'full' || item.width === 'third'
      ? item.width
      : null

  const finalDescriptors =
    item.component === 'nationalIdWithName'
      ? enrichNationalIdWithNameRepeaterItemDescriptors(item, descriptors)
      : descriptors

  let radioOptions: RadioOptionIntrospection[] | undefined
  let radioLargeButtons: boolean | null | undefined
  let radioBackgroundColor: string | null | undefined
  let checkboxOptions: RadioOptionIntrospection[] | undefined
  let checkboxLarge: boolean | null | undefined
  let checkboxStrong: boolean | null | undefined
  let checkboxBackgroundColor: string | null | undefined
  let checkboxSpacing: number | null | undefined

  if (item.component === 'radio' && item.options) {
    const pseudo = {
      id,
      type: FieldTypes.RADIO,
      options: item.options,
    } as RadioField
    radioOptions = extractRadioPreviewOptions(pseudo)
    if (
      typeof (item as { largeButtons?: boolean }).largeButtons === 'boolean'
    ) {
      radioLargeButtons = (item as { largeButtons?: boolean }).largeButtons
    }
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      radioBackgroundColor = item.backgroundColor
    }
  }
  if (item.component === 'checkbox' && item.options) {
    const pseudo = {
      id,
      type: FieldTypes.CHECKBOX,
      options: item.options,
    } as CheckboxField
    checkboxOptions = extractCheckboxPreviewOptions(pseudo)
    const cb = item as { large?: boolean; strong?: boolean }
    checkboxLarge = typeof cb.large === 'boolean' ? cb.large : true
    checkboxStrong = typeof cb.strong === 'boolean' ? cb.strong : false
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      checkboxBackgroundColor = item.backgroundColor
    } else {
      checkboxBackgroundColor = 'blue'
    }
  }

  let inputBackgroundColor: string | null | undefined
  if (
    item.component !== 'radio' &&
    item.component !== 'checkbox' &&
    (item.component === 'input' ||
      item.component === 'phone' ||
      item.component === 'date' ||
      item.component === 'select' ||
      item.component === 'selectAsync' ||
      item.component === 'nationalIdWithName')
  ) {
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      inputBackgroundColor = item.backgroundColor
    }
  }

  const titleVariantStr =
    item.component === 'description' && 'titleVariant' in item
      ? String((item as { titleVariant?: string }).titleVariant ?? '')
      : null

  const base: ScreenIntrospection = {
    id,
    type: mapRepeaterItemToFieldType(item),
    title: title && title.length > 0 ? title : null,
    description: null,
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: widthStr,
    space: null,
    marginTop: null,
    marginBottom: null,
    paddingTop: null,
    titleVariant:
      titleVariantStr && titleVariantStr.length > 0 ? titleVariantStr : null,
    messageDescriptors: finalDescriptors,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor: radioBackgroundColor ?? null,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
    inputBackgroundColor: inputBackgroundColor ?? null,
  }

  if (item.component === 'nationalIdWithName') {
    return {
      ...base,
      type: FieldTypes.NATIONAL_ID_WITH_NAME,
      nationalIdWithNameCustomNationalIdLabelText: extractStaticText(
        item.customNationalIdLabel as StaticText | undefined,
      ),
      nationalIdWithNameCustomNameLabelText: extractStaticText(
        item.customNameLabel as StaticText | undefined,
      ),
      nationalIdWithNameShowPhoneField: item.showPhoneField ?? null,
      nationalIdWithNameShowEmailField: item.showEmailField ?? null,
      nationalIdWithNamePhoneLabelText: extractStaticText(
        item.phoneLabel as StaticText | undefined,
      ),
      nationalIdWithNameEmailLabelText: extractStaticText(
        item.emailLabel as StaticText | undefined,
      ),
    }
  }

  return base
}

const walkTableRepeaterScreen = (
  tr: TableRepeaterField,
): ScreenIntrospection => {
  const trRecord = tr as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  pushText(tr.title)
  pushText(trRecord.description)
  pushText(tr.formTitle)
  pushText(tr.addItemButtonText)
  pushText(tr.cancelButtonText)
  pushText(tr.saveItemButtonText)
  pushText(tr.removeButtonTooltipText)
  pushText(tr.editButtonTooltipText)
  pushText(tr.loadErrorMessage)

  const columnHeaders = buildTableRepeaterColumnHeaderDescriptors(tr)
  for (const d of columnHeaders) {
    if (!descriptors.some((x) => x.id === d.id)) {
      descriptors.push(d)
    }
  }

  const formScreens: ScreenIntrospection[] = []
  for (const [key, item] of Object.entries(tr.fields ?? {})) {
    const s = walkRepeaterItemToScreen(extractStaticId(tr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: extractStaticId(tr.id),
    type: FieldTypes.TABLE_REPEATER,
    title: extractStaticText(tr.title as StaticText | undefined),
    description: extractStaticText(
      trRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: tr.marginTop ?? null,
    marginBottom: tr.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: formScreens.length > 0 ? formScreens : undefined,
    tableRepeaterColumnHeaders: columnHeaders,
    tableRepeaterFormTitle: extractStaticText(
      tr.formTitle as StaticText | undefined,
    ),
    tableRepeaterAddItemButtonText: extractStaticText(
      tr.addItemButtonText as StaticText | undefined,
    ),
    tableRepeaterCancelButtonText: extractStaticText(
      tr.cancelButtonText as StaticText | undefined,
    ),
    tableRepeaterSaveItemButtonText: extractStaticText(
      tr.saveItemButtonText as StaticText | undefined,
    ),
  }
}

const walkFieldsRepeaterScreen = (
  fr: FieldsRepeaterField,
): ScreenIntrospection => {
  const frRecord = fr as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  pushText(fr.title)
  pushText(frRecord.description)
  if (fr.formTitle && typeof fr.formTitle !== 'function') {
    pushText(fr.formTitle)
  }
  pushText(fr.addItemButtonText)
  pushText(fr.removeItemButtonText)
  if (fr.saveItemButtonText) {
    pushText(fr.saveItemButtonText)
  }

  const formScreens: ScreenIntrospection[] = []
  for (const [key, item] of Object.entries(fr.fields ?? {})) {
    const s = walkRepeaterItemToScreen(extractStaticId(fr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: extractStaticId(fr.id),
    type: FieldTypes.FIELDS_REPEATER,
    title: extractStaticText(fr.title as StaticText | undefined),
    description: extractStaticText(
      frRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: fr.marginTop ?? null,
    marginBottom: fr.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: formScreens.length > 0 ? formScreens : undefined,
    fieldsRepeaterFormTitle:
      fr.formTitle && typeof fr.formTitle !== 'function'
        ? extractStaticText(fr.formTitle as StaticText)
        : null,
    fieldsRepeaterAddItemButtonText: extractStaticText(
      fr.addItemButtonText as StaticText | undefined,
    ),
    fieldsRepeaterRemoveItemButtonText: extractStaticText(
      fr.removeItemButtonText as StaticText | undefined,
    ),
  }
}

const addDescriptorIfNew = (
  target: MessageDescriptorInfo[],
  d: MessageDescriptorInfo,
) => {
  if (!target.some((x) => x.id === d.id)) {
    target.push(d)
  }
}

const walkStaticTableScreen = (st: StaticTableField): ScreenIntrospection => {
  const stRecord = st as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const mergeIn = (arr: MessageDescriptorInfo[]) => {
    for (const d of arr) {
      addDescriptorIfNew(descriptors, d)
    }
  }
  const mergeText = (t: unknown) => {
    if (t) {
      mergeIn(extractMessageDescriptorsFromFormText(t as FormText))
    }
  }
  mergeText(st.title)
  mergeText(stRecord.description)

  const headerFromFunction = typeof st.header === 'function'
  const headerDescriptors: MessageDescriptorInfo[] = []
  if (!headerFromFunction && Array.isArray(st.header)) {
    for (const h of st.header) {
      const part = extractMessageDescriptorsFromFormText(h as FormText)
      if (part[0]) {
        headerDescriptors.push(part[0])
        addDescriptorIfNew(descriptors, part[0])
      }
    }
  }

  const rowsFromFunction = typeof st.rows === 'function'
  const rowCellFlat: MessageDescriptorInfo[] = []
  let rowCount = 0
  let colCount = headerDescriptors.length

  if (!rowsFromFunction && Array.isArray(st.rows)) {
    rowCount = st.rows.length
    for (const row of st.rows) {
      colCount = Math.max(colCount, row.length)
      for (const cell of row) {
        const part = extractMessageDescriptorsFromFormText(cell as FormText)
        if (part[0]) {
          rowCellFlat.push(part[0])
          addDescriptorIfNew(descriptors, part[0])
        }
      }
    }
  }

  if (headerDescriptors.length > 0) {
    colCount = Math.max(colCount, headerDescriptors.length)
  } else if (!headerFromFunction && colCount === 0 && rowCount > 0 && st.rows) {
    const r0 = (st.rows as StaticText[][])[0]
    if (r0) {
      colCount = r0.length
    }
  }

  const summaryRows: Array<{
    label: MessageDescriptorInfo
    value: MessageDescriptorInfo
  }> = []
  if (st.summary && typeof st.summary !== 'function') {
    for (const s of st.summary) {
      const ld = extractMessageDescriptorsFromFormText(s.label as FormText)
      const vd = extractMessageDescriptorsFromFormText(s.value as FormText)
      if (ld[0] && vd[0]) {
        summaryRows.push({ label: ld[0], value: vd[0] })
        addDescriptorIfNew(descriptors, ld[0])
        addDescriptorIfNew(descriptors, vd[0])
      }
    }
  }

  return {
    id: extractStaticId(st.id) || 'staticTable',
    type: FieldTypes.STATIC_TABLE,
    title: extractStaticText(st.title as StaticText | undefined),
    description: extractStaticText(
      stRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: 'full',
    space: null,
    marginTop: st.marginTop ?? null,
    marginBottom: st.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    staticTableHeaderDescriptors:
      headerDescriptors.length > 0 ? headerDescriptors : undefined,
    staticTableRowCellDescriptors:
      rowCellFlat.length > 0 ? rowCellFlat : undefined,
    staticTableColumnCount: colCount > 0 ? colCount : null,
    staticTableRowCount: rowCount,
    staticTableHeaderFromFunction: headerFromFunction ? true : null,
    staticTableRowsFromFunction: rowsFromFunction ? true : null,
    staticTableTitleVariant: st.titleVariant ?? 'h4',
    staticTableSummary: summaryRows.length > 0 ? summaryRows : undefined,
  }
}

/**
 * Template `field.backgroundColor` for input-like fields (exposed to translation preview as `inputBackgroundColor`).
 */
const extractInputBackgroundColorFromLeaf = (
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

const extractDescriptorsFromFormTextMaybeArray = (
  text: FormText | FormTextArray | undefined,
): MessageDescriptorInfo[] => {
  if (!text) return []
  if (typeof text === 'function') return []
  if (Array.isArray(text)) {
    let acc: MessageDescriptorInfo[] = []
    for (const t of text) {
      acc = mergeMessageDescriptors(
        acc,
        extractMessageDescriptorsFromFormText(t as FormText),
      )
    }
    return acc
  }
  return extractMessageDescriptorsFromFormText(text as FormText)
}

const extractDescriptorsFromKeyValueItem = (
  item: KeyValueItem,
): MessageDescriptorInfo[] => {
  let out = extractDescriptorsFromFormTextMaybeArray(item.keyText)
  out = mergeMessageDescriptors(
    out,
    extractDescriptorsFromFormTextMaybeArray(item.valueText),
  )
  return out
}

const extractSubmitActionsForPreview = (
  sf: SubmitField,
): SubmitActionIntrospection[] => {
  return sf.actions.map((action) => {
    const event =
      typeof action.event === 'object'
        ? String((action.event as { type: string }).type)
        : String(action.event)
    const label = action.name
    if (isMessageDescriptor(label)) {
      return {
        event,
        labelMessageId: String(label.id),
        labelDefaultMessage:
          (label.defaultMessage as string | undefined) ?? null,
        buttonType: action.type,
      }
    }
    if (typeof label === 'function') {
      return {
        event,
        labelDefaultMessage: event,
        buttonType: action.type,
      }
    }
    if (typeof label === 'string') {
      return {
        event,
        labelDefaultMessage: label,
        buttonType: action.type,
      }
    }
    return {
      event,
      labelDefaultMessage: extractStaticText(label as StaticText),
      buttonType: action.type,
    }
  })
}

/**
 * Best-effort: run overview `items(answers, …)` with stub inputs so row-level
 * FormText message ids can appear on the OVERVIEW screen for translation tooling.
 */
const extractOverviewItemsDescriptorsBestEffort = (
  field: OverviewField,
): MessageDescriptorInfo[] => {
  const collected: MessageDescriptorInfo[] = []
  const itemsFn = field.items
  if (typeof itemsFn !== 'function') {
    return collected
  }
  const stubAnswers = {} as FormValue
  const stubExternal = {} as ExternalData
  const locales = ['is', 'en'] as const
  const stubNi = '0000000000'
  for (const locale of locales) {
    try {
      const rows = itemsFn(stubAnswers, stubExternal, stubNi, locale)
      if (!Array.isArray(rows)) continue
      for (const row of rows) {
        for (const d of extractDescriptorsFromKeyValueItem(row)) {
          addDescriptorIfNew(collected, d)
        }
      }
    } catch {
      // Overview factories often require populated answers; ignore.
    }
  }
  return collected
}

const walkFormLeaf = (
  leaf: FormLeaf,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): ScreenIntrospection => {
  const descriptors: MessageDescriptorInfo[] = []
  const children: ScreenIntrospection[] = []
  const leafRecord = leaf as unknown as Record<string, unknown>
  const nifMeta: {
    nationalIdWithNameCustomNationalIdLabelText?: string | null
    nationalIdWithNameCustomNameLabelText?: string | null
    nationalIdWithNameShowPhoneField?: boolean | null
    nationalIdWithNameShowEmailField?: boolean | null
    nationalIdWithNamePhoneLabelText?: string | null
    nationalIdWithNameEmailLabelText?: string | null
  } = {}

  const fileUploadMeta: {
    fileUploadHeader?: string | null
    fileUploadDescription?: string | null
    fileUploadButtonLabel?: string | null
    fileUploadIntroduction?: string | null
  } = {}

  let description: string | null = null
  let subTitle: string | null = null
  let subDescription: string | null = null
  let checkboxLabel: string | null = null
  let width: string | null = null
  let space: number | null = null
  let marginTop: unknown = null
  let marginBottom: unknown = null
  let paddingTop: unknown = null
  let titleVariant: string | null = null
  let submitPlacementOut: string | null | undefined
  let submitActionsOut: SubmitActionIntrospection[] | undefined
  let inputPlaceholder: string | null = null

  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    descriptors.push(...extractMessageDescriptorsFromFormText(leaf.title))
    const multiField = leaf as MultiField
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(multiField.description),
    )
    description = extractStaticText(
      multiField.description as StaticText | undefined,
    )
    if (typeof leafRecord.space === 'number') {
      space = leafRecord.space as number
    }
    if (multiField.children) {
      for (const child of multiField.children) {
        const childScreen = walkFormLeaf(child, customFieldManifest)
        children.push(childScreen)
        descriptors.push(...childScreen.messageDescriptors)
      }
    }
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    descriptors.push(...extractMessageDescriptorsFromFormText(leaf.title))
    const edp = leafRecord
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.subTitle as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.description as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.checkboxLabel as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.subDescription as FormText | undefined,
      ),
    )
    description = extractStaticText(edp.description as StaticText | undefined)
    subTitle = extractStaticText(edp.subTitle as StaticText | undefined)
    subDescription = extractStaticText(
      edp.subDescription as StaticText | undefined,
    )
    checkboxLabel = extractStaticText(
      edp.checkboxLabel as StaticText | undefined,
    )

    const externalDataLeafId = extractStaticId(leaf.id) || 'external'
    const dataProviders =
      (edp.dataProviders as DataProviderItem[] | undefined) ?? []
    for (const provider of dataProviders) {
      if (!provider?.id) continue
      const childScreen = walkExternalDataSourceItem(
        `${externalDataLeafId}::${extractStaticId(provider.id) || 'provider'}`,
        provider,
      )
      children.push(childScreen)
      descriptors.push(...childScreen.messageDescriptors)
    }

    const otherPermissions =
      (edp.otherPermissions as DataProviderItem[] | undefined) ?? []
    for (const permission of otherPermissions) {
      if (!permission?.id) continue
      const childScreen = walkExternalDataSourceItem(
        `${externalDataLeafId}::perm::${
          extractStaticId(permission.id) || 'permission'
        }`,
        permission,
      )
      children.push(childScreen)
      descriptors.push(...childScreen.messageDescriptors)
    }
  } else if (leaf.type === FieldTypes.STATIC_TABLE) {
    return walkStaticTableScreen(leaf as StaticTableField)
  } else if (leaf.type === FieldTypes.TABLE_REPEATER) {
    return walkTableRepeaterScreen(leaf as TableRepeaterField)
  } else if (leaf.type === FieldTypes.FIELDS_REPEATER) {
    return walkFieldsRepeaterScreen(leaf as FieldsRepeaterField)
  } else {
    const field = leaf as Field
    let fromField = extractMessageDescriptorsFromField(field)
    if (leaf.type === FieldTypes.SUBMIT) {
      const sf = leaf as SubmitField
      for (const action of sf.actions) {
        fromField = mergeMessageDescriptors(
          fromField,
          extractMessageDescriptorsFromFormText(action.name),
        )
      }
      submitPlacementOut = sf.placement ?? 'footer'
      submitActionsOut = extractSubmitActionsForPreview(sf)
    }
    if (leaf.type === FieldTypes.OVERVIEW) {
      fromField = mergeMessageDescriptors(
        fromField,
        extractOverviewItemsDescriptorsBestEffort(field as OverviewField),
      )
    }
    if (leaf.type === FieldTypes.NATIONAL_ID_WITH_NAME) {
      const nif = leaf as NationalIdWithNameField
      fromField = enrichNationalIdWithNameFieldDescriptors(nif, fromField)
      nifMeta.nationalIdWithNameCustomNationalIdLabelText = extractStaticText(
        nif.customNationalIdLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameCustomNameLabelText = extractStaticText(
        nif.customNameLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameShowPhoneField = nif.showPhoneField ?? null
      nifMeta.nationalIdWithNameShowEmailField = nif.showEmailField ?? null
      nifMeta.nationalIdWithNamePhoneLabelText = extractStaticText(
        nif.phoneLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameEmailLabelText = extractStaticText(
        nif.emailLabel as StaticText | undefined,
      )
    }
    if (leaf.type === FieldTypes.FILEUPLOAD) {
      const fu = leaf as FileUploadField
      const pushFileUploadDescriptor = (t: unknown) => {
        if (t) {
          for (const d of extractMessageDescriptorsFromFormText(
            t as FormText,
          )) {
            if (!fromField.some((x) => x.id === d.id)) {
              fromField.push(d)
            }
          }
        }
      }
      pushFileUploadDescriptor(fu.introduction)
      pushFileUploadDescriptor(fu.uploadHeader)
      pushFileUploadDescriptor(fu.uploadDescription)
      pushFileUploadDescriptor(fu.uploadButtonLabel)
      fileUploadMeta.fileUploadHeader = extractStaticText(
        fu.uploadHeader as StaticText | undefined,
      )
      fileUploadMeta.fileUploadDescription = extractStaticText(
        fu.uploadDescription as StaticText | undefined,
      )
      fileUploadMeta.fileUploadButtonLabel = extractStaticText(
        fu.uploadButtonLabel as StaticText | undefined,
      )
      fileUploadMeta.fileUploadIntroduction = extractStaticText(
        fu.introduction as StaticText | undefined,
      )
    }
    if ('placeholder' in field && field.placeholder !== undefined) {
      const ph = field.placeholder as FormText | undefined
      if (typeof ph === 'function') {
        const extracted = tryInvokeFormTextFunction(ph as Function)
        fromField = mergeMessageDescriptors(fromField, extracted.descriptors)
        inputPlaceholder = extracted.staticText
      } else {
        inputPlaceholder = extractStaticText(ph as StaticText | undefined)
      }
    }
    descriptors.push(...fromField)
    description = extractStaticText(
      leafRecord.description as StaticText | undefined,
    )
    if (typeof field.width === 'string') {
      width = field.width
    }
    marginTop = field.marginTop ?? null
    marginBottom = field.marginBottom ?? null
    if ('space' in field && field.space !== undefined) {
      paddingTop = field.space
    }
    if ('titleVariant' in field && field.titleVariant) {
      titleVariant = String(field.titleVariant)
    }
  }

  let radioOptions: RadioOptionIntrospection[] | undefined
  let radioLargeButtons: boolean | null | undefined
  let radioBackgroundColor: string | null | undefined

  let checkboxOptions: RadioOptionIntrospection[] | undefined
  let checkboxLarge: boolean | null | undefined
  let checkboxStrong: boolean | null | undefined
  let checkboxBackgroundColor: string | null | undefined
  let checkboxSpacing: number | null | undefined

  if (leaf.type === FieldTypes.RADIO) {
    const rf = leaf as RadioField
    radioOptions = extractRadioPreviewOptions(rf)
    if (typeof rf.largeButtons === 'boolean') {
      radioLargeButtons = rf.largeButtons
    }
    if (rf.backgroundColor === 'white' || rf.backgroundColor === 'blue') {
      radioBackgroundColor = rf.backgroundColor
    }
  }

  if (leaf.type === FieldTypes.CHECKBOX) {
    const cf = leaf as CheckboxField
    checkboxOptions = extractCheckboxPreviewOptions(cf)
    checkboxLarge = typeof cf.large === 'boolean' ? cf.large : true
    checkboxStrong = typeof cf.strong === 'boolean' ? cf.strong : false
    if (cf.backgroundColor === 'white' || cf.backgroundColor === 'blue') {
      checkboxBackgroundColor = cf.backgroundColor
    } else {
      checkboxBackgroundColor = 'blue'
    }
    if (typeof cf.spacing === 'number') {
      checkboxSpacing = cf.spacing
    }
  }

  const inputBackgroundColor = extractInputBackgroundColorFromLeaf(leaf)

  let alertType: string | null | undefined
  let alertMessage: string | null | undefined

  if (leaf.type === FieldTypes.ALERT_MESSAGE) {
    const amf = leaf as AlertMessageField
    alertType = amf.alertType ?? 'default'
    if (typeof amf.message === 'function') {
      const extracted = tryInvokeFormTextFunction(amf.message)
      for (const d of extracted.descriptors) {
        if (!descriptors.some((x) => x.id === d.id)) {
          descriptors.push(d)
        }
      }
      alertMessage = extracted.staticText
    } else {
      alertMessage = extractStaticText(amf.message as StaticText | undefined)
    }
  }

  let messageDescriptorsOut = descriptors
  if (leaf.type === FieldTypes.CUSTOM && customFieldManifest) {
    const comp =
      typeof leafRecord.component === 'string' ? leafRecord.component : ''
    const extra = comp ? customFieldManifest[comp] : undefined
    if (extra?.length) {
      messageDescriptorsOut = mergeMessageDescriptors(descriptors, extra)
    }
  }

  const linkFieldExtras =
    leaf.type === FieldTypes.LINK
      ? (() => {
          const lf = leaf as LinkField
          return {
            linkFieldLinkText: extractStaticText(
              lf.link as StaticText | undefined,
            ),
            linkFieldLinkMessageId:
              lf.link != null && isMessageDescriptor(lf.link)
                ? String(lf.link.id)
                : null,
            linkFieldS3KeyText: extractStaticText(
              lf.s3key as StaticText | undefined,
            ),
            linkFieldS3KeyMessageId:
              lf.s3key != null && isMessageDescriptor(lf.s3key)
                ? String(lf.s3key.id)
                : null,
            linkFieldTitleMessageId:
              lf.title != null && isMessageDescriptor(lf.title)
                ? String(lf.title.id)
                : null,
            linkFieldVariant:
              lf.variant === 'text' || lf.variant === 'ghost'
                ? lf.variant
                : null,
            linkFieldJustifyContent:
              lf.justifyContent === 'center' ||
              lf.justifyContent === 'flexEnd' ||
              lf.justifyContent === 'flexStart'
                ? lf.justifyContent
                : null,
            linkFieldIcon:
              lf.iconProps?.icon != null ? String(lf.iconProps.icon) : null,
            linkFieldIconType:
              lf.iconProps?.type != null ? String(lf.iconProps.type) : null,
          }
        })()
      : {}

  const messageWithLinkExtras =
    leaf.type === FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD
      ? (() => {
          const mf = leaf as MessageWithLinkButtonField
          return {
            messageWithLinkUrl: mf.url ?? null,
            messageWithLinkMessageStatic: extractStaticText(
              mf.message as StaticText | undefined,
            ),
            messageWithLinkMessageId:
              mf.message != null && isMessageDescriptor(mf.message)
                ? String(mf.message.id)
                : null,
            messageWithLinkButtonTitleStatic: extractStaticText(
              mf.buttonTitle as StaticText | undefined,
            ),
            messageWithLinkButtonTitleMessageId:
              mf.buttonTitle != null && isMessageDescriptor(mf.buttonTitle)
                ? String(mf.buttonTitle.id)
                : null,
            messageWithLinkMessageColor:
              mf.messageColor != null ? String(mf.messageColor) : null,
          }
        })()
      : {}

  return {
    id: extractStaticId(leaf.id),
    type: leaf.type ?? 'FIELD',
    component: (leafRecord.component as string) ?? null,
    title: extractStaticText(leaf.title as StaticText | undefined),
    description,
    pageTitle: null,
    subTitle,
    subDescription,
    checkboxLabel,
    width,
    space,
    marginTop,
    marginBottom,
    paddingTop,
    titleVariant,
    messageDescriptors: messageDescriptorsOut,
    children: children.length > 0 ? children : undefined,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
    inputBackgroundColor,
    inputPlaceholder,
    alertType,
    alertMessage,
    ...nifMeta,
    ...fileUploadMeta,
    ...displayFieldStaticIntrospectionFromLeaf(leaf),
    ...textFieldIntrospectionFromLeaf(leaf),
    ...imageFieldIntrospectionFromLeaf(leaf),
    ...(submitPlacementOut !== undefined
      ? {
          submitPlacement: submitPlacementOut,
          submitActions: submitActionsOut,
        }
      : {}),
    ...linkFieldExtras,
    ...messageWithLinkExtras,
  }
}

const walkSection = (
  section: Section,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): SectionIntrospection => {
  const subSections: SubSectionIntrospection[] = []
  const screens: ScreenIntrospection[] = []

  for (const child of section.children) {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(walkSubSection(child as SubSection, customFieldManifest))
    } else {
      screens.push(walkFormLeaf(child as FormLeaf, customFieldManifest))
    }
  }

  return {
    id: extractStaticId(section.id),
    title: extractStaticText(section.title as StaticText | undefined),
    titleMessageDescriptor:
      extractMessageDescriptorsFromFormText(section.title as FormText)[0] ??
      null,
    subSections,
    screens,
  }
}

const walkSubSection = (
  subSection: SubSection,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): SubSectionIntrospection => {
  const screens: ScreenIntrospection[] = []

  for (const child of subSection.children) {
    screens.push(walkFormLeaf(child, customFieldManifest))
  }

  return {
    id: extractStaticId(subSection.id),
    title: extractStaticText(subSection.title as StaticText | undefined),
    titleMessageDescriptor:
      extractMessageDescriptorsFromFormText(subSection.title as FormText)[0] ??
      null,
    screens,
  }
}

const extractFormLogoKey = (logo: Form['logo'] | undefined): string | null => {
  if (!logo || typeof logo !== 'function') {
    return null
  }
  const fn = logo as Function & { displayName?: string }
  // Application-dependent logo: `(application) => …`
  if (fn.length > 0) {
    return null
  }
  const key = (fn.displayName || fn.name || '').trim()
  if (!key || key === 'anonymous') {
    return null
  }
  return key
}

const walkForm = (
  form: Form,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): FormIntrospection => {
  const sections: SectionIntrospection[] = []

  for (const child of form.children) {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(walkSection(child as Section, customFieldManifest))
    }
  }

  return {
    id: form.id,
    title: extractStaticText(form.title),
    logoKey: extractFormLogoKey(form.logo),
    sections,
  }
}

const collectAllDescriptors = (
  form: FormIntrospection,
): MessageDescriptorInfo[] => {
  const all: MessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const add = (d: MessageDescriptorInfo) => {
    if (!seen.has(d.id)) {
      seen.add(d.id)
      all.push(d)
    }
  }

  for (const section of form.sections) {
    if (section.titleMessageDescriptor) {
      add(section.titleMessageDescriptor)
    }
    for (const screen of section.screens) {
      screen.messageDescriptors.forEach(add)
      screen.tableRepeaterColumnHeaders?.forEach(add)
      screen.staticTableHeaderDescriptors?.forEach(add)
      screen.staticTableRowCellDescriptors?.forEach(add)
      screen.staticTableSummary?.forEach((s) => {
        add(s.label)
        add(s.value)
      })
      screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
    }
    for (const subSection of section.subSections) {
      if (subSection.titleMessageDescriptor) {
        add(subSection.titleMessageDescriptor)
      }
      for (const screen of subSection.screens) {
        screen.messageDescriptors.forEach(add)
        screen.tableRepeaterColumnHeaders?.forEach(add)
        screen.staticTableHeaderDescriptors?.forEach(add)
        screen.staticTableRowCellDescriptors?.forEach(add)
        screen.staticTableSummary?.forEach((s) => {
          add(s.label)
          add(s.value)
        })
        screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
      }
    }
  }

  return all
}

const serializeLoadedFormForApi = (form: Form): unknown => {
  try {
    return JSON.parse(JSON.stringify(form)) as unknown
  } catch (e) {
    throw new Error(
      `Loaded form could not be serialized to JSON: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  }
}

@Injectable()
export class TemplateIntrospectionService {
  /**
   * Runs the template's `formLoader` for the given state and role (same as introspection)
   * and returns the raw form object as JSON-serializable data for admin tooling.
   */
  async loadRoleForm(
    typeId: ApplicationTypes,
    stateKey: string,
    roleId: string,
  ): Promise<unknown> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const statesConfig = template.stateMachineConfig?.states as
      | Record<string, unknown>
      | undefined
    if (!statesConfig || !statesConfig[stateKey]) {
      throw new Error(`Unknown state "${stateKey}" for template "${typeId}"`)
    }

    const stateConfig = statesConfig[stateKey] as Record<string, unknown>
    const meta = stateConfig.meta as Record<string, unknown> | undefined
    if (!meta) {
      throw new Error(`State "${stateKey}" has no meta`)
    }

    const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []
    const role = metaRoles.find((r) => String(r.id) === String(roleId))

    if (!role) {
      throw new Error(
        `Role "${roleId}" not found in state "${stateKey}" (template "${typeId}")`,
      )
    }

    if (!role.formLoader || typeof role.formLoader !== 'function') {
      throw new Error(
        `Role "${roleId}" in state "${stateKey}" has no formLoader`,
      )
    }

    const mockFeatureFlagClient = {
      getValue: () => Promise.resolve(undefined),
    }

    let form: Form
    try {
      form = await (
        role.formLoader as (args: {
          featureFlagClient: unknown
        }) => Promise<Form>
      )({ featureFlagClient: mockFeatureFlagClient })
    } catch (e) {
      throw new Error(
        `formLoader failed for "${typeId}" / "${stateKey}" / "${roleId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    return serializeLoadedFormForApi(form)
  }

  async introspectTemplate(
    typeId: ApplicationTypes,
  ): Promise<TemplateIntrospection> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const config = ApplicationConfigurations[typeId]

    if (!config) {
      throw new Error(`No configuration found for template ${typeId}`)
    }

    const translationNamespaces = [
      ...(Array.isArray(config.translation)
        ? config.translation
        : [config.translation]),
      ...(template.translationNamespaces ?? []),
    ]

    let customFieldManifest: Record<string, MessageDescriptorInfo[]> = {}
    try {
      customFieldManifest = await getApplicationCustomFieldMessageDescriptors(
        typeId,
      )
    } catch {
      customFieldManifest = {}
    }

    const states: StateIntrospection[] = []
    const allDescriptors: MessageDescriptorInfo[] = []
    const seenDescriptorIds = new Set<string>()

    const statesConfig = template.stateMachineConfig?.states ?? {}
    for (const [stateKey, stateConfig] of Object.entries(statesConfig)) {
      const meta = (stateConfig as Record<string, unknown>).meta as
        | Record<string, unknown>
        | undefined
      if (!meta) continue

      const roles: RoleIntrospection[] = []
      const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []

      for (const role of metaRoles) {
        let formIntrospection: FormIntrospection | null = null

        if (role.formLoader && typeof role.formLoader === 'function') {
          try {
            const mockFeatureFlagClient = {
              getValue: () => Promise.resolve(undefined),
            }
            const form = await (
              role.formLoader as (args: {
                featureFlagClient: unknown
              }) => Promise<Form>
            )({ featureFlagClient: mockFeatureFlagClient })

            formIntrospection = walkForm(form, customFieldManifest)

            const descriptors = collectAllDescriptors(formIntrospection)
            for (const d of descriptors) {
              if (!seenDescriptorIds.has(d.id)) {
                seenDescriptorIds.add(d.id)
                allDescriptors.push(d)
              }
            }
          } catch {
            // formLoader may fail in server context, skip gracefully
          }
        }

        roles.push({
          roleId: role.id as string,
          form: formIntrospection,
        })
      }

      states.push({
        stateKey,
        stateName: (meta.name as string) ?? stateKey,
        status: (meta.status as string) ?? 'draft',
        roles,
      })
    }

    let validationDescriptors: ValidationMessageDescriptorInfo[] = []
    try {
      validationDescriptors = extractValidationDescriptors(template.dataSchema)
      for (const d of validationDescriptors) {
        if (!seenDescriptorIds.has(d.id)) {
          seenDescriptorIds.add(d.id)
          allDescriptors.push({
            id: d.id,
            defaultMessage: d.defaultMessage,
            description: d.description,
          })
        }
      }
    } catch {
      // dataSchema extraction may fail for some templates, skip gracefully
    }

    return {
      typeId,
      name: resolveTemplateDisplayName(template, config.slug),
      slug: config.slug,
      translationNamespaces: [...new Set(translationNamespaces)],
      states,
      allMessageDescriptors: allDescriptors,
      validationMessageDescriptors: validationDescriptors,
    }
  }

  async listTemplates(allowedTypeIds?: string[]): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    const allowedSet =
      allowedTypeIds != null ? new Set(allowedTypeIds) : undefined

    const entries = Object.entries(ApplicationConfigurations).filter(
      ([typeId]) => !allowedSet || allowedSet.has(typeId),
    )

    return Promise.all(
      entries.map(async ([typeId, config]) => {
        const translationNamespaces = [
          ...new Set(
            Array.isArray(config.translation)
              ? config.translation
              : [config.translation],
          ),
        ]

        let name = config.slug
        try {
          name = await getTemplateDisplayName(
            typeId as ApplicationTypes,
            config.slug,
          )
        } catch {
          // Keep slug fallback when template cannot be loaded.
        }

        return {
          typeId,
          name,
          slug: config.slug,
          translationNamespaces,
        }
      }),
    )
  }
}
