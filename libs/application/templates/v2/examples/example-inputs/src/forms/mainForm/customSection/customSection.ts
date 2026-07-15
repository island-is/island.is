import { SectionBuilder } from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const customSection = new SectionBuilder(
  'customSection',
  'Custom section',
)
  .addPage('customMultiField', '', (page) => {
    page
      .addDescriptionField('customDescription', 'Custom Components', {
        description: m.customComponentDescription,
        marginBottom: [2],
      })
      .addDescriptionField('customDescription2', '', {
        description: m.customComponentNumberedList,
        marginBottom: [2],
      })
      .addCustomField(
        'customComponent',
        'The custom component',
        'ExampleCustomComponent',
        {
          someData: ['foo', 'bar', 'baz'],
        },
      )
  })
  .build()
