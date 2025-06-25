import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTitleField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { EmploymentEnum } from '../../../lib/constants'

const employmentParticipationRoute = 'employmentParticipation'

export const employmentParticipationSubSection =
    buildSubSection({
      id: employmentParticipationRoute,
      tabTitle: disabilityPensionFormMessage.employmentParticipation.tabTitle,
      children: [
        buildMultiField({
          id: employmentParticipationRoute,
          space: 'containerGutter',
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.employmentParticipation.title,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildRadioField({
              id: `${employmentParticipationRoute}.inPaidWork`,
              title: disabilityPensionFormMessage.employmentParticipation.inPaidWorkTitle,
              width: 'full',
              backgroundColor: 'blue',
              required: true,
              options: [
                {
                  value: EmploymentEnum.YES,
                  label: disabilityPensionFormMessage.employmentParticipation.yes,
                },
                {
                  value: EmploymentEnum.NO,
                  label: disabilityPensionFormMessage.employmentParticipation.no,
                },
                {
                  value: EmploymentEnum.DONT_KNOW,
                  label: disabilityPensionFormMessage.employmentParticipation.dontKnow,
                },
              ],
            }),
            buildRadioField({
              id: `${employmentParticipationRoute}.continuedWork`,
              title: disabilityPensionFormMessage.employmentParticipation.continuedWorkQuestion,
              width: 'half',
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) => {
                const isWorking = getValueViaPath<EmploymentEnum>(
                  formValue,
                  `${employmentParticipationRoute}.inPaidWork`,
                )

                return isWorking === EmploymentEnum.YES
              },
              options: [
                {
                  value: YES,
                  label: disabilityPensionFormMessage.employmentParticipation.yes,
                },
                {
                  value: NO,
                  label: disabilityPensionFormMessage.employmentParticipation.no,
                },
              ],
            }),
          ],
        }),
      ],
    })
