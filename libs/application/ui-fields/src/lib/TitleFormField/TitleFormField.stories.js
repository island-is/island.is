import { dedent } from 'ts-dedent'

import { TitleFormField } from './TitleFormField'

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
  title: 'Application System/TitleFormField',
  component: TitleFormField,
}

export const Default = {
  render: () => (
    <TitleFormField application={createMockApplication()} field={{}} />
  ),
  name: 'Default',
}
