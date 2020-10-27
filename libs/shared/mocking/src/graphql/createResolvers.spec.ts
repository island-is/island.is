import { createResolvers } from './createResolvers'
import { buildSchema, graphql } from 'graphql'

describe('createResolvers', () => {
  const schema = buildSchema(`
    type A {
      name: String!
    }
    union Union = A
    type Query {
      say(word: String!): String!
      union: Union!
    }
  `)

  const baseResolvers = {
    Union: {
      __resolveType(obj: { type: string }) {
        return obj.type
      },
    },
    Query: {
      say: (_obj: unknown, args: { word: string }) => {
        return `Hello ${args.word}`
      },
      union: () => ({ name: 'My name is A', type: 'A' }),
    },
  }

  it('resolves fields', async () => {
    // Arrange
    const resolvers = createResolvers(baseResolvers)

    // Act
    const result = await graphql({
      source: '{ say(word: "World") }',
      schema,
      fieldResolver: resolvers.fieldResolver,
    })

    // Assert
    expect(result.errors).not.toBeDefined()
    expect(result.data).toEqual({ say: 'Hello World' })
  })

  it('resolves union types', async () => {
    // Arrange
    const resolvers = createResolvers(baseResolvers)

    // Act
    const result = await graphql({
      source: '{ union { ...on A { name } } }',
      schema,
      fieldResolver: resolvers.fieldResolver,
      typeResolver: resolvers.typeResolver,
    })

    // Assert
    expect(result.errors).not.toBeDefined()
    expect(result.data).toEqual({ union: { name: 'My name is A' } })
  })

  it('supports overrides', async () => {
    // Arrange
    const resolvers = createResolvers(baseResolvers)
    resolvers.add({
      Query: {
        say() {
          return 'No!'
        },
      },
    })

    // Act
    const result = await graphql({
      source: '{ say(word: "World") }',
      schema,
      fieldResolver: resolvers.fieldResolver,
    })

    // Assert
    expect(result.errors).not.toBeDefined()
    expect(result.data).toEqual({ say: 'No!' })
  })

  it('supports nested overrides', async () => {
    // Arrange
    const resolvers = createResolvers(baseResolvers)
    resolvers.add({
      Query: {
        say() {
          return 'No!'
        },
      },
    })
    resolvers.add({
      Query: {
        union() {
          return { name: 'Changed', type: 'A' }
        },
      },
    })

    // Act
    const result = await graphql({
      source: '{ say(word: "World") union { ... on A { name } } }',
      schema,
      fieldResolver: resolvers.fieldResolver,
      typeResolver: resolvers.typeResolver,
    })

    // Assert
    expect(result.errors).not.toBeDefined()
    expect(result.data).toEqual({ say: 'No!', union: { name: 'Changed' } })
  })

  it('can reset overrides', async () => {
    // Arrange
    const resolvers = createResolvers(baseResolvers)
    resolvers.add({
      Query: {
        say() {
          return 'No!'
        },
      },
    })
    resolvers.reset()

    // Act
    const result = await graphql({
      source: '{ say(word: "World") }',
      schema,
      fieldResolver: resolvers.fieldResolver,
    })

    // Assert
    expect(result.errors).not.toBeDefined()
    expect(result.data).toEqual({ say: 'Hello World' })
  })
})
