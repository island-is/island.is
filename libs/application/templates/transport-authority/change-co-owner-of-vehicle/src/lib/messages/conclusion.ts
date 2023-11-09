import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'ta.ccov.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'ta.ccov.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    approvedTitle: {
      id: 'ta.ccov.application:conclusion.general.approvedTitle',
      defaultMessage: 'Breyting meðeiganda á ökutæki samþykkt',
      description: 'Approved title of conclusion screen',
    },
    rejectedTitle: {
      id: 'ta.ccov.application:conclusion.general.rejectedTitle',
      defaultMessage: 'Umsókn afturkölluð',
      description: 'Rejected title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertTitle: {
      id: 'ta.ccov.application:conclusion.default.alertTitle',
      defaultMessage: 'Skráning þín á meðeiganda ökutækis hefur verið staðfest',
      description: 'Conclusion seller alert message',
    },
    alertMessage: {
      id: 'ta.ccov.application:conclusion.default.alertMessage',
      defaultMessage: 'Þú getur nú nálgast skráninguna inni á mínum síðum',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'ta.ccov.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'ta.ccov.application:conclusion.default.accordionText',
      defaultMessage: `Nú þurfa meðeigendur að samþykkja skráninguna. 
        Það þarf að gerast innan 7 daga. Að því loknu verður skráning meðeiganda af/á ökutæki skráð. 
        Ef því verður ekki lokið fyrir þann tíma verður breyting meðeiganda á ökutæki hafnað og eigandi 
        fær skráningargjaldið endurgreitt inn á kortið sem greitt var með.`,
      description: 'Conclusion seller accordion text',
    },
    goToStatusButton: {
      id: 'ta.ccov.application:conclusion.default.goToStatusButton',
      defaultMessage: 'Skoða stöðu',
      description: 'Button on conclusion screen',
    },
    shareLink: {
      id: 'ta.ccov.application:conclusion.default.shareLink',
      defaultMessage: 'Hlekkur á umsóknina',
      description: 'Share link button on conclusion screen',
    },
    copyLink: {
      id: 'ta.ccov.application:conclusion.default.copyLink',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link label on conclusion screen',
    },
    showOverviewLink: {
      id: 'ta.ccov.application:conclusion.default.showOverviewLink',
      defaultMessage: 'Staða tilkynningar',
      description: 'Show overview link title',
    },
  }),
  review: defineMessages({
    accordionText: {
      id: 'ta.ccov.application:conclusion.review.accordionText',
      defaultMessage: `Skráning meðeiganda af/á ökutæki verður skráð þegar allir hafa samþykkt. Ef því verður ekki lokið innan 7 daga frá gerð umsóknar verður skráning umráðamanns af/á ökutæki hafnað og eigandi fær skráningargjaldið endurgreitt inn á kortið sem greitt var með.`,
      description: 'Conclusion review accordion text',
    },
  }),
  approved: defineMessages({
    accordionText: {
      id: 'ta.ccov.application:conclusion.approved.accordionText',
      defaultMessage: `Nú hafa allir aðilar samþykkt og skráning meðeiganda af/á ökutæki verið skráð hjá Samgöngustofu.`,
      description: 'Conclusion approved accordion text',
    },
  }),
  rejected: defineMessages({
    alertMessage: {
      id: 'ta.ccov.application:conclusion.rejected.alertMessage',
      defaultMessage: 'Skráning meðeiganda - Umsókn afturkölluð!',
      description: 'Conclusion rejected alert message',
    },
    firstText: {
      id: 'ta.ccov.application:conclusion.rejected.firstText',
      defaultMessage: `Beiðni um bæta við/fella niður meðeiganda á {plate} hefur verið afturkölluð þar sem eftirfarandi aðili hafnaði:`,
      description: 'Conclusion rejected first text',
    },
    secondText: {
      id: 'ta.ccov.application:conclusion.rejected.secondText',
      defaultMessage: `Til þess að bæta við meðeiganda rafrænt verður að byrja ferlið upp á nýtt á umsóknarvef island.is, ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests.`,
      description: 'Conclusion rejected second text',
    },
    thirdText: {
      id: 'ta.ccov.application:conclusion.rejected.thirdText',
      defaultMessage: `Vinsamlegast hafið samband við Þjónustuver Samgöngustofu, afgreidsla@samgongustofa.is, ef nánari upplýsinga er þörf.`,
      description: 'Conclusion rejected third text',
    },
    coOwner: {
      id: 'ta.ccov.application:conclusion.rejected.buyerCoOwner',
      defaultMessage: `meðeigandi`,
      description: 'Buyer coowner label',
    },
    startNewApplication: {
      id: 'ta.ccov.application:conclusion.rejected.startNewApplication',
      defaultMessage: `Hefja nýja umsókn`,
      description: 'Start new application label',
    },
  }),
}
