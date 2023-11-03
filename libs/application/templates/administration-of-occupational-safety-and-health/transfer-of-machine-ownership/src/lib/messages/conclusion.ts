import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'aosah.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'aosah.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    approvedTitle: {
      id: 'aosah.application:conclusion.general.approvedTitle',
      defaultMessage: 'Eigendaskipti samþykkt',
      description: 'Approved title of conclusion screen',
    },
    rejectedTitle: {
      id: 'aosah.application:conclusion.general.rejectedTitle',
      defaultMessage: 'Umsókn afturkölluð',
      description: 'Rejected title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertMessage: {
      id: 'aosah.application:conclusion.default.alertMessage',
      defaultMessage: 'Skráning móttekin!',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'aosah.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'aosah.application:conclusion.default.accordionText',
      defaultMessage: `Nú þarf kaupandi að samþykkja skráninguna (og meðeigendur og umráðamenn 
        ef það á við). Það þarf að gerast innan 7 daga. Að því loknu verða eigendaskiptin skráð. 
        Ef því verður ekki lokið fyrir þann tíma verður eigendaskiptunum hafnað og seljandi 
        fær skráningargjaldið endurgreitt inn á kortið sem greitt var með.`,
      description: 'Conclusion seller accordion text',
    },
    goToStatusButton: {
      id: 'aosah.application:conclusion.default.goToStatusButton',
      defaultMessage: 'Skoða stöðu',
      description: 'Button on conclusion screen',
    },
    shareLink: {
      id: 'aosah.application:conclusion.default.shareLink',
      defaultMessage: 'Hlekkur á umsóknina',
      description: 'Share link button on conclusion screen',
    },
    copyLink: {
      id: 'aosah.application:conclusion.default.copyLink',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link label on conclusion screen',
    },
  }),
  review: defineMessages({
    accordionText: {
      id: 'aosah.application:conclusion.review.accordionText',
      defaultMessage: `Eigendaskiptin verða skráð þegar allir hafa samþykkt. Ef því verður ekki lokið innan 7 daga frá gerð umsóknar verður eigendakiptunum hafnað og seljandi fær skráningargjaldið endurgreitt inn á kortið sem greitt var með.`,
      description: 'Conclusion review accordion text',
    },
  }),
  approved: defineMessages({
    accordionText: {
      id: 'aosah.application:conclusion.approved.accordionText',
      defaultMessage: `Nú hafa allir aðilar samþykkt og eigendaskiptin verið skráð hjá Vinnueftirlitinu.`,
      description: 'Conclusion approved accordion text',
    },
  }),
  rejected: defineMessages({
    alertMessage: {
      id: 'aosah.application:conclusion.rejected.alertMessage',
      defaultMessage: 'Tilkynning um eigendaskipti - Umsókn afturkölluð!',
      description: 'Conclusion rejected alert message',
    },
    firstText: {
      id: 'aosah.application:conclusion.rejected.firstText',
      defaultMessage: `Beiðni um eigendaskipti á ökutækinu {plate} hefur verið afturkölluð þar sem eftirfarandi aðili hafnaði:`,
      description: 'Conclusion rejected first text',
    },
    secondText: {
      id: 'aosah.application:conclusion.rejected.secondText',
      defaultMessage: `Til þess að skrá eigendaskiptin rafrænt verður að byrja ferlið upp á nýtt á umsóknarvef island.is, ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests.`,
      description: 'Conclusion rejected second text',
    },
    thirdText: {
      id: 'aosah.application:conclusion.rejected.thirdText',
      defaultMessage: `Vinsamlegast hafið samband við Þjónustuver Samgöngustofu, afgreidsla@samgongustofa.is, ef nánari upplýsinga er þörf.`,
      description: 'Conclusion rejected third text',
    },
    buyer: {
      id: 'aosah.application:conclusion.rejected.buyer',
      defaultMessage: `kaupandi`,
      description: 'Buyer label',
    },
    buyerCoOwner: {
      id: 'aosah.application:conclusion.rejected.buyerCoOwner',
      defaultMessage: `meðeigandi kaupanda`,
      description: 'Buyer coowner label',
    },
    sellerCoOwner: {
      id: 'aosah.application:conclusion.rejected.sellerCoOwner',
      defaultMessage: `meðeigandi seljanda`,
      description: 'Seller coowner label',
    },
    operator: {
      id: 'aosah.application:conclusion.rejected.operator',
      defaultMessage: `umráðamaður kaupanda`,
      description: 'Operator label',
    },
    startNewApplication: {
      id: 'aosah.application:conclusion.rejected.startNewApplication',
      defaultMessage: `Hefja nýja umsókn`,
      description: 'Start new application label',
    },
  }),
}
