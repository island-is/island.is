import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildHiddenInputWithWatchedValue,
  buildRadioField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'
import { getYesNoOptions } from '../../../utils/utils'

export const RentalHousingFireProtections = buildSubSection({
  id: Routes.FIREPROTECTIONS,
  title: m.housingFireProtections.subSectionName,
  children: [
    buildMultiField({
      id: Routes.FIREPROTECTIONS,
      title: m.housingFireProtections.pageTitle,
      description: m.housingFireProtections.pageDescription,
      children: [
        buildDescriptionField({
          id: 'fireProtections.smokeDetectorsFireExtinguisherRequirements',
          description:
            m.housingFireProtections.smokeDetectorsFireExtinguisherRequirements,
          space: 0,
        }),
        buildAlertMessageField({
          id: 'fireProtections.smokeDetectorsRequirements',
          title: m.housingFireProtections.smokeDetectorsAlertTitle,
          message: (application) => {
            console.log('application: ', application)

            return {
              ...m.housingFireProtections.smokeDetectorsAlertMessage,
              values: {
                propertySize: 80,
                requiredSmokeDetectors: 1,
              },
            }
          },
          alertType: 'warning',
        }),
        buildTextField({
          id: 'fireProtections.smokeDetectors',
          title: m.housingFireProtections.smokeDetectorsLabel,
          width: 'half',
          maxLength: 1,
          format: '#',
          min: 0,
          max: 9,
        }),
        buildTextField({
          id: 'fireProtections.fireExtinguisher',
          title: m.housingFireProtections.fireExtinguisherLabel,
          width: 'half',
          maxLength: 1,
          format: '#',
          min: 0,
          max: 9,
        }),
        buildDescriptionField({
          id: 'fireProtections.fireBlanketRequirements',
          title: m.housingFireProtections.fireBlanketLabel,
          titleVariant: 'h3',
          description: m.housingFireProtections.fireBlanketRequirements,
          space: 4,
        }),
        buildRadioField({
          id: 'fireProtections.fireBlanket',
          options: getYesNoOptions(),
          width: 'half',
          space: 0,
        }),
        buildDescriptionField({
          id: 'fireProtections.exitRequirements',
          title: m.housingFireProtections.exitsLabel,
          titleVariant: 'h3',
          description: m.housingFireProtections.exitRequirements,
          space: 4,
        }),
        buildRadioField({
          id: 'fireProtections.emergencyExits',
          options: getYesNoOptions(),
          width: 'half',
          space: 0,
        }),
        buildHiddenInputWithWatchedValue({
          id: 'fireProtections.propertySize',
          watchValue: 'registerProperty.searchresults.units',
        }),
      ],
    }),
  ],
})
