import { defineMessages } from 'react-intl'

export const completed = defineMessages({
  sectionName: {
    id: 'ra.application:completedForm.sectionName',
    defaultMessage: 'Samningur undirritaður',
    description: 'Name of the completed section',
  },
  pageTitle: {
    id: 'ra.application:completedForm.pageTitle',
    defaultMessage: 'Samningur undirritaður',
    description: 'Completed page title',
  },
  alertMessageSuccessTitle: {
    id: 'ra.application:completedForm.alertMessageSuccess',
    defaultMessage: 'Samningurinn hefur verið skráður í leiguskrá HMS',
    description:
      'Success message title when the agreement has been sent HMS rental registry',
  },
  alertMessageSuccessDescription: {
    id: 'ra.application:completedForm.alertMessageSuccessDescription',
    defaultMessage: ' ',
    description:
      'Success message desctioption when the agreement has been sent HMS rental registry',
  },
  alertMessageErrorTitle: {
    id: 'ra.application:completedForm.alertMessageFailed',
    defaultMessage: 'Ekki tókst að senda samning í leiguskrá',
    description: 'Error message when failed',
  },
  pageInfoTitle: {
    id: 'ra.application:completedForm.pageInfoTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Title for the completed page info',
  },
  pageInfoBullet1: {
    id: 'ra.application:completedForm.pageInfoBullet1#markdown',
    defaultMessage: '- Umsóknin er nú skráð í leiguskrá HMS.',
    description:
      'Description for what comes next in the process, furst bullet point',
  },
  pageInfoBullet2: {
    id: 'ra.application:completedForm.pageInfoBullet2#markdown',
    defaultMessage: '- Þú getur nálgast samninginn þinn á Mínum síðum.',
    description:
      'Description for what comes next in the process, second bullet point',
  },
})
