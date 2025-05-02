import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
  getValueViaPath,
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
          items: (application, _lang, userNationalId) => {
            const userInfo = getUserInfo(application.answers, userNationalId)
            const approved =
              getValueViaPath<string[]>(application.answers, 'approved') ?? []
            const isApproved = approved.includes(userNationalId)
            return [
              {
                heading: applicationStatus.labels.actionCardTitleAssignee,
                tag: {
                  label: isApproved
                    ? applicationStatus.labels.actionCardTagApproved
                    : applicationStatus.labels.actionCardTag,
                  outlined: false,
                  variant: isApproved ? 'mint' : 'purple',
                },
                text: {
                  ...applicationStatus.labels.actionCardMessageAssignee,
                  values: {
                    value: userInfo
                      ? userInfo.workMachine
                          ?.map((x) => x.split(' ')[0])
                          .join(', ')
                      : '',
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
