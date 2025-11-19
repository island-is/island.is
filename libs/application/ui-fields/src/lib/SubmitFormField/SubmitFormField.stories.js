import { dedent } from 'ts-dedent'

import { SubmitFormField } from './SubmitFormField'

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
  title: 'Application System/SubmitFormField',
  component: SubmitFormField,
}

export const Default = {
  render: () => (
    <SubmitFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',

        actions: [
          {
            event: 'SUBMIT',
            name: 'Submit',
            type: 'primary',
          },
        ],
      }}
    />
  ),

  name: 'Default',
}
