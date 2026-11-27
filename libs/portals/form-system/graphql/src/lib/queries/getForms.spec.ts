import { buildSchema, graphql, print } from 'graphql'
import { GET_FORMS } from './getForms'

const schema = buildSchema(`
  input FormSystemGetFormsInput { nationalId: String }
  type LanguageType { is: String }
  type FormSystemForm {
    id: String!
    name: LanguageType!
    slug: String
    modified: String!
    status: String!
    submissionServiceUrl: String
    isInaccessible: Boolean!
    lastModifiedBy: String
    derivedFrom: String
  }
  type Option { value: String, label: String, isSelected: Boolean }
  type FormSystemFormResponse { forms: [FormSystemForm], organizations: [Option] }
  type Query {
    formSystemForms(input: FormSystemGetFormsInput!): FormSystemFormResponse!
  }
`)

it.each([false, true])(
  'requests only table and action metadata with an empty list=%s',
  async (empty) => {
    const listItem = {
      id: 'form',
      name: { is: 'Form' },
      slug: 'form',
      modified: '2026-11-26T09:00:00Z',
      status: 'IN_DEVELOPMENT',
      submissionServiceUrl: 'zendesk',
      isInaccessible: false,
      lastModifiedBy: 'Editor',
      derivedFrom: null,
    }
    const organizations = [
      { value: 'organization', label: 'Organization', isSelected: true },
    ]
    const result = await graphql({
      schema,
      source: print(GET_FORMS),
      variableValues: { input: { nationalId: 'organization' } },
      rootValue: {
        formSystemForms: {
          forms: empty
            ? []
            : [
                {
                  ...listItem,
                  sectionInfo: { confirmationText: { is: 'Large text' } },
                  fields: [{ id: 'field' }],
                },
              ],
          organizations,
        },
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({
      formSystemForms: {
        forms: empty ? [] : [listItem],
        organizations,
      },
    })
  },
)
