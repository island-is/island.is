import {
  buildRadioField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { cardType } from '../../../lib/messages'
import {
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { Application } from '../../../types/schema'
import format from 'date-fns/format'
import {
  newestCardExists,
  newestCardExpiresInMonths,
  newestCardIsExpired,
} from '../../../utils'

export const cardTypeSection = buildSection({
  id: 'cardTypeSection',
  title: cardType.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'cardTypeMultiField',
      title: cardType.general.pageTitle,
      description: cardType.general.description,
      children: [
        buildDescriptionField({
          id: 'newestCard.subtitle',
          title: cardType.labels.newestCard.subtitle,
          titleVariant: 'h5',
          condition: (_, externalData) => newestCardExists(externalData),
        }),
        buildTextField({
          id: 'newestCard.applicationCreatedAt',
          title: cardType.labels.newestCard.applicationCreatedAt,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue: (application: Application) => {
            return format(
              new Date(
                application.externalData?.newestDriversCard?.data?.applicationCreatedAt,
              ),
              'dd.MM.yyyy',
            )
          },
        }),
        buildTextField({
          id: 'newestCard.cardNumber',
          title: cardType.labels.newestCard.cardNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue: (application: Application) =>
            application.externalData?.newestDriversCard?.data?.cardNumber,
        }),
        buildTextField({
          id: 'newestCard.cardValidFrom',
          title: cardType.labels.newestCard.cardValidFrom,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue: (application: Application) => {
            return format(
              new Date(
                application.externalData?.newestDriversCard?.data?.cardValidFrom,
              ),
              'dd.MM.yyyy',
            )
          },
        }),
        buildTextField({
          id: 'newestCard.cardValidTo',
          title: cardType.labels.newestCard.cardValidTo,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue: (application: Application) => {
            return format(
              new Date(
                application.externalData?.newestDriversCard?.data?.cardValidTo,
              ),
              'dd.MM.yyyy',
            )
          },
        }),
        buildTextField({
          id: 'newestCard.countryOfIssue',
          title: cardType.labels.newestCard.countryOfIssue,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue:
            cardType.labels.newestCard.countryOfIssueIceland.defaultMessage,
        }),
        buildDescriptionField({
          id: 'cardType.subtitle',
          title: cardType.labels.cardType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) => !newestCardExists(externalData),
          options: [
            {
              value: 'firstEdition',
              label: cardType.labels.cardType.firstEditionOptionTitle,
              subLabel:
                cardType.labels.cardType.firstEditionOptionSubTitle
                  .defaultMessage,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          title: '',
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) && newestCardIsExpired(externalData),
          options: [
            {
              value: 'reissue',
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel:
                cardType.labels.cardType.reissueOptionSubTitle.defaultMessage,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          title: '',
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) &&
            !newestCardIsExpired(externalData) &&
            newestCardExpiresInMonths(externalData) < 3,
          options: [
            {
              value: 'reissue',
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel:
                cardType.labels.cardType.reissueOptionSubTitle.defaultMessage,
            },
            {
              value: 'renewal',
              label: cardType.labels.cardType.renewalOptionTitle,
              subLabel:
                cardType.labels.cardType.renewalOptionSubTitle.defaultMessage,
            },
            {
              value: 'reprint',
              label: cardType.labels.cardType.reprintOptionTitle,
              subLabel:
                cardType.labels.cardType.reprintOptionSubTitle.defaultMessage,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          title: '',
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) &&
            !newestCardIsExpired(externalData) &&
            newestCardExpiresInMonths(externalData) >= 3,
          options: [
            {
              value: 'reissue',
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel:
                cardType.labels.cardType.reissueOptionSubTitle.defaultMessage,
            },
            {
              value: 'reprint',
              label: cardType.labels.cardType.reprintOptionTitle,
              subLabel:
                cardType.labels.cardType.reprintOptionSubTitle.defaultMessage,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
