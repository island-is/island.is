import { defineMessages } from 'react-intl'

export const conclusionMessages = defineMessages({
  title: {
    id: 'tra.application:conclusion.title',
    defaultMessage: 'Staðfesting',
    description: 'Conclusion title',
  },
  alertTitle: {
    id: 'tra.application:conclusion.alertTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Conclusion alert title',
  },
  alertMessage: {
    id: 'tra.application:conclusion.alertMessage',
    defaultMessage:
      'Umsókn um {terminationType} húsaleigusamnings hefur verið send inn til Húsnæðis og mannvirkja stofnunar.',
    description: 'Conclusion alert message',
  },
  alertMessageCancelation: {
    id: 'tra.application:conclusion.alertMessageCancelation',
    defaultMessage:
      'Umsókn um riftun húsaleigusamnings hefur verið send inn til Húsnæðis og mannvirkja stofnunar.',
    description: 'Conclusion alert message cancelation',
  },
  alertMessageTermination: {
    id: 'tra.application:conclusion.alertMessageTermination',
    defaultMessage:
      'Umsókn um uppsögn húsaleigusamnings hefur verið send inn til Húsnæðis og mannvirkja stofnunar.',
    description: 'Conclusion alert message termination',
  },
  multiFieldTitle: {
    id: 'tra.application:conclusion.multiFieldTitle',
    defaultMessage: 'Tilkynning móttekin!',
    description: 'Conclusion multi field title',
  },
  descriptionFieldDescription: {
    id: 'tra.application:conclusion.descriptionFieldDescription',
    defaultMessage:
      'Tilkynningin hefur verið móttekin og skráð í Leiguskrá HMS.',
    description: 'Conclusion description field description',
  },
})
