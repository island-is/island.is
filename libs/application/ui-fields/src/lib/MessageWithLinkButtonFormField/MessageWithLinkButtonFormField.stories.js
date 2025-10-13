import { dedent } from 'ts-dedent'

import { MessageWithLinkButtonFormField } from './MessageWithLinkButtonFormField'

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
  title: 'Application System/MessageWithLinkButtonFormField',
  component: MessageWithLinkButtonFormField,
}

export const Default = {
  render: () => (
    <MessageWithLinkButtonFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: '',
        url: '/minarsidur',
        message: 'Go to my pages',
        buttonTitle: 'Áfram',
      }}
    />
  ),

  name: 'Default',
}
