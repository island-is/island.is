import { defineMessages } from 'react-intl'

export const europeanHealthInsuranceCardApplicationMessages = {
  application: defineMessages({
    applicationName: {
      id: 'ehic.application:application.name',
      defaultMessage: 'Umsókn um Evrópska sjúkratryggingakortið',
      description: 'Application for European Health Insurance Card',
    },
    institutionName: {
      id: 'ehic.application:application.institutionName',
      defaultMessage: 'Sjúkratryggingar Íslands',
      description: 'Application for collaboration institution name',
    },
  }),

  introScreen: defineMessages({
    formName: {
      id: 'ehic.application:form.name',
      defaultMessage: 'Evrópska sjúkratryggingakortið',
      description: 'Display name for application',
    },
    sectionLabel: {
      id: 'ehic.application:applicant.section.label',
      defaultMessage: 'Upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:applicant.section.title',
      defaultMessage: 'Evrópska sjúkratryggingakortið',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ehic.application:applicant.section.description',
      defaultMessage:
        'Kostir þess að hafa plastskírteinið meðferðis erlendi, kortið er gefið út x ára og ekki hægt að endurnýja ef glatast fyrr en eftir 6 mánuði. Plastkort þýir að á opinberum sjúkrahúsum þarftu ekki að borga.',
      description: 'Section description',
    },
  }),

  applicants: defineMessages({
    sectionLabel: {
      id: 'ehic.application:applicant.section.label',
      defaultMessage: 'Umsækjendur',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:application.name',
      defaultMessage: 'Umsækjendur',
      description: 'Applicants for European Health Insurance Card',
    },
    sectionDescription: {
      id: 'ehic.application:application.institutionName',
      defaultMessage:
        'Haka þarf við hvern einstakling til þess að umsókn hans verði virk.',
      description: 'Section description',
    },
  }),

  temp: defineMessages({
    sectionLabel: {
      id: 'ehic.application:temp.section.label',
      defaultMessage: 'Bráðabirgðakort',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:temp.name',
      defaultMessage: 'Viltu sækja um tímabundið bráðabirgðakort',
      description: 'Applicants for European Health Insurance Card',
    },
    sectionDescription: {
      id: 'ehic.application:temp.institutionName',
      defaultMessage:
        'þá kemur stuttur texti um notkun á bráðabirgðakorti vs plastkorti og svo getur þú niðurhalað PDF skjali með bráðabirgðakorti og það sendist í stafrænt pósthólf. Plast er betra og þetta dugar ekki jafn vel. Vinsamlegast hakaðu við þá aðila sem vilja fá bráða',
      description: 'Section description',
    },
  }),

  review: defineMessages({
    sectionLabel: {
      id: 'ehic.application:review.section.label',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:review.section.title',
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Section title',
    },
    sectionReviewTitle: {
      id: 'ehic.application:review.sectionReview.title',
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Section title',
    },
    sectionReviewDescription: {
      id: 'ehic.application:review.sectionReview.description',
      defaultMessage:
        'Vinsamlegast yfirfarið neðangreindar upplýsingar fyrir umsókn um Evrópskt sjúkratryggingakot',
      description: 'Section description',
    },
    sectionPersonsLabel: {
      id: 'ehic.application:review.name.label',
      defaultMessage: 'Einstaklingar',
      description: 'Form label for persons name formfield',
    },
    sectionDeliveryLabel: {
      id: 'ehic.application:review.phone.label',
      defaultMessage: 'Afhending',
      description: 'Form label for delivery formfield',
    },
    sectionDeliveryDescription: {
      id: 'ehic.application:review.phone.label',
      defaultMessage:
        'Kortið verður sent á lögheimili umsækjanda og tekur 10-14 virka daga fyrir kortið að berast.',
      description: 'Form description for delivery formfield',
    },
    sectionAddressLabel: {
      id: 'ehic.application:review.email.label',
      defaultMessage: 'Skráð lögheimili',
      description: 'Form label for address formfield',
    },
    submitButtonLabel: {
      id: 'ehic.application:review.submitButtonLabel',
      defaultMessage: 'Staðfesta Umsókn',
      description: 'Button label for submitting application',
    },
  }),

  confirmation: defineMessages({
    sectionLabel: {
      id: 'ehic.application:confirmation.section.label',
      defaultMessage: 'Umsókn staðfest',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:confirmation.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionInfoBulletFirst: {
      id: 'ehic.application:confirmation.section.infoBullet.first',
      defaultMessage: 'Umsóknin er formlega móttekin.',
      description: 'First information sentence, in bullet list',
    },
    sectionInfoBulletSecond: {
      id: 'ehic.application:confirmation.section.infoBullet.second',
      defaultMessage:
        'Kortið verður sent á Grundarstíg 12 umsækjanda og tekur 10-14 virka daga fyrir kortið að berast.',
      description: 'Second information sentence, in bullet list',
    },
    sectionInfoBulletThird: {
      id: 'ia.application:confirmation.section.infoBullet.third',
      defaultMessage:
        'Ef ES kort berst ekki fyrir upphaf ferðar, þá er hægt að niðurhala bráðabirgðaskírteinið hér',
      description: 'Third information sentence, in bullet list',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'ia.application:approved.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:approved.section.description',
      defaultMessage:
        'Við munum fara yfir umsóknina og sendum á þig svör innan tíðar. Við verðum í sambandi ef okkur vantar frekari upplýsingar. ',
      description: 'Section title',
    },
  }),

  urls: defineMessages({
    allServices: {
      id: 'ia.application:url.all',
      defaultMessage: 'https://island.is/s/stafraent-island/thjonustur',
      description: 'Url',
    },
    mailService: {
      id: 'ia.application:url.mail',
      defaultMessage: '/s/stafraent-island/thjonustur/postholf',
      description: 'Url',
    },
    loginService: {
      id: 'ia.application:url.login',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/innskraning-fyrir-alla',
      description: 'Url',
    },
    myPageService: {
      id: 'ia.application:url.mypage',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/minar-sidur',
      description: 'Url',
    },
    certificateService: {
      id: 'ia.application:url.certificate',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/skirteini',
      description: 'Url',
    },
    straumurService: {
      id: 'ia.application:url.straumur',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/straumurinn',
      description: 'Url',
    },
    applyService: {
      id: 'ia.application:url.apply',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umsoknarkerfi',
      description: 'Url',
    },
    authorityService: {
      id: 'ia.application:url.authority',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umbodskerfi',
      description: 'Url',
    },
    webService: {
      id: 'ia.application:url.web',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/vefur-stofnana',
      description: 'Url',
    },
    appService: {
      id: 'ia.application:url.app',
      defaultMessage: '/https://island.iss/stafraent-island/thjonustur/app',
      description: 'Url',
    },
    islandService: {
      id: 'ia.application:url.island',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/island-is',
      description: 'Url',
    },
  }),
}
