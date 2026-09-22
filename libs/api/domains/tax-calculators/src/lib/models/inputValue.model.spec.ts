import { NestFactory } from '@nestjs/core'
import {
  Args,
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
  Query,
  Resolver,
} from '@nestjs/graphql'
import type { GraphQLSchema } from 'graphql'
import { graphql, printSchema } from 'graphql'

import { InputValue } from './inputValue.model'

/* Probed standalone -- InputValue references nothing outside itself. */
@Resolver()
class ProbeResolver {
  /* Nullable: the factory never instantiates this resolver, only coerces variables. */
  @Query(() => Boolean, { nullable: true })
  probe(@Args('value') value: InputValue): boolean {
    return value !== undefined
  }
}

let schema: GraphQLSchema

beforeAll(async () => {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule, {
    logger: false,
  })
  await app.init()

  schema = await app.get(GraphQLSchemaFactory).create([ProbeResolver])

  await app.close()
})

const probe = (value: Record<string, unknown>) =>
  graphql({
    schema,
    source:
      'query Probe($value: TaxCalculatorInputValue!) { probe(value: $value) }',
    variableValues: { value },
  })

describe('TaxCalculatorInputValue', () => {
  it('emits the oneOf directive', () => {
    expect(printSchema(schema)).toContain(
      'input TaxCalculatorInputValue @oneOf',
    )
  })

  it('declares every member nullable, which the directive requires', () => {
    expect(printSchema(schema)).toContain('numberValue: Float')
    expect(printSchema(schema)).not.toContain('numberValue: Float!')
  })

  it('accepts exactly one member', async () => {
    expect((await probe({ numberValue: 1 })).errors).toBeUndefined()
  })

  it.each([
    ['two members', { numberValue: 1, stringValue: 'x' }],
    ['no members', {}],
    ['an explicit null', { stringValue: null }],
  ])(
    'rejects %s during coercion, before any resolver runs',
    async (_label, value) => {
      expect((await probe(value)).errors).toBeDefined()
    },
  )
})
