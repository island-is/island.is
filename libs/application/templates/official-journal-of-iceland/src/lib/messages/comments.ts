import { defineMessages } from 'react-intl'

export const comments = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:comments.general.title',
      defaultMessage: 'Athugasemdir',
      description: 'Title of comments form',
    },
    intro: {
      id: 'ojoi.application:comments.general.intro',
      defaultMessage:
        'Hér sérðu athugasemdir ritstjórn sem þarfnast yfirferðar.',
      description: 'Description of comments form',
    },
    section: {
      id: 'ojoi.application:comments.general.section',
      defaultMessage: 'Athugasemdir',
      description: 'Title of comments section',
    },
  }),
  dates: defineMessages({
    today: {
      id: 'ojoi.application:comments.dates.today',
      defaultMessage: 'Í dag',
      description: 'Today',
    },
    yesterday: {
      id: 'ojoi.application:comments.dates.yesterday',
      defaultMessage: 'Í gær',
      description: 'Yesterday',
    },
    xDaysAgo: {
      id: 'ojoi.application:comments.dates.xDaysAgo',
      defaultMessage: 'f. {days} dögum',
      description: 'X days ago',
    },
  }),
  inputs: {
    addCommentTextarea: defineMessages({
      label: {
        id: 'ojoi.application:comments.inputs.addCommentTextarea.label',
        defaultMessage: 'Skilaboð til ritstjórnar',
        description: 'Add comment label',
      },
      placeholder: {
        id: 'ojoi.application:comments.inputs.addCommentTextarea.placeholder',
        defaultMessage: 'Bættu við athugasemd',
        description: 'Add comment placeholder',
      },
    }),
    addCommentButton: defineMessages({
      label: {
        id: 'ojoi.application:comments.inputs.addCommentButton.label',
        defaultMessage: 'Vista athugasemd',
        description: 'Add comment button',
      },
    }),
  },
}
