import {
  buildInformationFormField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { seminar as seminarMessages } from '../../../lib/messages'
import { PaymentCatalogItem } from '@island.is/application/types'
import { CourseDTO } from '@island.is/clients/seminars-ver'
import { getSeminarInfo } from '../../../utils/getSeminarInfo'

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

            return getSeminarInfo(seminar, paymentItem)
          },
        }),
      ],
    }),
  ],
})
