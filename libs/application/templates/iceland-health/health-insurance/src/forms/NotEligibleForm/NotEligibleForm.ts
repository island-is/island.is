import {
  buildAlertMessageField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages/messages'
import {
  hasHealthInsurance,
  hasNoIcelandicAddress,
} from '../../healthInsuranceUtils'

export const NotEligibleForm: Form = buildForm({
  id: 'HealthInsuranceNotEligible',
  title: m.prerequisitesFormTitle,
  logo: IcelandHealthLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'notEligible',
      title: m.prerequisiteCheckScreenTitle,
      children: [
        buildMultiField({
          id: 'notEligibleSummary',
          title: m.prerequisiteCheckScreenTitle,
          children: [
            buildDescriptionField({
              id: 'notEligibleIntro',
              description: m.prerequisiteCheckScreenTitle,
            }),
            buildAlertMessageField({
              id: 'alreadyInsuredAlert',
              title: m.alreadyInsuredTitle,
              message: m.alreadyInsuredDescription,
              alertType: 'warning',
              links: [
                {
                  title: m.alreadyInsuredButtonText,
                  url: m.alreadyInsuredButtonLink,
                  isExternal: true,
                },
              ],
              condition: (_, externalData) => hasHealthInsurance(externalData),
            }),
            buildAlertMessageField({
              id: 'noIcelandicAddressAlert',
              title: m.registerYourselfTitle,
              message: m.registerYourselfDescription,
              alertType: 'warning',
              links: [
                {
                  title: m.registerYourselfButtonText,
                  url: m.registerYourselfButtonLink,
                  isExternal: true,
                },
              ],
              condition: (_, externalData) =>
                hasNoIcelandicAddress(externalData),
            }),
          ],
        }),
      ],
    }),
  ],
})
