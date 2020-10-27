import * as z from 'zod'
import { validateAnswers } from './validators'
import { FormValue } from '@island.is/application/core'

const schema = z.object({
  nested: z.object({
    numeric: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 0
    }),
    name: z.string().nonempty().max(256),
    minString: z.string().min(7),
    email: z.string().email(),
  }),
  optionalEnum: z.enum(['yes', 'no']).optional(),
  requiredString: z.string(),
  someArray: z.array(
    z.object({
      a: z.string().nonempty(),
      b: z.string().nonempty(),
      c: z.string().nonempty(),
      d: z.string().refine((v) => v !== 'invalid'),
    }),
  ),
})

describe('validateAnswers', () => {
  it('should pick non-nested types from the schema', () => {
    expect(
      validateAnswers(schema, {
        requiredString: 'asdf',
      }),
    ).toBeUndefined()
    expect(
      validateAnswers(schema, {
        optionalEnum: 'yes',
        requiredString: '123',
      }),
    ).toBeUndefined()
  })
  it('should pick partial nested object from the schema', () => {
    const formValue = {
      nested: { name: 'asdf', numeric: '22' },
    }

    expect(validateAnswers(schema, formValue)).toBeUndefined()
  })
  it('should pick partial nested object and non-nested values as well from the schema', () => {
    const formValue = {
      nested: { name: 'asdf', numeric: '22' },
      requiredString: 'yes',
    }

    expect(validateAnswers(schema, formValue)).toBeUndefined()
  })

  it('should validate a nested object with nonempty strings', () => {
    const nonEmptyNestedStringSchema = z.object({
      person: z.object({
        age: z.string().refine((x) => {
          const asNumber = parseInt(x)
          if (isNaN(asNumber)) {
            return false
          }
          return asNumber > 15
        }),
        name: z.string().nonempty().max(256),
        nationalId: z.string().refine((x) => x === 'the only string'),
        phoneNumber: z.string().min(7),
        email: z.string().email(),
      }),
    })

    const invalidFormValue = {
      person: {
        name: 'dude',
        nationalId: '',
        age: '',
        email: '',
      },
    }
    const schemaValidationError = validateAnswers(
      nonEmptyNestedStringSchema,
      invalidFormValue,
    )
    expect(schemaValidationError).toEqual({
      'person.nationalId': expect.anything(),
      'person.age': expect.anything(),
      'person.email': expect.anything(),
    })
  })

  it('should pick deeply nested object and non-nested values from the schema', () => {
    const veryNestedSchema = z.object({
      requiredString: z.string(),
      nested: z.object({
        name: z.string().nonempty(),
        deep: z.object({
          age: z.number().positive(),
          soDeep: z.object({
            id: z.number(),
          }),
        }),
      }),
    })

    const okFormValue = {
      requiredString: 'yes',
      nested: { deep: { soDeep: { id: 1 } } },
    }

    expect(validateAnswers(veryNestedSchema, okFormValue)).toBeUndefined()

    const anotherGoodFormValue = {
      nested: { deep: { age: 22, soDeep: { id: 1 } } },
    }
    expect(
      validateAnswers(veryNestedSchema, anotherGoodFormValue),
    ).toBeUndefined()

    const badFormValue = {
      requiredString: false,
      nested: { deep: { soDeep: { id: 1 } } },
    }
    const firstSchemaValidationError = validateAnswers(
      veryNestedSchema,
      badFormValue,
    )
    expect(firstSchemaValidationError).toEqual({
      requiredString: expect.anything(),
    })

    const anotherBadFormValue = {
      requiredString: 'yes',
      nested: { deep: { soDeep: { id: 'no' } } },
    }
    const secondSchemaValidationError = validateAnswers(
      veryNestedSchema,
      anotherBadFormValue,
    )
    expect(secondSchemaValidationError).toEqual({
      'nested.deep.soDeep.id': expect.anything(),
    })
  })
  describe('arrays', () => {
    it('should validate primitive array elements', () => {
      const schemaWithArray = z.object({
        anArray: z.array(z.string()),
        somethingElse: z.number(),
      })
      const okFormValue = {
        anArray: [],
        somethingElse: 4,
      }
      expect(validateAnswers(schemaWithArray, okFormValue)).toBeUndefined()

      const anotherOkFormValue = {
        anArray: ['o', 'k', 'n', 'i', 'c', 'e'],
      }
      expect(
        validateAnswers(schemaWithArray, anotherOkFormValue),
      ).toBeUndefined()

      const badFormValue = {
        anArray: ['b', 1, 2, '3'],
      }
      const schemaValidationError = validateAnswers(
        schemaWithArray,
        badFormValue,
      )
      expect(schemaValidationError).toEqual({
        'anArray[1]': expect.anything(),
        'anArray[2]': expect.anything(),
      })
    })
    it('should pick nested object inside an array from a schema', () => {
      const schemaWithArray = z.object({
        person: z
          .array(
            z.object({
              age: z.string().refine((x) => {
                const asNumber = parseInt(x)
                if (isNaN(asNumber)) {
                  return false
                }
                return asNumber > 15
              }),
              name: z.string().nonempty().max(256),
            }),
          )
          .max(5)
          .nonempty(),
        requiredString: z.string().nonempty(),
      })
      const okFormValue = {
        requiredString: 'yes',
        person: [{ name: 'Name' }],
      }

      expect(validateAnswers(schemaWithArray, okFormValue)).toBeUndefined()

      const anotherGoodFormValue = {
        person: [{ name: 'Name', age: '25' }],
      }

      expect(
        validateAnswers(schemaWithArray, anotherGoodFormValue),
      ).toBeUndefined()

      const badFormValue = {
        requiredString: false,
        person: [{ name: 'Name', age: '25' }],
      }

      const firstError = validateAnswers(schemaWithArray, badFormValue)
      expect(firstError).toEqual({
        requiredString: expect.anything(),
      })

      const anotherBadFormValue = {
        requiredString: 'allowed',
        person: [{ name: 'bam', age: 1 }],
      }
      const secondError = validateAnswers(schemaWithArray, anotherBadFormValue)
      expect(secondError).toEqual({
        'person[0].age': expect.anything(),
      })
    })
    it('should skip null elements in the array if the validation is not strict', () => {
      // this is for repeater flows
      const schemaWithArray = z.object({
        person: z
          .array(
            z.object({
              age: z.string().refine((x) => {
                const asNumber = parseInt(x)
                if (isNaN(asNumber)) {
                  return false
                }
                return asNumber > 15
              }),
              name: z.string().nonempty().max(256),
            }),
          )
          .max(5)
          .nonempty(),
        requiredString: z.string().nonempty(),
      })
      const okFormValue = {
        requiredString: 'yes',
        person: [null, { name: 'Name' }],
      } as FormValue

      expect(validateAnswers(schemaWithArray, okFormValue)).toBeUndefined()

      const anotherGoodFormValue = {
        person: [{ name: 'Name', age: '25' }, null, { name: 'name' }],
      } as FormValue

      expect(
        validateAnswers(schemaWithArray, anotherGoodFormValue),
      ).toBeUndefined()

      const badFormValue = {
        requiredString: false,
        person: [null, { name: 'Name', age: '25' }],
      } as FormValue

      const firstError = validateAnswers(schemaWithArray, badFormValue)
      expect(firstError).toEqual({
        requiredString: expect.anything(),
      })

      const anotherBadFormValue = {
        requiredString: 'allowed',
        person: [null, { name: 'bam', age: 1 }],
      } as FormValue
      const secondError = validateAnswers(schemaWithArray, anotherBadFormValue)
      expect(secondError).toEqual({ 'person[1].age': expect.anything() })
    })
  })
})
