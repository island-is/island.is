import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { type Application, DefaultEvents } from '@island.is/application/types'
import {
  getPayerOverviewItems,
  getParticipantOverviewTableData,
} from '../../utils/getOverviewItems'
import { m } from '../../lib/messages'
import { doesCourseInstanceHaveChargeItemCode } from '../../utils/loadOptions'

const getOverviewSubmitLabel = (application: Application) => {
  const selectedInstanceId = getValueViaPath<string>(
    application.answers,
    'dateSelect',
    '',
  )

  return doesCourseInstanceHaveChargeItemCode(selectedInstanceId)
    ? m.overview.submitAndPayTitle
    : m.overview.submitRegistrationTitle
}

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: m.overview.sectionTitle,
      children: [
        buildOverviewField({
          id: 'participantOverview',
          bottomLine: false,
          title: m.overview.participantHeading,
          tableData: getParticipantOverviewTableData,
        }),
        buildOverviewField({
          id: 'payerOverview',
          bottomLine: false,
          title: m.overview.payerHeading,
          items: getPayerOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: getOverviewSubmitLabel,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: getOverviewSubmitLabel,
              type: 'primary',
            },
          ],
        }),
        buildDescriptionField({
          id: 'paymentWindowDescription',
          description: m.overview.paymentWindowDescription,
          condition: (answers) => {
            const selectedInstanceId = getValueViaPath<string>(
              answers,
              'dateSelect',
              '',
            )
            return doesCourseInstanceHaveChargeItemCode(selectedInstanceId)
          },
        }),
      ],
    }),
  ],
})
