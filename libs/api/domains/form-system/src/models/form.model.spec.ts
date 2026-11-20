import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { Test } from '@nestjs/testing'
import { graphql } from 'graphql'
import { Form } from './form.model'

@Resolver(() => Form)
class TestFormResolver {
  @Query(() => Form)
  form(): Partial<Form> {
    return {}
  }
}

it('returns a derived revision reference as a UUID string', async () => {
  const module = await Test.createTestingModule({
    imports: [GraphQLSchemaBuilderModule],
  }).compile()
  try {
    const schema = await module
      .get(GraphQLSchemaFactory)
      .create([TestFormResolver])
    const derivedFrom = '93e9908d-4c36-4629-9c35-27287a608cf2'
    const result = await graphql({
      schema,
      source: '{ form { derivedFrom } }',
      rootValue: { form: { derivedFrom } },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.form).toEqual({ derivedFrom })
  } finally {
    await module.close()
  }
})
