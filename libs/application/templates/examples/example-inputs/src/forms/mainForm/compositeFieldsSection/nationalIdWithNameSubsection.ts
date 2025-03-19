import {
  buildNationalIdWithNameField,
  buildSubSection,
} from '@island.is/application/core'

export const nationalIdWithNameSubsection = buildSubSection({
  id: 'nationalIdWithNameSubsection',
  title: 'National ID with name subsection',
  children: [
    // TODO: Add text to describe the field
    buildNationalIdWithNameField({
      id: 'pickRole.electPerson',
      title: 'Lookup name by national ID',
    }),
  ],
})
