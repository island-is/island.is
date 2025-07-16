import { dedent } from 'ts-dedent'

import { DividerFormField } from './DividerFormField'

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
  title: 'Application System/DividerFormField',
  component: DividerFormField,
}

export const Default = {
  render: () => (
    <DividerFormField application={createMockApplication()} field={{}} />
  ),
  name: 'Default',
}
