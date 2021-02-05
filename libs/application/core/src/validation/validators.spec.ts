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
    minString: z.string().min(7).optional(),
    email: z.string().email().optional(),
  }),
  optionalEnum: z.enum(['yes', 'no']).optional(),
  requiredString: z.string(),
})

const invalidValue = 'Invalid value.'
const invalidEmail = 'Invalid email'
const invalidInput = 'Invalid input'
const expectedNumberReceivedString = 'Expected number, received string'
const expectedStringReceivedNumber = 'Expected string, received number'

describe('validateAnswers', () => {
  it('should return no errors for non-nested types from a valid schema', () => {
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
  it('should return no errors for valid nested object', () => {
    const formValue = {
      nested: { name: 'asdf', numeric: '22' },
    }

    expect(validateAnswers(schema, formValue)).toBeUndefined()
  })
  it('should pick partial nested object and non-nested values as well from the schema and return no errors', () => {
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
      person: invalidValue,
      'person.nationalId': invalidValue,
      'person.age': invalidValue,
      'person.email': invalidEmail,
    })
  })

  it('should pick deeply nested object and non-nested values from the schema', () => {
    const veryNestedSchema = z.object({
      requiredString: z.string(),
      nested: z.object({
        name: z.string().nonempty().optional(),
        deep: z.object({
          age: z.number().positive().optional(),
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
      'nested': expectedNumberReceivedString,
      'nested.deep': expectedNumberReceivedString,
      'nested.deep.soDeep': expectedNumberReceivedString,
      'nested.deep.soDeep.id': expectedNumberReceivedString,
    })
  })
  describe('arrays', () => {
    it('should validate empty arrays', () => {
      const schemaWithArray = z.object({
        anArray: z.array(z.string()).nonempty(),
        somethingElse: z.number(),
      })
      const okFormValue = {
        anArray: ['o', 'k'],
        somethingElse: 4,
      }
      expect(validateAnswers(schemaWithArray, okFormValue)).toBeUndefined()

      const badFormValue = {
        anArray: [],
      }
      const schemaValidationError = validateAnswers(
        schemaWithArray,
        badFormValue,
      )
      expect(schemaValidationError).toEqual({
        anArray: expect.anything(),
      })
    })
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
        "anArray": expectedStringReceivedNumber,
        'anArray[1]': expectedStringReceivedNumber,
        'anArray[2]': expectedStringReceivedNumber,
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
              }).optional(),
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
        'person': invalidInput,
        'person[0]': invalidInput,
        'person[0].age': invalidInput,
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
              }).optional(),
              name: z.string().max(256).optional(),
            }).nullable(),
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
      expect(secondError).toEqual({ 
        'person': invalidInput,
        'person[1]': invalidInput,
        'person[1].age': invalidInput
      })
    })

    it('should validate boolean refined as valid input', () => {
      const schema = z.object({value: z.boolean().refine((v) => v)})

      const value = {value: true} as FormValue

      expect(validateAnswers(schema, value)).toBeUndefined()
    })

    it('should return invalid value for refined boolean', () => {
      const schema = z.object({value: z.boolean().refine((v) => v)})

      const value = {value: false} as FormValue

      expect(validateAnswers(schema, value)).toEqual({
        'value': invalidValue
      })
    })
  })
})
