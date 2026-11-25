import {
  Args,
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { Test } from '@nestjs/testing'
import { parse, validate } from 'graphql'
import { FieldInput, UpdateFieldDtoInput } from '../dto/field.input'
import { UpdateFieldSettingsInput } from '../dto/updateFieldSettings.input'
import { Field } from './field.model'

@Resolver(() => Field)
class TestFieldResolver {
  @Query(() => Field)
  field(): Partial<Field> {
    return {}
  }

  @Mutation(() => Boolean)
  updateField(
    @Args('field') _field: FieldInput,
    @Args('update') _update: UpdateFieldDtoInput,
    @Args('settings') _settings: UpdateFieldSettingsInput,
  ) {
    return true
  }
}

it('accepts new field content and rejects removed legacy GraphQL fields', async () => {
  const module = await Test.createTestingModule({
    imports: [GraphQLSchemaBuilderModule],
  }).compile()
  try {
    const schema = await module
      .get(GraphQLSchemaFactory)
      .create([TestFieldResolver])
    expect(
      validate(
        schema,
        parse(`mutation {
          updateField(
            field: {
              informationText: { is: "Information" }
              tooltip: { en: "Help" }
              fieldSettings: { subLabel: { is: "Label" } }
            }
            update: { informationText: { en: "Information" }, tooltip: { is: "Help" } }
            settings: { subLabel: { en: "Label" } }
          )
        }`),
      ),
    ).toEqual([])
    expect(
      validate(
        schema,
        parse(`query {
          field {
            informationText { is en }
            tooltip { is en }
            fieldSettings { subLabel { is en } }
          }
        }`),
      ),
    ).toEqual([])
    const inputErrors = validate(
      schema,
      parse(`mutation {
          updateField(
            field: { description: { is: "Old" }, fieldSettings: { hasDescription: true } }
            update: { description: { en: "Old" } }
            settings: { hasDescription: false }
          )
        }`),
    )
    expect(inputErrors).toHaveLength(4)
    expect(inputErrors.map((error) => error.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'Field "description" is not defined by type "FieldInput".',
        ),
        expect.stringContaining(
          'Field "description" is not defined by type "FormSystemUpdateFieldDtoInput".',
        ),
        expect.stringContaining(
          'Field "hasDescription" is not defined by type "FormSystemFieldSettingsInput".',
        ),
        expect.stringContaining(
          'Field "hasDescription" is not defined by type "FormSystemUpdateFieldSettingsInput".',
        ),
      ]),
    )
    const outputErrors = validate(
      schema,
      parse(`query {
        field {
          description { is en }
          fieldSettings { hasDescription }
        }
      }`),
    )
    expect(outputErrors).toHaveLength(2)
    expect(outputErrors.map((error) => error.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'Cannot query field "description" on type "FormSystemField".',
        ),
        expect.stringContaining(
          'Cannot query field "hasDescription" on type "FormSystemFieldSettings".',
        ),
      ]),
    )
  } finally {
    await module.close()
  }
})
