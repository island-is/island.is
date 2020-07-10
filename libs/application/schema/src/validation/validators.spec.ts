import * as z from 'zod'
import { extractPartialSchemaForValues } from './validators'

const schema = z.object({
  nested: z.object({
    numeric: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 0
    }),
    name: z
      .string()
      .nonempty()
      .max(256),
    minString: z.string().min(7),
    email: z.string().email(),
  }),
  optionalEnum: z.enum(['yes', 'no']).optional(),
  requiredString: z.string(),
})

describe('extractPartialSchemaForValues', () => {
  it('should pick non-nested types from the schema', () => {
    expect(() =>
      extractPartialSchemaForValues(schema, {
        requiredString: 'asdf',
      }).parse({ requiredString: 'asdf' }),
    ).not.toThrow()
    expect(() =>
      extractPartialSchemaForValues(schema, {
        optionalEnum: 'yes',
        requiredString: '123',
      }).parse({ optionalEnum: 'yes', requiredString: '123' }),
    ).not.toThrow()
  })
  it('should pick partial nested object from the schema', () => {
    const formValue = {
      nested: { name: 'asdf', numeric: '22' },
    }

    expect(() =>
      extractPartialSchemaForValues(schema, formValue).parse(formValue),
    ).not.toThrow()
  })
  it('should pick partial nested object and non-nested values as well from the schema', () => {
    const formValue = {
      nested: { name: 'asdf', numeric: '22' },
      requiredString: 'yes',
    }

    expect(() =>
      extractPartialSchemaForValues(schema, formValue).parse(formValue),
    ).not.toThrow()
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

    expect(() =>
      extractPartialSchemaForValues(veryNestedSchema, okFormValue).parse(
        okFormValue,
      ),
    ).not.toThrow()

    const anotherGoodFormValue = {
      nested: { deep: { age: 22, soDeep: { id: 1 } } },
    }

    expect(() =>
      extractPartialSchemaForValues(
        veryNestedSchema,
        anotherGoodFormValue,
      ).parse(anotherGoodFormValue),
    ).not.toThrow()

    const badFormValue = {
      requiredString: null,
      nested: { deep: { soDeep: { id: 1 } } },
    }
    expect(() =>
      extractPartialSchemaForValues(veryNestedSchema, badFormValue).parse(
        badFormValue,
      ),
    ).toThrow()
  })
})
