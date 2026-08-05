import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const sectionRequirements = (
  allow65RenewalRedesign = false,
  allowBTempRedesign = false,
) =>
  buildSubSection({
    id: 'requirements',
    title: m.applicationEligibilityTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationEligibilityTitle,
        description: m.eligibilityRequirementTitle,
        children: [
          buildHiddenInput({
            id: 'is65RenewalRedesignEnabled',
            defaultValue: () => allow65RenewalRedesign,
          }),
          buildHiddenInput({
            id: 'isBTempRedesignEnabled',
            defaultValue: () => allowBTempRedesign,
          }),
          buildCustomField({
            title: m.eligibilityRequirementTitle,
            component: 'EligibilitySummary',
            id: 'eligsummary',
          }),
          buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: m.orderDrivingLicense,
            refetchApplicationAfterSubmit: true,
            condition: (answers) =>
              getValueViaPath(answers, 'requirementsMet') === true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.continue,
                type: 'primary',
              },
            ],
          }),
        ],
      }),
    ],
  })
