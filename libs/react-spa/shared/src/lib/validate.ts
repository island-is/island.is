import { z } from 'zod'

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

type ActionErrors<T> = Partial<Record<keyof T, string>>

export const validateFormData = async <Schema extends z.ZodTypeAny>({
  request,
  schema,
}: {
  request: Request
  schema: Schema
}) => {
  const formData = await request.formData()
  const values = getValuesFromFormData(formData)
  const nestedObject = dotNotationToNestedObject(values)

  try {
    const parsedFormData = schema.parse(nestedObject) as z.infer<typeof schema>

    return { data: parsedFormData, errors: null }
  } catch (e) {
    const errors = e as z.ZodError<z.infer<typeof schema>>

    return {
      data: null,
      errors: errors.issues.reduce(
        (acc: ActionErrors<z.infer<typeof schema>>, curr) => {
          const key = curr.path[0] as keyof z.infer<typeof schema>

          if (key) {
            acc[key] = curr.message
          }

          return acc
        },
        {},
      ),
    }
  }
}
