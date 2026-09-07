import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import {
  getApplicantOverviewItems,
  getHealthCertificateOverviewItems,
  getOverviewSubTypeText,
  getPaymentOverviewItems,
  getPickupOverviewItems,
} from '../../../utils/getOverviewItems'

export const sectionSummary = buildSection({
  id: 'overview',
  title: m.overviewMultiFieldTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewMultiFieldTitle,
      space: 2,
      description: m.overviewMultiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'subTypeTitle',
          title: m.overviewSubType,
          titleVariant: 'h4',
          space: 0,
        }),
        buildDescriptionField({
          id: 'subType',
          space: 0,
          description: (application, _locale, formatMessage) =>
            getOverviewSubTypeText(application, formatMessage),
        }),
        buildOverviewField({
          id: 'overviewApplicant',
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewHealthCertificate',
          items: getHealthCertificateOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewPickup',
          items: getPickupOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewPayment',
          items: getPaymentOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.orderDrivingLicense,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
