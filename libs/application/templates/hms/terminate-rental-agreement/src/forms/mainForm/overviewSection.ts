import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  getPersonalInformationOverviewItems,
  getRentalAgreementOverviewItems,
  getTerminationTypeOverviewItems,
  getBoundTerminationOverviewItems,
  getUnboundTerminationOverviewItems,
  getCancelationDetailsOverviewItems,
  getFileUploadOverviewItems,
} from '../../utils/getOverviewItems'
import * as m from '../../lib/messages'
import {
  isBoundTermination,
  isCancellation,
  isUnboundTermination,
} from '../../utils/conditions'
import { TerminationTypes } from '../../types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewMessages.overviewTitle,
  children: [
    buildMultiField({
      condition: (answers, externalData) => {
        console.log('answers: ', answers)
        console.log('externalData: ', externalData)
        return true
      },
      id: 'overviewMultiField',
      title: m.overviewMessages.overviewTitle,
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
          title: (application) => ({
            ...m.overviewMessages.rentalAgreementTitle,
            values: {
              terminationType:
                getValueViaPath(
                  application.answers,
                  'terminationType.answer',
                ) === TerminationTypes.CANCELATION
                  ? 'rifta'
                  : 'segja upp',
            },
          }),
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
          condition: isCancellation,
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
        buildOverviewField({
          id: 'fileUploadOverview',
          title: m.fileUploadMessages.title,
          backId: 'fileUploadMultiField',
          bottomLine: false,
          attachments: getFileUploadOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.overviewMessages.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
