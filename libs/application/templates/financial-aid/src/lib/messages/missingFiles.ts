import { defineMessages } from 'react-intl'

export const missingFiles = {
  general: defineMessages({
    pageTitle: {
      id: 'fa.application:section.missingFiles.general.pageTitle',
      defaultMessage: 'Senda inn gögn',
      description: 'Missing files page title',
    },
    description: {
      id: 'fa.application:section.missingFiles.general.description',
      defaultMessage:
        'Hér getur þú sent okkur gögn ef vantar svo hægt sé að vinna þína umsókn.',
      description: 'Missing files intro text',
    },
    submit: {
      id: 'fa.application:section.missingFiles.general.submit',
      defaultMessage: 'Senda gögn',
      description: 'Missing files submit text',
    },
  }),
  alert: defineMessages({
    title: {
      id: 'fa.application:section.missingFiles.alert.title',
      defaultMessage: 'Athugasemd frá vinnsluaðila',
      description: 'Title of the alert box',
    },
    message: {
      id: 'fa.application:section.missingFiles.alert.message',
      defaultMessage: '„Til að klára umsóknina verður þú að senda {comment}.“',
      description: 'Message of the alert box',
    },
  }),
  comment: defineMessages({
    title: {
      id: 'fa.application:section.missingFiles.comment.title',
      defaultMessage: 'Viltu láta athugasemd fylgja með gögnunum?',
      description: 'Title of comment section',
    },
    inputTitle: {
      id: 'fa.application:section.missingFiles.comment.inputTitle',
      defaultMessage: 'Athugasemd',
      description: 'Title of the input box',
    },
    inputPlaceholder: {
      id: 'fa.application:section.missingFiles.comment.inputPlaceholder',
      defaultMessage: 'Skrifaðu hér',
      description: 'Title of the input box',
    },
  }),
}
