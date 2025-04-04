import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { applicationStatus } from '../../lib/messages'
import { getUserInfo } from '../../utils/getUserInfo'

export const applicationStatusSection = buildSection({
  id: 'applicationStatusSection',
  title: '',
  children: [
    buildMultiField({
      id: 'applicationStatusSection.multiField',
      title: applicationStatus.general.title,
      description: applicationStatus.general.description,
      children: [
        buildActionCardListField({
          id: 'approvalActionCard',
          doesNotRequireAnswer: true,
          marginTop: 2,
          title: '',
          items: (application, lang, userNationalId) => {
            const userInfo = getUserInfo(application.answers, userNationalId)
            return [
              {
                heading: applicationStatus.labels.actionCardTitleAssignee,
                tag: {
                  label: applicationStatus.labels.actionCardTag,
                  outlined: false,
                  variant: 'purple',
                },
                text: {
                  ...applicationStatus.labels.actionCardMessageAssignee,
                  values: {
                    value: userInfo ? userInfo.workMachine.join(', ') : '',
                  },
                },
              },
            ]
          },
        }),
      ],
    }),
  ],
})
