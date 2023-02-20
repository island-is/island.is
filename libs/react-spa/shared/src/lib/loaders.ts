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
const createSearchParamObj = (searchParams: URLSearchParams) => {
  const obj: Record<string, unknown> = {}

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
 * Creates an object from a one level deep object with dot notation
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
 * const result = createObjFromObjWithPath(obj)
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
const createObjFromObjWithPath = (obj: Record<string, unknown>) => {
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

/**
 * Creates an object from a request's search params
 */
export const createObjFromReqSearchParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const obj = createSearchParamObj(searchParams)
  const result = createObjFromObjWithPath(obj)

  return Object.keys(result).length === 0 ? null : result
}

export const validateRequest = <T extends z.ZodTypeAny>({
  request,
  schema,
}: {
  request: Request
  schema: T
}) => {
  const parsedObject = createObjFromReqSearchParams(request)
  const result = schema.parse(parsedObject ?? {})

  return result as z.infer<typeof schema>
}
