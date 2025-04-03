import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const workingAbilitySubSection = buildSubSection({
  id: 'workingAbilitySubSection',
  title: 'workingAbilitySubSection',
  children: [
    buildMultiField({
      id: 'workingAbilitySubSection',
      title: employmentMessages.workingAbility.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
