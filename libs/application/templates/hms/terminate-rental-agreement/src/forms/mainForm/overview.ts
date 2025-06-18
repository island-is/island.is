import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getPersonalInformationOverviewItems,
  getRentalAgreementOverviewItems,
  getTerminationTypeOverviewItems,
  getBoundTerminationOverviewItems,
  getUnboundTerminationOverviewItems,
  getCancelationDetailsOverviewItems,
} from '../../utils/getOverviewItems'
import * as m from '../../lib/messages'
import {
  isBoundTermination,
  isCancelation,
  isUnboundTermination,
} from '../../utils/conditions'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: 'Overview',
      children: [
        buildOverviewField({
          id: 'personalInformationOverview',
          title: m.overviewMessages.personalInformationTitle,
          backId: 'applicant',
          bottomLine: false,
          items: getPersonalInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'rentalAgreementOverview',
          title: {
            ...m.overviewMessages.rentalAgreementTitle,
            values: {
              terminationType: 'rifta',
            },
          },
          backId: 'chooseContract',
          bottomLine: false,
          items: getRentalAgreementOverviewItems,
        }),
        buildOverviewField({
          id: 'terminationTypeOverview',
          title: m.overviewMessages.terminationTypeTitle,
          backId: 'terminationTypeMultiField',
          bottomLine: false,
          items: getTerminationTypeOverviewItems,
        }),

        buildOverviewField({
          condition: isCancelation,
          id: 'cancelationDetailsOverview',
          title: m.overviewMessages.cancelationDetailsTitle,
          backId: 'cancelationMultiField',
          bottomLine: false,
          items: getCancelationDetailsOverviewItems,
        }),
        buildOverviewField({
          condition: isBoundTermination,
          id: 'boundTerminationOverview',
          title: m.overviewMessages.boundTerminationTitle,
          backId: 'boundTerminationMultiField',
          bottomLine: false,
          items: getBoundTerminationOverviewItems,
        }),
        buildOverviewField({
          condition: isUnboundTermination,
          id: 'unboundTerminationOverview',
          title: m.overviewMessages.unboundTerminationTitle,
          backId: 'unboundTerminationMultiField',
          bottomLine: false,
          items: getUnboundTerminationOverviewItems,
        }),
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
