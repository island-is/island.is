import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getApplicantOverviewItems,
  getContactOverviewItems,
  useGetJobWishesOverviewItems,
  getPaymentOverviewItems,
} from '../../utils/getOverviewItems'

// TODO Finish this screen
export const overviewSection = buildSection({
  id: 'overviewSection',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: 'Overview',
      children: [
        buildOverviewField({
          id: 'overview.applicant',
          backId: 'applicantMultiField',
          items: getApplicantOverviewItems,
        }),

        buildOverviewField({
          id: 'overview.paymentInfo',
          backId: 'paymentInformationMultiField',
          items: getPaymentOverviewItems,
        }),

        // Income (conditional)

        buildOverviewField({
          id: 'overview.contact',
          backId: 'contact',
          items: getContactOverviewItems,
        }),

        buildOverviewField({
          id: 'overview.jobWish`es',
          backId: 'jobWishesMultiField',
          items: useGetJobWishesOverviewItems,
        }),

        // Job history

        // Academic history

        // Driving/Machine licenses

        // Language skills

        // Resumé

        //

        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
