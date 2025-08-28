import { dedent } from 'ts-dedent'

import { InformationCardFormField } from './InformationCardFormField'

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
  title: 'Application System/InformationCardFormField',
  component: InformationCardFormField,
}

export const Default = {
  render: () => (
    <InformationCardFormField
      application={createMockApplication()}
      field={{
        paddingX: 3,
        paddingY: 3,

        items: (application) => {
          return [
            {
              label: 'Test label 1',
              value: 'Test value 1',
            },
            {
              label: 'Test label 2',
              value: 'Test value 2',
            },
          ]
        },
      }}
    />
  ),

  name: 'Default',
}
