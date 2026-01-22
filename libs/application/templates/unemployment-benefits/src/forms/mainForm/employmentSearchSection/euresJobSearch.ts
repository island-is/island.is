import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { Eures } from '../../../assets/Eures'

export const euresJobSearchSubSection = buildSubSection({
  id: 'euresJobSearchSubSection',
  title: employmentSearchMessages.euresJobSearch.sectionTitle,
  children: [
    buildMultiField({
      id: 'euresJobSearchSubSection',
      title: employmentSearchMessages.euresJobSearch.pageTitle,
      children: [
        buildImageField({
          id: 'euresJobSearch.image',
          image: Eures,
          imagePosition: 'left',
          imageWidth: 'auto',
        }),
        buildDescriptionField({
          id: 'euresJobSearch.description',
          description: employmentSearchMessages.euresJobSearch.pageDescription,
        }),
        buildRadioField({
          id: 'euresJobSearch.agreement',
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'euresJobSearchAgreementAlert',
          message: employmentSearchMessages.euresJobSearch.agreementAlert,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
