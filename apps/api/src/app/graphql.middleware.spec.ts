import { MiddlewareContext } from '@nestjs/graphql'

import { maskOutFieldsMiddleware } from './graphql.middleware'

describe('GraphQL Middlewares', () => {
  const unMaskedValue = Promise.resolve({})
  const fields = ['a', 'b', 'c', 'd']
  const nextFn = () => unMaskedValue
  const createContext = (
    fieldName: string,
    extensions: MiddlewareContext['info']['parentType']['extensions'],
  ): MiddlewareContext => ({
    info: {
      fieldName,
      parentType: {
        extensions,
        name: 'test',
        description: 'test',
        astNode: undefined,
        isTypeOf: undefined,
        extensionASTNodes: [],
        getFields: () => null,
        getInterfaces: () => null,
        toConfig: undefined,
        toJSON: undefined,
        inspect: undefined,
      },
      fieldNodes: null,
      returnType: null,
      path: null,
      schema: null,
      fragments: null,
      cacheControl: null,
      rootValue: null,
      operation: null,
      variableValues: null,
    },
    source: null,
    args: null,
    context: null,
  })

  describe('filterFields', () => {
    it('should not mask out when no extensions is defined', () => {
      // Arrange
      const extensions = undefined

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        expect(maskOutFieldsMiddleware(ctx, nextFn)).toEqual(unMaskedValue)
      })
    })

    it('should not mask out when no filterFields are defined', () => {
      // Arrange
      const extensions = {}

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        expect(maskOutFieldsMiddleware(ctx, nextFn)).toEqual(unMaskedValue)
      })
    })

    it('should masks out when condition is true', () => {
      // Arrange
      const validFields = ['a', 'c']
      const extensions = {
        filterFields: {
          condition: (_) => true,
          fields: validFields,
        },
      }

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        expect(maskOutFieldsMiddleware(ctx, nextFn)).toEqual(
          validFields.includes(field) ? unMaskedValue : Promise.resolve(null),
        )
      })
    })

    it('should not mask out when condition is false', () => {
      // Arrange
      const validFields = ['a', 'c']
      const extensions = {
        filterFields: {
          condition: (_) => false,
          fields: validFields,
        },
      }

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        expect(maskOutFieldsMiddleware(ctx, nextFn)).toEqual(unMaskedValue)
      })
    })
  })
})
