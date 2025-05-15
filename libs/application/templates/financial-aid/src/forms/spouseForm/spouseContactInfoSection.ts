import {
  buildDescriptionField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { buildMultiField } from '@island.is/application/core'
import { buildSection } from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import { Application } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const spouseContactInfoSection = buildSection({
  id: Routes.SPOUSECONTACTINFO,
  title: m.contactInfo.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'contactInfoMultiField',
      title: m.contactInfo.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'contactInfoDescription',
          description: m.contactInfo.general.description,
        }),
        buildTextField({
          id: `${Routes.SPOUSECONTACTINFO}.email`,
          title: m.contactInfo.emailInput.label,
          placeholder: m.contactInfo.emailInput.placeholder,
          defaultValue: (application: Application) => {
            const spouseEmail = getValueViaPath<string>(
              application.answers,
              'spouse.email',
            )
            const relationshipStatusSpouseEmail = getValueViaPath<string>(
              application.answers,
              'relationshipStatus.spouseEmail',
            )
            return spouseEmail || relationshipStatusSpouseEmail
          },
        }),
        buildTextField({
          id: `${Routes.SPOUSECONTACTINFO}.phone`,
          title: m.contactInfo.phoneInput.label,
          placeholder: m.contactInfo.phoneInput.placeholder,
          format: '###-####',
        }),
      ],
    }),
  ],
})
