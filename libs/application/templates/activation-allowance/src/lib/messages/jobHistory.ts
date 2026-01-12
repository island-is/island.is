import { defineMessages } from 'react-intl'

export const jobHistory = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:jobHistory.general.sectionTitle',
      defaultMessage: 'Atvinnusaga',
      description: 'Job history section title',
    },
    pageTitle: {
      id: 'aa.application:jobHistory.general.pageTitle',
      defaultMessage: 'Atvinnusaga þín',
      description: `Job histry page title`,
    },
    description: {
      id: 'aa.application:jobHistory.general.description',
      defaultMessage:
        'Til þess að við getum aðstoðað þig við að komast í starf er gott fyrir okkur að vita hvort og hvernig störf þú hefur unnið áður. Athugaðu að þessar upplýsingar eru ekki skylda, en það er hjálplegt fyrir Vinnumálastofnun í framhaldinu.',
      description: `Job history description`,
    },
  }),
  labels: defineMessages({
    jobTitle: {
      id: 'aa.application:jobHistory.labels.jobTitle',
      defaultMessage: 'Starf',
      description: 'Job title label',
    },
    companyName: {
      id: 'aa.application:jobHistory.labels.companyName',
      defaultMessage: 'Nafn fyrirtækis',
      description: 'Company name label',
    },
    jobName: {
      id: 'aa.application:jobHistory.labels.jobName',
      defaultMessage: 'Starfsheiti',
      description: 'Job name label',
    },
    startDate: {
      id: 'aa.application:jobHistory.labels.startDate',
      defaultMessage: 'Hóf störf',
      description: 'Start date label',
    },
    endDate: {
      id: 'aa.application:jobHistory.labels.endDate',
      defaultMessage: 'Lauk starfi',
      description: 'End date label',
    },
    addNewButton: {
      id: 'aa.application:jobHistory.labels.addNewButton',
      defaultMessage: 'Bæta við starfi',
      description: 'Add new button label',
    },
  }),
}
