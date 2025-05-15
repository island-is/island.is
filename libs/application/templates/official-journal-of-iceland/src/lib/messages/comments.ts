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
  warnings: defineMessages({
    noCommentsTitle: {
      id: 'ojoi.application:comments.warnings.noComments',
      defaultMessage: 'Engar athugasemdir',
      description: 'No comments',
    },
    noCommentsMessage: {
      id: 'ojoi.application:comments.warnings.noCommentsMessage',
      defaultMessage: 'Engar athugasemdir eru skráðar á þessa innsendingu.',
      description: 'No comments message',
    },
    postCommentFailedTitle: {
      id: 'ojoi.application:comments.warnings.postCommentFailedTitle',
      defaultMessage: 'Ekki tókst að vista athugasemd',
      description: 'Post comment failed title',
    },
    postCommentFailedMessage: {
      id: 'ojoi.application:comments.warnings.postCommentFailedMessage',
      defaultMessage: 'Ekki tókst að vista athugasemd, reyndu aftur síðar.',
      description: 'Post comment failed message',
    },
  }),
  heading: defineMessages({
    externalComment: {
      id: 'ojoi.application:comments.heading.externalComment',
      defaultMessage: 'skráir skilaboð',
      description: 'External comment',
    },
    applicationComment: {
      id: 'ojoi.application:comments.heading.applicationComment',
      defaultMessage: 'gerir athugasemd',
      description: 'Application comment',
    },
  }),
  unknownUser: defineMessages({
    name: {
      id: 'ojoi.application:comments.unknownUser.name',
      defaultMessage: 'Óþekktur notandi',
      description: 'Unknown user name',
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
