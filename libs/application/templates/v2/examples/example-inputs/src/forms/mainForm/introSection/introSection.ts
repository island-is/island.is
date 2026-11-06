import { SectionBuilder } from '@island.is/application/core'

export const introSection = new SectionBuilder('introSection', 'Intro Section')
  .addPage('introMultiField', 'Example fields', (page) => {
    page
      .addDescriptionField('introDescription', '', {
        description:
          'This application walks through all the different possibilities that the application system offers for input related fields.',
      })
      .addDescriptionField('introDescriotion2', '', {
        description:
          'For examples on fields with no inputs, like descriptions, alerts, accordions, keyValue and so on, visit ```/umsoknir/example-no-inputs```',
      })
  })
  .build()
