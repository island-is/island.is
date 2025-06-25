import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTitleField,
  YES,
  NO,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'

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
                  value: YES,
                  label: disabilityPensionFormMessage.employmentParticipation.yes,
                },
                {
                  value: NO,
                  label: disabilityPensionFormMessage.employmentParticipation.no,
                },
                {
                  value: 'dontKnow',
                  label: disabilityPensionFormMessage.employmentParticipation.dontKnow,
                },
              ],
            }),
            buildTitleField({
              title: disabilityPensionFormMessage.employmentParticipation.continuedWorkTitle,
              titleVariant: 'h4',
              marginTop: 'containerGutter',
              marginBottom: 'p2',
            }),
            buildRadioField({
              id: `${employmentParticipationRoute}.continuedWork`,
              title: disabilityPensionFormMessage.employmentParticipation.continuedWorkQuestion,
              width: 'half',
              backgroundColor: 'white',
              required: true,
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