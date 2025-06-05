import { defineMessages } from 'react-intl'

export const shared = {
  application: defineMessages({
    name: {
      id: 'aosh.pe.application:shared.application.name',
      defaultMessage: 'Skráning í verkleg próf',
      description: `Application's name`,
    },
    institutionName: {
      id: 'aosh.pe.application:shared.application.institutionName',
      defaultMessage: 'Vinnueftirlitið',
      description: `Institution's name`,
    },
    actionCardPrerequisites: {
      id: 'aosh.pe.application:shared.application.actionCardPrerequisites',
      defaultMessage: 'Gagnaöflun',
      description:
        'Description of application state/status when the application is in prerequisites',
    },
    actionCardDone: {
      id: 'aosh.pe.application:shared.application.actionCardDone',
      defaultMessage: 'Afgreidd',
      description:
        'Description of application state/status when application is done',
    },
    actionCardDraft: {
      id: 'aosh.pe.application:shared.application.actionCardDraft',
      defaultMessage: 'Í vinnslu',
      description:
        'Description of application state/status when the application is in progress',
    },
    prerequisiteTabTitle: {
      id: 'aosh.pe.application:shared.application.prerequisiteTabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Browser tab title for prerequisite section',
    },
    submissionErrorTitle: {
      id: 'aosh.pe.application:submissionErrorTitle',
      defaultMessage: 'Villa í umsókn',
      description: 'Submission error title',
    },
    submissionError: {
      id: 'aosh.pe.application:submissionError',
      defaultMessage:
        'Ekki tókst að skrá verkleg próf, vinsamlegast reynið síðar',
      description: 'Submission error description',
    },
    missingData: {
      id: 'aosh.pe.application:missingData',
      defaultMessage:
        'Gögn vantar í umsókn, athugaðu hvort allt hefur verið fyllt út, reyndu aftur síðar eða hafðu samband við þjónustuaðila',
      description: 'Submission error description',
    },
    chargeCodeMissing: {
      id: 'aosh.pe.application:chargeCodeMissing',
      defaultMessage:
        'Greiðslukóði ekki til staðar, vinsamlegar reyndu aftur síðar',
      description: 'Submission error description',
    },
  }),
  labels: defineMessages({
    ssn: {
      id: 'aosh.pe.application:shared.labels.ssn',
      defaultMessage: 'Kennitala',
      description: `Label for the applicant's social security number`,
    },
    name: {
      id: 'aosh.pe.application:shared.labels.name',
      defaultMessage: 'Nafn',
      description: `Label for the applicant's name`,
    },
    email: {
      id: 'aosh.pe.application:shared.labels.email',
      defaultMessage: 'Netfang',
      description: `Label for the applicant's email`,
    },
    phone: {
      id: 'aosh.pe.application:shared.labels.phone',
      defaultMessage: 'Símanúmer',
      description: `Label for the applicant's mobile phone number`,
    },
    postalCode: {
      id: 'aosh.pe.application:shared.labels.postalCode',
      defaultMessage: 'Póstfang',
      description: `Label for postcode input`,
    },
    address: {
      id: 'aosh.pe.application:shared.labels.address',
      defaultMessage: 'Prófstaður / Heimilisfang',
      description: 'Label for address of exam',
    },
  }),
}
