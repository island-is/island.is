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
import { Application } from '@island.is/api/schema'
import format from 'date-fns/format'
import {
  newestCardExists,
  newestCardIsValid,
  newestCardExpiresInMonths,
  newestCardIsExpired,
} from '../../../utils'
import { CardType } from '../../../shared'

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
          id: 'newestCard.isValidText',
          title: cardType.labels.newestCard.isValid,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => newestCardExists(externalData),
          defaultValue: (application: Application) => {
            return application.externalData?.newestDriversCard?.data?.isValid
              ? cardType.labels.newestCard.isValidYes.defaultMessage
              : cardType.labels.newestCard.isValidNo.defaultMessage
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
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) => !newestCardExists(externalData),
          options: [
            {
              value: CardType.FIRST_EDITION,
              label: cardType.labels.cardType.firstEditionOptionTitle,
              subLabel: cardType.labels.cardType.firstEditionOptionSubTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        // Note: This case might never happen, since we dont get drivers card from the API if already expired
        buildRadioField({
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) && newestCardIsExpired(externalData),
          options: [
            {
              value: CardType.REISSUE,
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel: cardType.labels.cardType.reissueOptionSubTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) &&
            !newestCardIsExpired(externalData) &&
            newestCardIsValid(externalData) &&
            newestCardExpiresInMonths(externalData) < 3,
          options: [
            {
              value: CardType.REISSUE,
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel: cardType.labels.cardType.reissueOptionSubTitle,
            },
            {
              value: CardType.RENEWAL,
              label: cardType.labels.cardType.renewalOptionTitle,
              subLabel: cardType.labels.cardType.renewalOptionSubTitle,
            },
            {
              value: CardType.REPRINT,
              label: cardType.labels.cardType.reprintOptionTitle,
              subLabel: cardType.labels.cardType.reprintOptionSubTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) &&
            !newestCardIsExpired(externalData) &&
            newestCardIsValid(externalData) &&
            newestCardExpiresInMonths(externalData) >= 3,
          options: [
            {
              value: CardType.REISSUE,
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel: cardType.labels.cardType.reissueOptionSubTitle,
            },
            {
              value: CardType.REPRINT,
              label: cardType.labels.cardType.reprintOptionTitle,
              subLabel: cardType.labels.cardType.reprintOptionSubTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          id: 'cardTypeSelection.cardType',
          condition: (_, externalData) =>
            newestCardExists(externalData) &&
            !newestCardIsExpired(externalData) &&
            !newestCardIsValid(externalData),
          options: [
            {
              value: CardType.REISSUE,
              label: cardType.labels.cardType.reissueOptionTitle,
              subLabel: cardType.labels.cardType.reissueOptionSubTitle,
            },
            {
              value: CardType.RENEWAL,
              label: cardType.labels.cardType.renewalOptionTitle,
              subLabel: cardType.labels.cardType.renewalOptionSubTitle,
            },
            {
              value: CardType.REPRINT,
              label: cardType.labels.cardType.reprintOptionTitle,
              subLabel: cardType.labels.cardType.reprintOptionSubTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
