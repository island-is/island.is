import {
    buildDescriptionField,
    buildMultiField,
    buildSection,
  } from '@island.is/application/core'
  
  export const verifySection = buildSection({
    id: 'verifySection',
    title: 'Skráning móttekin!',
    children: [
      buildMultiField({
        id: 'verifyMultiField',
        title: 'Skráning móttekin!',
        children: [
          buildDescriptionField({
            id: 'verifyDescription',
            description: 'Staðfestinga skjár'
          })
        ],
      }),
    ],
  })
