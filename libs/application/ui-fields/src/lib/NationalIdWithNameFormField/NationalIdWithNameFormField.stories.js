import { dedent } from 'ts-dedent'
import { gql } from '@apollo/client'

import { NationalIdWithNameFormField } from './NationalIdWithNameFormField'

const createMockApplication = (data = {}) => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || 'ExampleForm',
  modified: new Date(),
  created: new Date(),
  attachments: {},
  answers: data.answers || {},
  externalData: data.externalData || {},
})

const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export default {
  title: 'Application System/NationalIdWithNameFormField',
  component: NationalIdWithNameFormField,
}

export const Default = {
  render: () => (
    <NationalIdWithNameFormField
      application={createMockApplication()}
      field={{
        id: 'seller',
        disabled: false,
        required: false,
        customNationalIdLabel: 'Kennitala seljanda',
        customNameLabel: 'Nafn seljanda',
        minAgePerson: 18,
      }}
    />
  ),

  name: 'Default',

  parameters: {
    apolloClient: {
      addTypename: false,

      mocks: [
        {
          request: {
            query: IDENTITY_QUERY,

            variables: {
              input: {
                nationalId: '1111223333',
              },
            },
          },

          result: {
            data: {
              identity: {
                data: [
                  {
                    __typename: 'IdentityPerson',
                    name: 'Prufa1',
                    nationalId: '1111223333',
                  },
                  {
                    __typename: 'IdentityPerson',
                    name: 'Prufa2',
                    nationalId: '1122223333',
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
}
