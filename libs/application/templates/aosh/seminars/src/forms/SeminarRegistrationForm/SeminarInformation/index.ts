import {
  buildAlertMessageField,
  buildInformationFormField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'

import { seminar as seminarMessages } from '../../../lib/messages'
import {
  ExternalData,
  FormValue,
  PaymentCatalogItem,
} from '@island.is/application/types'
import { formatIsk, isPersonType } from '../../../utils'
import { CourseDTO } from '@island.is/clients/seminars-ver'

export const seminarInformationSection = buildSection({
  id: 'seminarInformation',
  title: seminarMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'seminarInformationMultiField',
      title: seminarMessages.general.pageTitle,
      description: seminarMessages.general.pageDescription,
      children: [
        buildInformationFormField({
          paddingX: 3,
          paddingY: 3,
          items: (application) => {
            const seminar = getValueViaPath<CourseDTO>(
              application.externalData,
              'seminar.data',
            )
            const paymentItem = getValueViaPath<Array<PaymentCatalogItem>>(
              application.externalData,
              'payment.data',
            )?.filter(
              (item: PaymentCatalogItem) =>
                item.chargeItemCode === seminar?.feeCodeDirectPayment,
            )[0]

            return [
              {
                label: seminarMessages.labels.seminarType,
                value: seminar?.name ?? '',
              },
              {
                label: seminarMessages.labels.seminarPrice,
                value: formatIsk(paymentItem?.priceAmount ?? 0),
              },
              {
                label: seminarMessages.labels.seminarBegins,
                value: seminar?.alwaysOpen
                  ? seminarMessages.labels.seminarOpens
                  : seminar?.dateFrom ?? '',
              },
              {
                label: seminarMessages.labels.seminarEnds,
                value: seminar?.alwaysOpen
                  ? seminarMessages.labels.openForWeeks
                  : seminar?.dateTo ?? '',
              },
              {
                label: '',
                value: '',
              },
              {
                label: seminarMessages.labels.seminarDescription,
                value: {
                  ...seminarMessages.labels.seminarDescriptionUrlText,
                  values: { url: seminar?.descriptionUrl },
                },
              },
              {
                label: seminarMessages.labels.seminarLocation,
                value: seminar?.location ?? '',
              },
            ]
          },
        }),
        buildAlertMessageField({
          id: 'seminarInformationAlert',
          title: '',
          message: seminarMessages.labels.alertMessage,
          alertType: 'info',
          marginTop: 4,
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, externalData: ExternalData) =>
            isPersonType(externalData),
        }),
      ],
    }),
  ],
})
