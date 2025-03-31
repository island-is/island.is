import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'vmst.ub.application:name',
    defaultMessage: 'Umsókn um atvinnuleysisbætur',
    description: `Application's name`,
  },
  institutionName: {
    id: 'vmst.ub.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'vmst.ub.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.ub.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'vmst.ub.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  actionCardInReview: {
    id: 'vmst.ub.application:actionCardInReview',
    defaultMessage: 'Í vinnslu hjá stofnun',
    description:
      'Description of application state/status when application is completed',
  },
  actionCardCompleted: {
    id: 'vmst.ub.application:actionCardCompleted',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is completed',
  },
  firstSectionTitle: {
    id: 'vmst.ub.application:firstSectionTitle',
    defaultMessage: 'Fyrri hluti: Þinn réttur til atvinnuleysisbóta',
    description: 'Title of first section page',
  },
  firstSectionDescription: {
    id: 'vmst.ub.application:firstSectionDescription',
    defaultMessage:
      'Eftirfarandi kafli snýr að því að safna upplýsingum um núverandi eða fyrrverandi atvinnustöðu þína svo hægt sé að reikna út hvort eða hve miklar atvinnuleysisbætur þú hefur rétt á.',
    description: 'Description of first section page',
  },
})
