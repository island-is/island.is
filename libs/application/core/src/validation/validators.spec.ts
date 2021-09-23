import * as z from 'zod'
import { buildValidationError, validateAnswers } from './validators'
import { StaticText } from '../types/Form'
import { FormValue } from '../types/Application'

const dataSchema = z.object({
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

const defaultError = 'Ógilt gildi' // `coreErrorMessages.defaultError` in validators.ts

const formatMessage = (descriptor: StaticText): string => {
  if (typeof descriptor === 'string') {
    return descriptor
  }

  return descriptor.defaultMessage?.toString() ?? ''
}

describe('validateAnswers', () => {
  it('should return no errors for non-nested types from valid values', () => {
    expect(
      validateAnswers({
        dataSchema,
        answers: {
          requiredString: 'asdf',
        },
        formatMessage,
      }),
    ).toBeUndefined()
    expect(
      validateAnswers({
        dataSchema,
        answers: {
          optionalEnum: 'yes',
          requiredString: '123',
        },
        formatMessage,
      }),
    ).toBeUndefined()
  })
  it('should return no errors for valid nested value', () => {
    const answers = {
      nested: { name: 'asdf', numeric: '22' },
    }

    expect(
      validateAnswers({ dataSchema, answers, formatMessage }),
    ).toBeUndefined()
  })
  it('should pick partial nested object and non-nested values as well from the schema and return no errors', () => {
    const answers = {
      nested: { name: 'asdf', numeric: '22' },
      requiredString: 'yes',
    }

    expect(
      validateAnswers({ dataSchema, answers, formatMessage }),
    ).toBeUndefined()
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
    const schemaValidationError = validateAnswers({
      dataSchema: nonEmptyNestedStringSchema,
      answers: invalidFormValue,
      formatMessage,
    })

    expect(schemaValidationError).toEqual({
      person: {
        age: defaultError,
        email: defaultError,
        nationalId: defaultError,
        phoneNumber: defaultError,
      },
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

    expect(
      validateAnswers({
        dataSchema: veryNestedSchema,
        answers: okFormValue,
        formatMessage,
      }),
    ).toBeUndefined()

    const anotherGoodFormValue = {
      nested: { deep: { age: 22, soDeep: { id: 1 } } },
    }
    expect(
      validateAnswers({
        dataSchema: veryNestedSchema,
        answers: anotherGoodFormValue,
        formatMessage,
      }),
    ).toBeUndefined()

    const badFormValue = {
      requiredString: false,
      nested: { deep: { soDeep: { id: 1 } } },
    }
    const firstSchemaValidationError = validateAnswers({
      dataSchema: veryNestedSchema,
      answers: badFormValue,
      formatMessage,
    })
    expect(firstSchemaValidationError).toEqual({
      requiredString: expect.anything(),
    })

    const anotherBadFormValue = {
      requiredString: 'yes',
      nested: { deep: { soDeep: { id: 'no' } } },
    }
    const secondSchemaValidationError = validateAnswers({
      dataSchema: veryNestedSchema,
      answers: anotherBadFormValue,
      formatMessage,
    })
    expect(secondSchemaValidationError).toEqual({
      nested: {
        deep: {
          soDeep: {
            id: defaultError,
          },
        },
      },
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
      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: okFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const badFormValue = {
        anArray: [],
      }
      const schemaValidationError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: badFormValue,
        formatMessage,
      })
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
      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: okFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const anotherOkFormValue = {
        anArray: ['o', 'k', 'n', 'i', 'c', 'e'],
      }
      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: anotherOkFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const badFormValue = {
        anArray: ['b', 1, 2, '3'],
      }
      const schemaValidationError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: badFormValue,
        formatMessage,
      })
      expect(schemaValidationError).toEqual({
        anArray: [undefined, defaultError, defaultError],
      })
    })
    it('should pick nested object inside an array from a schema', () => {
      const schemaWithArray = z.object({
        person: z
          .array(
            z.object({
              age: z
                .string()
                .refine((x) => {
                  const asNumber = parseInt(x)
                  if (isNaN(asNumber)) {
                    return false
                  }
                  return asNumber > 15
                })
                .optional(),
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

      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: okFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const anotherGoodFormValue = {
        person: [{ name: 'Name', age: '25' }],
      }

      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: anotherGoodFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const badFormValue = {
        requiredString: false,
        person: [{ name: 'Name', age: '25' }],
      }

      const firstError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: badFormValue,
        formatMessage,
      })
      expect(firstError).toEqual({
        requiredString: expect.anything(),
      })

      const anotherBadFormValue = {
        requiredString: 'allowed',
        person: [{ name: 'bam', age: 1 }],
      }
      const secondError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: anotherBadFormValue,
        formatMessage,
      })
      expect(secondError).toEqual({
        person: [{ age: defaultError }],
      })
    })
    it('should skip null elements in the array if the validation is not strict', () => {
      // this is for repeater flows
      const schemaWithArray = z.object({
        person: z
          .array(
            z
              .object({
                age: z
                  .string()
                  .refine((x) => {
                    const asNumber = parseInt(x)
                    if (isNaN(asNumber)) {
                      return false
                    }
                    return asNumber > 15
                  })
                  .optional(),
                name: z.string().max(256).optional(),
              })
              .nullable(),
          )
          .max(5)
          .nonempty(),
        requiredString: z.string().nonempty(),
      })

      const okFormValue = {
        requiredString: 'yes',
        person: [null, { name: 'Name' }],
      } as FormValue

      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: okFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const anotherGoodFormValue = {
        person: [{ name: 'Name', age: '25' }, null, { name: 'name' }],
      } as FormValue

      expect(
        validateAnswers({
          dataSchema: schemaWithArray,
          answers: anotherGoodFormValue,
          formatMessage,
        }),
      ).toBeUndefined()

      const badFormValue = {
        requiredString: false,
        person: [null, { name: 'Name', age: '25' }],
      } as FormValue

      const firstError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: badFormValue,
        formatMessage,
      })
      expect(firstError).toEqual({
        requiredString: expect.anything(),
      })

      const anotherBadFormValue = {
        requiredString: 'allowed',
        person: [null, { name: 'bam', age: 1 }],
      } as FormValue
      const secondError = validateAnswers({
        dataSchema: schemaWithArray,
        answers: anotherBadFormValue,
        formatMessage,
      })
      expect(secondError).toEqual({
        person: [undefined, { age: defaultError }],
      })
    })

    it('should return default error message for invalid value', () => {
      const schema = z.object({ value: z.boolean().refine((v) => v) })

      const value = { value: false } as FormValue

      expect(
        validateAnswers({ dataSchema: schema, answers: value, formatMessage }),
      ).toEqual({
        value: defaultError,
      })
    })

    it('should return custom error message for invalid value', () => {
      const expectedMessage = 'this is my message'
      const schema = z.object({
        value: z.boolean().refine((v) => v, { message: expectedMessage }),
      })

      const value = { value: false } as FormValue

      expect(
        validateAnswers({ dataSchema: schema, answers: value, formatMessage }),
      ).toEqual({
        value: expectedMessage,
      })
    })
  })
})

describe('buildValidationError', () => {
  it('should return correctly formatted error object when skipping optional values', () => {
    const buildError = buildValidationError('descriptiveNamespaceString')

    expect(buildError('Some message')).toStrictEqual({
      message: 'Some message',
      path: 'descriptiveNamespaceString',
      values: undefined,
    })
  })

  it('should return correctly formatted error object when provided all values', () => {
    const buildError = buildValidationError('descriptiveNamespaceString', 1337)

    expect(buildError('Some message', 'someField')).toStrictEqual({
      message: 'Some message',
      path: 'descriptiveNamespaceString[1337].someField',
      values: undefined,
    })
  })
})
