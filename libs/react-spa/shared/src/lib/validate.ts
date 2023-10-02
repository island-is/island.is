import { z } from 'zod'
import isObject from 'lodash/isObject'

/**
 * Creates one level deep object from a URLSearchParams
 * Each key is split by dot notation and the value is the value of the key
 *
 * @example
 * createSearchParamObj(new URLSearchParams('age.from=1&age.to=2&flightLeg.from=KEF&flightLeg.to=AER&period.from=2021-01-01&period.to=2021-01-02&state=active&state=inactive&isExplicit=true&airline=W6'))
 * {
 *   'age.from': 1,
 *   'age.to': 2,
 *   'flightLeg.from': 'KEF',
 *   'flightLeg.to': 'AER',
 *   'period.from': '2021-01-01',
 *   'period.to': '2021-01-02',
 *   state: ['active', 'inactive'],
 *   isExplicit: 'true',
 *   airline: 'W6',
 * }
 */
export const createSearchParamsObj = (searchParams: URLSearchParams) => {
  const obj: Record<string, string | string[]> = {}

  for (const [objPath, value] of searchParams.entries()) {
    if (!value) continue
    const objValue = obj[objPath]

    if (!objValue) {
      obj[objPath] = value
    } else if (objValue) {
      obj[objPath] = Array.isArray(objValue)
        ? [...objValue, value]
        : [objValue, value]
    }
  }

  return obj
}

/**
 * Creates a deeply nested object from a one level deep object with dot notation
 *
 * @example
 * const obj = {
 *   'age.from': 1,
 *   'age.to': 2,
 *   'flightLeg.from': 'KEF',
 *   'flightLeg.to': 'AER',
 *   'period.from': '2021-01-01',
 *   'period.to': '2021-01-02',
 *   state: ['active', 'inactive'],
 *   isExplicit: 'true',
 *   airline: 'W6',
 * }
 * const result = dotNotationToNestedObject(obj)
 * {
 *   age: {
 *     from: 1,
 *     to: 2,
 *   },
 *   flightLeg: {
 *     from: 'KEF',
 *     to: 'AER',
 *   },
 *   period: {
 *     from: '2021-01-01',
 *     to: '2021-01-02',
 *   },
 *   state: ['active', 'inactive'],
 *   isExplicit: true,
 * }
 */
export const dotNotationToNestedObject = (
  obj: Record<string, string | string[]>,
) => {
  return Object.entries(obj).reduce((parentAcc, [key, value]) => {
    key
      .split('.')
      .reduce(
        (acc, innerKey, index, arr) =>
          acc[innerKey] || (acc[innerKey] = arr[index + 1] ? {} : value),
        parentAcc as Record<string, any>,
      )

    return parentAcc
  }, {} as Record<string, unknown>)
}

export const validateSearchParams = <T extends z.ZodTypeAny>({
  request,
  schema,
}: {
  request: Request
  schema: T
}) => {
  const searchParams = new URL(request.url).searchParams
  const values = createSearchParamsObj(searchParams)
  const nestedObject = dotNotationToNestedObject(values)

  return schema.parse(nestedObject) as z.infer<typeof schema>
}

/**
 * Gets the values from a FormData object and returns one level deep object with dot notation
 */
export const getValuesFromFormData = (formData: FormData) => {
  const obj: Record<string, string[] | string> = {}

  for (const [key, value] of formData.entries()) {
    const val = value as string

    // If the key already exists, we need to make sure we don't overwrite it
    if (obj[key]) {
      const prevValues: string[] | string = obj[key]

      // If the previous value was an array, we need to add the new value to it
      obj[key] = Array.isArray(prevValues)
        ? [...prevValues, val]
        : [prevValues, val]
    } else {
      obj[key] = val || ''
    }
  }

  return obj
}

const formatErrors = (errors: Record<string, { _errors?: string[] }>) => {
  const formattedError: Record<string, unknown> = {}

  Object.keys(errors).forEach((key) => {
    if (isObject(errors[key])) {
      formattedError[key] = formatErrors(
        errors[key] as Record<string, { _errors?: string[] }>,
      )
    }

    if (errors[key]?._errors?.[0] && key !== '_errors') {
      formattedError[key] = errors[key]?._errors?.[0]
    }
  })

  return formattedError
}

type ValidateFormDataArgs<Schema> = {
  formData: FormData
  schema: Schema
}

export async function validateFormData<Schema extends z.ZodTypeAny>({
  formData,
  schema,
}: ValidateFormDataArgs<Schema>): Promise<ValidateFormDataResult<Schema>> {
  type InferredSchema = z.infer<typeof schema>

  const values = getValuesFromFormData(formData)
  const nestedObject = dotNotationToNestedObject(values) as InferredSchema
  const result = schema.safeParse(nestedObject) as InferredSchema

  if (!result.success) {
    return {
      data: null,
      errors: formatErrors(result.error.format()) as Partial<InferredSchema>,
    }
  }

  return {
    data: result.data,
    errors: null,
  }
}

/**
 * Get the return type of validateFormData for a given schema
 */
export type ValidateFormDataResult<Schema extends z.ZodTypeAny> = {
  errors: Partial<z.infer<Schema>> | null
  data: z.infer<Schema> | null
}
