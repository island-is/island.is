import { z, ZodError } from 'zod'
import { zfd } from 'zod-form-data'
import {
  dotNotationToNestedObject,
  createSearchParamsObj,
  validateSearchParams,
  getValuesFromFormData,
} from './validate'

class FormDataMock {
  append: jest.Mock
  entries: jest.Mock

  constructor(entries: FormData['entries']) {
    this.append = jest.fn()
    this.entries = jest.fn(() => entries)
  }
}

global.FormData = FormDataMock

class MockedRequest {
  url: string

  constructor(url: string) {
    this.url = url
  }
}

// Arrange
const schema = z.object({
  deeply: z.object({
    nested: z.object({
      key: z.string(),
    }),
  }),
  name: z.string(),
  age: z.coerce.number(),
  repeated: zfd.repeatable().optional(),
})

describe('loaders utility methods', () => {
  describe('dotNotationToNestedObject', () => {
    it('should create deeply nested object from one level deep object with path as keys ', () => {
      // Arrange
      const obj = {
        'age.from': 1,
        'age.to': 2,
        'deeply.nested.key': 'value',
        'flightLeg.from': 'KEF',
        'flightLeg.to': 'AER',
        'period.from': '2021-01-01',
        'period.to': '2021-01-02',
        state: ['active', 'inactive'],
        isExplicit: 'true',
        airline: 'W6',
      }

      // Act
      const result = dotNotationToNestedObject(obj)

      // Assert
      expect(result).toEqual({
        age: {
          from: 1,
          to: 2,
        },
        deeply: {
          nested: {
            key: 'value',
          },
        },
        flightLeg: {
          from: 'KEF',
          to: 'AER',
        },
        period: {
          from: '2021-01-01',
          to: '2021-01-02',
        },
        state: ['active', 'inactive'],
        isExplicit: 'true',
        airline: 'W6',
      })
    })
  })

  describe('createSearchParamsObj', () => {
    it('should create an object from a URLSearchParams', () => {
      // Arrange
      const searchParams = new URLSearchParams(
        '?age.from=1&age.to=2&flightLeg.from=KEF&flightLeg.to=AER&period.from=2021-01-01&period.to=2021-01-02&state=active&state=inactive&isExplicit=true&airline=W6&deeply.nested.key=value',
      )

      // Act
      const result = createSearchParamsObj(searchParams)

      // Assert
      expect(result).toEqual({
        'age.from': '1',
        'age.to': '2',
        'deeply.nested.key': 'value',
        'flightLeg.from': 'KEF',
        'flightLeg.to': 'AER',
        'period.from': '2021-01-01',
        'period.to': '2021-01-02',
        state: ['active', 'inactive'],
        isExplicit: 'true',
        airline: 'W6',
      })
    })
  })

  describe('validateSearchParams', () => {
    it('should fail to validate a request with a schema', () => {
      // Arrange
      const request = new MockedRequest(
        'https://island.is/?deeply.nested.key=value&name=John',
      ) as Request

      try {
        // Act
        const result = validateSearchParams({
          request,
          schema,
        })

        // Assert
        expect(result).toThrowError()
      } catch (error) {
        // Assert
        if (error instanceof ZodError) {
          expect(error.errors.length).toEqual(1)
          expect(error.errors[0]).toMatchInlineSnapshot(
            `
            Object {
              "code": "invalid_type",
              "expected": "number",
              "message": "Expected number, received nan",
              "path": Array [
                "age",
              ],
              "received": "nan",
            }
          `,
          )

          return
        }

        throw new Error('Test failed')
      }
    })

    it('should validate a request with a schema', () => {
      // Arrange
      const request = new MockedRequest(
        'https://island.is/?deeply.nested.key=value&name=John&age=10&repeated=1&repeated=2',
      ) as Request

      // Act
      const result = validateSearchParams({
        request,
        schema,
      })

      // Assert
      expect(result).toEqual({
        deeply: {
          nested: {
            key: 'value',
          },
        },
        name: 'John',
        age: 10,
        repeated: ['1', '2'],
      })
    })
  })

  describe('getValuesFromFormData', () => {
    it('should get correct values from FormData ', () => {
      // Arrange
      const searchParams = new URLSearchParams(
        '?age.from=1&age.to=2&flightLeg.from=KEF&flightLeg.to=AER&period.from=2021-01-01&period.to=2021-01-02&state=active&state=inactive&isExplicit=true&airline=W6&deeply.nested.key=value',
      )
      const formData = new FormData(searchParams)

      // Act
      const result = getValuesFromFormData(formData)

      // Assert
      expect(result).toEqual({
        'age.from': '1',
        'age.to': '2',
        'deeply.nested.key': 'value',
        'flightLeg.from': 'KEF',
        'flightLeg.to': 'AER',
        'period.from': '2021-01-01',
        'period.to': '2021-01-02',
        state: ['active', 'inactive'],
        isExplicit: 'true',
        airline: 'W6',
      })
    })
  })
})
