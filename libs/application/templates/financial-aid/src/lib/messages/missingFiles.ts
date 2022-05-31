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
  error: defineMessages({
    title: {
      id: 'fa.application:section.missingFiles.error.title',
      defaultMessage: 'Eitthvað fór úrskeiðis við sendingu gagnanna',
      description: 'Title of the error',
    },
    message: {
      id: 'fa.application:section.missingFiles.error.message#markdown',
      defaultMessage:
        'Þú getur reynt aftur síðar eða sent gögnin með tölvupósti á [{email}]({email}). Gættu þess að láta kennitölu þína fylgja með gögnunum ef þú sendir þau með tölvupósti.',
      description: 'Message of the error',
    },
  }),
  confirmation: defineMessages({
    title: {
      id: 'fa.application:section.missingFiles.confirmation.title',
      defaultMessage: 'Senda inn gögn',
      description: 'Title of the confirmation page',
    },
    subtitle: {
      id: 'fa.application:section.missingFiles.confirmation.subtitle',
      defaultMessage: 'Eftirfarandi gögn hafa verið send inn',
      description: 'Subtitle of the confirmation page',
    },
    linkStatusPage: {
      id: 'fa.application:section.missingFiles.confirmation.linkStatusPage',
      defaultMessage: 'Til baka á forsíðu',
      description: 'Text of link to status page',
    },
    commentTitle: {
      id: 'fa.application:section.missingFiles.confirmation.commentTitle',
      defaultMessage: 'Athugasemd með gögnum',
      description: 'Text of the comment box',
    },
    file: {
      id: 'fa.application:section.missingFiles.confirmation.file',
      defaultMessage: 'Skjal',
      description: 'Text for the file title',
    },
  }),
}
