import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildAlertMessageField,
  getValueViaPath,
  buildHiddenInputWithWatchedValue,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { SPECIALPROVISIONS_DESCRIPTION_MAXLENGTH } from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import { Unit } from '../../../shared'
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
        buildHiddenInputWithWatchedValue({
          id: 'specialProvisions.propertySearchUnits',
          watchValue: 'registerProperty.searchresults.units',
        }),
        buildAlertMessageField({
          id: 'specialProvisions.descriptionInputAlert',
          alertType: 'warning',
          message: specialProvisions.housingInfo.warningBanner,
          condition: (answers) => {
            const units = getValueViaPath<Unit[]>(
              answers,
              'registerProperty.searchresults.units',
              [],
            )
            const hasChangedSize =
              units?.some(
                (unit) => unit.changedSize && unit.changedSize !== unit.size,
              ) ?? false
            return hasChangedSize
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
          maxLength: SPECIALPROVISIONS_DESCRIPTION_MAXLENGTH,
          placeholder: specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
          required: (application: Application) => {
            const answers = application.answers
            const units = getValueViaPath<Unit[]>(
              answers,
              'registerProperty.searchresults.units',
              [],
            )
            const hasChangedSize =
              units?.some(
                (unit) => unit.changedSize && unit.changedSize !== unit.size,
              ) ?? false
            return hasChangedSize
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
