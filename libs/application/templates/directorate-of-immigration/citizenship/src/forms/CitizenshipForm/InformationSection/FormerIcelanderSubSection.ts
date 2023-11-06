import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  NO,
  buildRadioField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer, YES } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'

export const FormerIcelanderSubSection = buildSubSection({
  id: 'formerIcelander',
  title: information.labels.formerIcelander.subSectionTitle,
  children: [
    buildMultiField({
      id: 'formerIcelanderMultiField',
      title: information.labels.formerIcelander.pageTitle,
      description: information.labels.formerIcelander.description,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship
        return answers?.parentInformation?.hasValidParents === NO
      },
      children: [
        buildRadioField({
          id: 'formerIcelander',
          title: '',
          description: '',
          width: 'half',
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            { value: NO, label: information.labels.radioButtons.radioOptionNo },
          ],
        }),
        buildAlertMessageField({
          id: 'formerIcelanderAlert',
          title: information.labels.formerIcelander.alertTitle,
          alertType: 'error',
          message: information.labels.formerIcelander.alertDescription,
          condition: (answer: Answer) => {
            const answers = answer as Citizenship
            return answers?.formerIcelander === NO
          },
          links: [
            {
              title: information.labels.formerIcelander.alertLinkTitle,
              url: information.labels.formerIcelander.alertLinkUrl,
              isExternal: true,
            },
          ],
        }),
        // buildCustomField({
        //   id: 'formerIcelander',
        //   title: '',
        //   description: '',
        //   component: 'FormerIcelander',
        // }),
      ],
    }),
  ],
})
