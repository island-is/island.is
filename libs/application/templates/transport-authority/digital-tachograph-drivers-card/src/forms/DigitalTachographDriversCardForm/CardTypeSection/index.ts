import { buildSection, buildTextField } from '@island.is/application/core'
import { cardType } from '../../../lib/messages'
import {
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { Application } from '../../../types/schema'

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
        }),
        buildTextField({
          id: 'newestCard.applicationCreatedAt',
          title: cardType.labels.newestCard.applicationCreatedAt,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.newestDriversCard?.data
              ?.applicationCreatedAt,
        }),
        buildTextField({
          id: 'newestCard.cardNumber',
          title: cardType.labels.newestCard.cardNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.newestDriversCard?.data?.cardNumber,
        }),
        buildTextField({
          id: 'newestCard.cardValidFrom',
          title: cardType.labels.newestCard.cardValidFrom,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.newestDriversCard?.data?.cardValidFrom,
        }),
        buildTextField({
          id: 'newestCard.cardValidTo',
          title: cardType.labels.newestCard.cardValidTo,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.newestDriversCard?.data?.cardValidTo,
        }),
        buildTextField({
          id: 'newestCard.countryOfIssue',
          title: cardType.labels.newestCard.countryOfIssue,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: cardType.labels.newestCard.countryOfIssueIceland,
        }),
      ],
    }),
  ],
})
