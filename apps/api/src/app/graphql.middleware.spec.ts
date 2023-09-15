import { MiddlewareContext } from '@nestjs/graphql'

import { maskOutFieldsMiddleware } from './graphql.middleware'

describe('GraphQL Middlewares', () => {
  const fields = ['a', 'b', 'c', 'd']
  const createContext = (
    fieldName: string,
    extensions: MiddlewareContext['info']['parentType']['extensions'],
  ) =>
    ({
      info: {
        fieldName,
        parentType: {
          extensions,
        },
      },
    } as MiddlewareContext)

  describe('filterFields', () => {
    it('should not mask out when no extensions is defined', () => {
      // Arrange
      const extensions: any = undefined

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        const nextFn = jest.fn()
        maskOutFieldsMiddleware(ctx, nextFn)
        expect(nextFn).toHaveBeenCalled()
      })
    })

    it('should not mask out when no filterFields are defined', () => {
      // Arrange
      const extensions = {}

      // Act & Assert
      fields.forEach((field) => {
        const ctx = createContext(field, extensions)
        const nextFn = jest.fn()
        maskOutFieldsMiddleware(ctx, nextFn)
        expect(nextFn).toHaveBeenCalled()
      })
    })

    it('should masks out when condition is true', () => {
      // Arrange
      const validFields = ['a', 'c']
      const extensions = {
        filterFields: {
          condition: () => true,
          fields: validFields,
        },
      }

      // Act & Assert
      fields.forEach((field) => {
        const nextFn = jest.fn()
        const ctx = createContext(field, extensions)
        maskOutFieldsMiddleware(ctx, nextFn)
        if (validFields.includes(field)) {
          expect(nextFn).toHaveBeenCalled()
        } else {
          expect(nextFn).not.toHaveBeenCalled()
        }
      })
    })

    it('should not mask out when condition is false', () => {
      // Arrange
      const validFields = ['a', 'c']
      const extensions = {
        filterFields: {
          condition: () => false,
          fields: validFields,
        },
      }

      // Act & Assert
      fields.forEach((field) => {
        const nextFn = jest.fn()
        const ctx = createContext(field, extensions)
        maskOutFieldsMiddleware(ctx, nextFn)
        expect(nextFn).toHaveBeenCalled()
      })
    })
  })
})
