import { dedent } from 'ts-dedent'

import { SliderFormField } from './SliderFormField'

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
  title: 'Application System/SliderFormField',
  component: SliderFormField,
}

export const Default = {
  render: () => (
    <SliderFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Slider title',

        label: {
          singular: 'day',
          plural: 'days',
        },

        min: 1,
        max: 5,
        step: 1,
        showMinMaxLabels: true,
        showToolTip: true,

        trackStyle: {
          gridTemplateRows: 8,
        },

        calculateCellStyle: () => {
          return {
            background: 'blue',
          }
        },
      }}
    />
  ),

  name: 'Default',
}
