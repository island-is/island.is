import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildAlertMessageField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { specialProvisions } from '../../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: Routes.SPECIALPROVISIONS,
  title: specialProvisions.subsection.name,
  children: [
    buildMultiField({
      id: Routes.SPECIALPROVISIONS,
      title: specialProvisions.subsection.pageTitle,
      description: specialProvisions.subsection.pageDescription,
      children: [
        buildHiddenInput({
          id: 'specialProvisions.descriptionInputRequired',
          defaultValue: true,
          // TODO: change condition to check if m2 have been altered
          condition: (answers) => {
            return (
              getValueViaPath<string>(
                answers,
                'registerProperty.categoryClassGroup',
              ) === 'studentHousing'
            )
          },
        }),
        buildAlertMessageField({
          id: 'specialProvisions.descriptionInputAlert',
          alertType: 'warning',
          message: specialProvisions.housingInfo.warningBanner,
          // TODO: change condition to check if m2 have been altered
          condition: (answers) => {
            return (
              getValueViaPath<string>(
                answers,
                'registerProperty.categoryClassGroup',
              ) === 'studentHousing'
            )
          },
        }),
        buildDescriptionField({
          id: 'specialProvisions.descriptionTitle',
          title: specialProvisions.housingInfo.title,
          titleTooltip: specialProvisions.housingInfo.tooltip,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'specialProvisions.descriptionInput',
          title: specialProvisions.housingInfo.inputLabel,
          maxLength: 1500,
          placeholder: specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
          // TODO: change condition to check if m2 have been altered
          required: (application) => {
            return (
              getValueViaPath<string>(
                application.answers,
                'registerProperty.categoryClassGroup',
              ) === 'studentHousing'
            )
          },
        }),
        buildDescriptionField({
          id: 'specialProvisions.rulesTitle',
          title: specialProvisions.housingRules.title,
          titleTooltip: specialProvisions.housingRules.tooltip,
          titleVariant: 'h3',
          marginTop: 6,
        }),
        buildTextField({
          id: 'specialProvisions.rulesInput',
          title: specialProvisions.housingRules.inputLabel,
          placeholder: specialProvisions.housingRules.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
