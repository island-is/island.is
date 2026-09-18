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

/* Built from this one input type rather than from the module's real resolver:
 * a full schema cannot be constructed in this project's test context, since
 * TaxCalculatorType's registerEnumType call lives in libs/cms and never runs
 * here. InputValue references nothing outside itself, so it can be probed
 * alone -- and it is the one model whose correctness is a schema fact rather
 * than a TypeScript one. */
@Resolver()
class ProbeResolver {
  /* Nullable because the factory builds a schema without instantiating this
   * resolver: the field has no implementation to run, and only variable
   * coercion -- which happens before any field is resolved -- is under test. */
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
    /* What a cleared form control produces, and why a consumer must omit the
     * whole row instead. This surfaces as a top-level GraphQL error, not as an
     * entry in the response `errors` array. */
    ['an explicit null', { stringValue: null }],
  ])(
    'rejects %s during coercion, before any resolver runs',
    async (_label, value) => {
      expect((await probe(value)).errors).toBeDefined()
    },
  )
})
