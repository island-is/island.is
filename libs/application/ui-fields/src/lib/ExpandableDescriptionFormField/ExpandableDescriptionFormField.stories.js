import { dedent } from 'ts-dedent'

import { ExpandableDescriptionFormField } from './ExpandableDescriptionFormField'

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
  title: 'Application System/ExpandableDescriptionFormField',
  component: ExpandableDescriptionFormField,
}

export const Default = {
  render: () => (
    <ExpandableDescriptionFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        introText: 'Field introText',
        description: '* bullet1\n * bullet2',
      }}
    />
  ),

  name: 'Default',
}
