import { dedent } from 'ts-dedent'
import { gql } from '@apollo/client'

import { CompanySearchFormField } from './CompanySearchFormField'

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

const COMPANY_REGISTRY_COMPANIES = gql`
  query SearchCompanies($input: RskCompanyInfoSearchInput!) {
    companyRegistryCompanies(input: $input) {
      data {
        name
        nationalId
      }
    }
  }
`

export default {
  title: 'Application System/CompanySearchFormField',
  component: CompanySearchFormField,
}

export const Default = {
  render: () => (
    <CompanySearchFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        placeholder: 'Field placeholder',
        setLabelToDataSchema: true,
      }}
    />
  ),

  name: 'Default',
  height: '400px',

  parameters: {
    apolloClient: {
      addTypename: false,

      mocks: [
        {
          request: {
            query: COMPANY_REGISTRY_COMPANIES,

            variables: {
              input: {
                searchTerm: 'pru',
                first: 100,
              },
            },
          },

          result: {
            data: {
              companyRegistryCompanies: {
                data: [
                  {
                    name: 'Prufu fyrirtæki 1',
                    nationalId: '1111111111',
                  },
                  {
                    name: 'Prufu fyrirtæki 2',
                    nationalId: '2222222222',
                  },
                  {
                    name: 'Prufu fyrirtæki 3',
                    nationalId: '3333333333',
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
