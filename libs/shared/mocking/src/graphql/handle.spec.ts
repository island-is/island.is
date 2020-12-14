import { buildSchema } from 'graphql'

import { handle } from './handle'
import { createResolvers } from './createResolvers'

describe('handle', () => {
  const schema = buildSchema(`
    type Query {
      getValue: String
      getInput(input: String): String
      getError: String
    }
  `)
  const resolver = createResolvers({
    Query: {
      getValue: () => {
        return 'Hello world'
      },
      getInput: (_obj: unknown, { input }: { input: string }) => {
        return input
      },
      getError: () => {
        throw new Error('Test Error')
      },
    },
  })

  it('resolves normal query', async () => {
    const result = await handle(
      { query: '{ getValue }' },
      {
        schema: schema,
        fieldResolver: resolver.fieldResolver,
      },
    )

    expect(result).toEqual({ data: { getValue: 'Hello world' } })
  })

  it('resolves batched query', async () => {
    const result = await handle(
      [{ query: '{ getValue }' }, { query: '{ getValue }' }],
      {
        schema: schema,
        fieldResolver: resolver.fieldResolver,
      },
    )

    expect(result).toEqual([
      { data: { getValue: 'Hello world' } },
      { data: { getValue: 'Hello world' } },
    ])
  })

  it('resolves variable query', async () => {
    const result = await handle(
      {
        query: `
          query GetInput($input: String) {
            getInput(input: $input)
          }
        `,
        variables: { input: 'Hi input' },
      },
      {
        schema: schema,
        fieldResolver: resolver.fieldResolver,
      },
    )

    expect(result).toEqual({ data: { getInput: 'Hi input' } })
  })

  it('resolves correct operation', async () => {
    const result = await handle(
      {
        query: `
          query GetInput1($input1: String) {
            getInput(input: $input1)
          }
          query GetInput2($input2: String) {
            getInput(input: $input2)
          }
        `,
        variables: { input2: 'Hi input 2' },
        operationName: 'GetInput2',
      },
      {
        schema: schema,
        fieldResolver: resolver.fieldResolver,
      },
    )

    expect(result).toEqual({ data: { getInput: 'Hi input 2' } })
  })

  it('resolves error query', async () => {
    const result = await handle(
      { query: '{ getError }' },
      {
        schema: schema,
        fieldResolver: resolver.fieldResolver,
      },
    )

    expect(result).toEqual({
      data: { getError: null },
      errors: [expect.objectContaining({ message: 'Test Error' })],
    })
  })
})
