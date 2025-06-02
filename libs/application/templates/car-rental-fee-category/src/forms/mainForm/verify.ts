import {
    buildDescriptionField,
    buildMultiField,
    buildSection,
    buildSubmitField,
  } from '@island.is/application/core'
  
  export const verifySection = buildSection({
    id: 'verifySection',
    title: 'Yfirferð',
    children: [
      buildMultiField({
        id: 'verifyMultiField',
        title: 'Yfirferð',
        children: [
          buildDescriptionField({
            id: 'verifyDescription',
            description: 'huehuehue'
          })
        ],
      }),
    ],
  })
  