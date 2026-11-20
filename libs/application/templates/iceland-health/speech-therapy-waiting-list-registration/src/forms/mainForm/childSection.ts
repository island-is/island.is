import {
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { childMessages, sharedMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import {
  getRejectionReasonOptions,
  getSelectedChild,
} from '../../utils/speechTherapyWaitingListRegistrationUtils'

export const childSection = buildSection({
  id: 'childSection',
  title: childMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'child',
      title: childMessages.sectionTitle,
      description: childMessages.description,
      children: [
        buildTextField({
          id: 'child.name',
          title: sharedMessages.fullName,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.fullName,
        }),
        buildTextField({
          id: 'child.nationalId',
          title: sharedMessages.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.nationalId,
        }),
        buildTextField({
          id: 'child.address.streetAddress',
          title: childMessages.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.address?.streetAddress,
        }),
        buildTextField({
          id: 'child.address.locality',
          title: childMessages.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.address?.locality,
        }),
        buildRadioField({
          id: 'waitingList.consent',
          width: 'half',
          required: true,
          options: [
            {
              label: childMessages.waitingListConsentYes,
              value: YES,
            },
            {
              label: childMessages.waitingListConsentNo,
              value: NO,
            },
          ],
        }),
        buildSelectField({
          id: 'waitingList.declineReason',
          title: childMessages.waitingListDeclineReason,
          placeholder: childMessages.waitingListDeclineReasonPlaceholder,
          options: (application, _, locale) =>
            getRejectionReasonOptions(application.externalData, locale),
          condition: (answers) =>
            getApplicationAnswers(answers).waitingListConsent === NO,
        }),
      ],
    }),
  ],
})
