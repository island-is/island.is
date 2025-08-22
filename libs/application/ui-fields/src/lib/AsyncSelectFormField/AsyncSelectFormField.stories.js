import { dedent } from 'ts-dedent'

import { AsyncSelectFormField } from './AsyncSelectFormField'

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

export default {
  title: 'Application System/AsyncSelectFormField',
  component: AsyncSelectFormField,
}

export const Default = {
  render: () => (
    // Fetch something with apolloClient
    <AsyncSelectFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        isSearchable: true,

        loadOptions: async ({ apolloClient }) => {
          return await Promise.resolve([
            {
              label: 'Apple',
              value: 'apple',
            },
            {
              label: 'Pear',
              value: 'pear',
            },
            {
              label: 'Orange',
              value: 'orange',
            },
            {
              label: 'Grape',
              value: 'grape',
            },
            {
              label: 'Banana',
              value: 'banana',
            },
            {
              label: 'Fæðingarorlof',
              value: 'faedingarorlof',
            },
            {
              label: 'Atvinna',
              value: 'atvinna',
            },
            {
              label: 'Vottorð',
              value: 'vottord',
            },
          ])
        },

        backgroundColor: 'blue',
      }}
    />
  ),

  name: 'Default',
  height: '400px',
}
