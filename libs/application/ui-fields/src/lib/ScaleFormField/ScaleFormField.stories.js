import { ScaleFormField } from './ScaleFormField'

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
  title: 'Application System/ScaleFormField',
  component: ScaleFormField,
}

export const Default = {
  render: () => (
    <ScaleFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Scale title',
        min: 1,
        max: 10,
        step: 1,
      }}
    />
  ),
}

export const WithLabels = {
  render: () => (
    <ScaleFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Scale title',
        min: 1,
        max: 10,
        step: 1,
        minLabel: 'Disagree',
        maxLabel: 'Agree',
        showLabels: true,
      }}
    />
  ),
}
