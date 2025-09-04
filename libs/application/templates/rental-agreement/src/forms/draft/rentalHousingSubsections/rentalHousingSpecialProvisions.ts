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
import { PropertyUnit } from '../../../shared'
import * as m from '../../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: Routes.SPECIALPROVISIONS,
  title: m.specialProvisions.subsection.name,
  children: [
    buildMultiField({
      id: Routes.SPECIALPROVISIONS,
      title: m.specialProvisions.subsection.pageTitle,
      description: m.specialProvisions.subsection.pageDescription,
      children: [
        buildHiddenInputWithWatchedValue({
          id: 'specialProvisions.propertySearchUnits',
          watchValue: 'registerProperty.searchresults.units',
        }),
        buildAlertMessageField({
          id: 'specialProvisions.descriptionInputAlert',
          alertType: 'warning',
          message: m.specialProvisions.housingInfo.warningBanner,
          condition: (answers) => {
            const units = getValueViaPath<PropertyUnit[]>(
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
          title: m.specialProvisions.housingInfo.title,
          titleTooltip: m.specialProvisions.housingInfo.tooltip,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'specialProvisions.descriptionInput',
          title: m.specialProvisions.housingInfo.inputLabel,
          maxLength: SPECIALPROVISIONS_DESCRIPTION_MAXLENGTH,
          placeholder: m.specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
          required: (application: Application) => {
            const answers = application.answers
            const units = getValueViaPath<PropertyUnit[]>(
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
          title: m.specialProvisions.housingRules.title,
          titleTooltip: m.specialProvisions.housingRules.tooltip,
          titleVariant: 'h3',
          marginTop: 6,
        }),
        buildTextField({
          id: 'specialProvisions.rulesInput',
          title: m.specialProvisions.housingRules.inputLabel,
          placeholder: m.specialProvisions.housingRules.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
