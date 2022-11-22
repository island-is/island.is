import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildRadioField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { Application } from '../../../types/schema'

//TODOx load from tachonet before this page and add to radio field condition

export const cardDeliverySubSection = buildSubSection({
  id: 'cardDelivery',
  title: applicant.labels.cardDelivery.subSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      description: applicant.labels.cardDelivery.description,
      children: [
        buildDescriptionField({
          id: 'cardDeliverySubtitle',
          title: applicant.labels.cardDelivery.chooseDeliverySubtitle,
          titleVariant: 'h5',
        }),
        buildRadioField({
          title: '',
          id: 'deliveryMethodIsSend',
          condition: (answers) => {
            const cardType = getValueViaPath(answers, 'cardType', '') as string

            return cardType !== 'reissue'
          },
          options: [
            {
              value: YES,
              label: applicant.labels.cardDelivery.legalDomicileOptionTitle,
            },
            {
              value: NO,
              label:
                applicant.labels.cardDelivery.transportAuthorityOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          title: '',
          id: 'deliveryMethodIsSend',
          condition: (answers) => {
            const cardType = getValueViaPath(answers, 'cardType', '') as string

            return cardType === 'reissue'
          },
          options: [
            {
              value: NO,
              label:
                applicant.labels.cardDelivery.transportAuthorityOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildDescriptionField({
          id: 'cardDeliveryNoteTitle',
          space: 3,
          title: applicant.labels.cardDelivery.chooseDeliveryNoteTitle,
          titleVariant: 'h5',
        }),
        buildDescriptionField({
          id: 'cardDeliveryNoteText',
          title: applicant.labels.cardDelivery.chooseDeliveryNoteText,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
