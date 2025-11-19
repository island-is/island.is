import { dedent } from 'ts-dedent'

import { KeyValueFormField } from './KeyValueFormField'

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
  title: 'Application System/KeyValueFormField',
  component: KeyValueFormField,
}

export const Default = {
  render: () => (
    <KeyValueFormField
      application={createMockApplication()}
      field={{
        label: 'Label',
        value: 'Value',
      }}
    />
  ),

  name: 'Default',
}
