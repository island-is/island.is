import { z } from 'zod'
import type {
  Answer,
  DataProviderResult,
  ExternalData,
  FormValue,
  Schema,
} from '@island.is/application/types'

const MAX_DEPTH = 12
const PREVIEW_DATE = new Date('2026-01-01')

const unwrapEffects = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  let current = schema
  while (current instanceof z.ZodEffects) {
    current = current.innerType()
  }
  return current
}

const generateMockValue = (schema: z.ZodTypeAny, depth = 0): unknown => {
  if (depth > MAX_DEPTH) {
    return undefined
  }

  const unwrapped = unwrapEffects(schema)

  if (unwrapped instanceof z.ZodOptional) {
    return generateMockValue(unwrapped.unwrap(), depth + 1)
  }
  if (unwrapped instanceof z.ZodNullable) {
    return generateMockValue(unwrapped.unwrap(), depth + 1)
  }
  if (unwrapped instanceof z.ZodDefault) {
    return generateMockValue(unwrapped.removeDefault(), depth + 1)
  }
  if (unwrapped instanceof z.ZodString) {
    return 'Lorem ipsum'
  }
  if (unwrapped instanceof z.ZodNumber) {
    return 0
  }
  if (unwrapped instanceof z.ZodBoolean) {
    return true
  }
  if (unwrapped instanceof z.ZodDate) {
    return PREVIEW_DATE
  }
  if (unwrapped instanceof z.ZodLiteral) {
    return unwrapped.value
  }
  if (unwrapped instanceof z.ZodEnum) {
    return unwrapped.options[0]
  }
  if (unwrapped instanceof z.ZodNativeEnum) {
    return Object.values(unwrapped.enum)[0]
  }
  if (unwrapped instanceof z.ZodArray) {
    const requiresAtLeastOne = unwrapped._def.minLength !== null
    return requiresAtLeastOne
      ? [generateMockValue(unwrapped.element, depth + 1)]
      : []
  }
  if (unwrapped instanceof z.ZodUnion) {
    const [firstOption] = unwrapped.options
    return firstOption ? generateMockValue(firstOption, depth + 1) : undefined
  }
  if (unwrapped instanceof z.ZodIntersection) {
    const left = generateMockValue(unwrapped._def.left, depth + 1)
    const right = generateMockValue(unwrapped._def.right, depth + 1)
    if (
      left &&
      right &&
      typeof left === 'object' &&
      typeof right === 'object' &&
      !Array.isArray(left) &&
      !Array.isArray(right)
    ) {
      return { ...left, ...right }
    }
    return left ?? right
  }
  if (unwrapped instanceof z.ZodObject) {
    const shape = unwrapped.shape
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(shape)) {
      result[key] = generateMockValue(shape[key], depth + 1)
    }
    return result
  }

  return undefined
}

const generateMockExternalData = (
  externalDataSchema: z.ZodTypeAny,
): ExternalData => {
  const unwrapped = unwrapEffects(externalDataSchema)
  if (!(unwrapped instanceof z.ZodObject)) {
    return {}
  }

  const shape = unwrapped.shape
  const externalData: ExternalData = {}

  for (const providerKey of Object.keys(shape)) {
    const providerSchema = unwrapEffects(shape[providerKey])
    const dataSchema =
      providerSchema instanceof z.ZodObject && providerSchema.shape.data
        ? providerSchema.shape.data
        : providerSchema

    externalData[providerKey] = {
      data: generateMockValue(dataSchema) as DataProviderResult['data'],
      date: PREVIEW_DATE,
      status: 'success',
    }
  }

  return externalData
}

const MOCK_NATIONAL_REGISTRY_INDIVIDUAL = {
  nationalId: '0000000000',
  age: 67,
  givenName: 'Lorem',
  familyName: 'Ipsum',
  fullName: 'Lorem Ipsum',
  citizenship: { code: 'IS', name: 'Iceland' },
  address: {
    streetAddress: 'Lorem 1',
    postalCode: '101',
    locality: 'Reykjavík',
    city: 'Reykjavík',
    municipalityCode: '0000',
  },
  genderCode: '1',
  maritalTitle: { code: '1', description: 'Single' },
  birthDate: PREVIEW_DATE,
}

const KNOWN_PROVIDER_DATA_DEFAULTS: Record<string, unknown> = {
  nationalRegistry: MOCK_NATIONAL_REGISTRY_INDIVIDUAL,
  nationalRegistrySpouse: MOCK_NATIONAL_REGISTRY_INDIVIDUAL,
  nationalRegistryCohabitants: [MOCK_NATIONAL_REGISTRY_INDIVIDUAL],
  userProfile: {
    mobilePhoneNumber: '6555555',
    email: 'lorem.ipsum@island.is',
    bankInfo: '0000-00-000000',
  },
}

const isPlainProviderKey = (prop: string): boolean =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(prop) && !(prop in {})

const withExternalDataFallback = (externalData: ExternalData): ExternalData =>
  new Proxy(externalData, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (value !== undefined || typeof prop !== 'string') {
        return value
      }
      if (!isPlainProviderKey(prop)) {
        return value
      }
      return {
        data: KNOWN_PROVIDER_DATA_DEFAULTS[prop] ?? {},
        date: PREVIEW_DATE,
        status: 'success',
      } as DataProviderResult
    },
  })

export const generateMockPreviewData = (
  schema: Schema,
): { answers: FormValue; externalData: ExternalData } => {
  try {
    const rootObject = unwrapEffects(schema)
    if (!(rootObject instanceof z.ZodObject)) {
      return { answers: {}, externalData: withExternalDataFallback({}) }
    }

    const shape = rootObject.shape
    const answers: FormValue = {}
    let externalData: ExternalData = {}

    for (const key of Object.keys(shape)) {
      if (key === 'externalData') {
        externalData = generateMockExternalData(shape[key])
        continue
      }
      answers[key] = generateMockValue(shape[key]) as Answer
    }

    return { answers, externalData: withExternalDataFallback(externalData) }
  } catch (e) {
    console.warn(
      `generateMockPreviewData: failed to derive mock preview data from dataSchema: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
    return { answers: {}, externalData: withExternalDataFallback({}) }
  }
}
