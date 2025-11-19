import { dedent } from 'ts-dedent'

import { AlertMessageFormField } from './AlertMessageFormField'

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
  title: 'Application System/AlertMessageFormField',
  component: AlertMessageFormField,
}

export const Default = {
  render: () => (
    <AlertMessageFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        alertType: 'success',
        message: 'field.message',
      }}
    />
  ),

  name: 'Default',
}

export const Links = {
  render: () => (
    <AlertMessageFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Alert with links',
        alertType: 'warning',
        message: 'field.message with a link',

        links: [
          {
            title: 'Demo link',
            isExternal: false,
            url: '/',
          },
        ],
      }}
    />
  ),

  name: 'Links',
}

export const Markdown = {
  render: () => (
    <AlertMessageFormField
      application={createMockApplication()}
      field={{
        title: 'Alert with Markdown',
        alertType: 'error',
        message: 'This is a **basic** markdown demo',

        links: [
          {
            title: 'Demo link',
            isExternal: false,
            url: '/',
          },
        ],
      }}
    />
  ),

  name: 'Markdown',
}
