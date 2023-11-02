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

  form: defineMessages({
    applicationName: {
      id: 'ehic.application:form.name',
      defaultMessage: 'Umsókn um Evrópska sjúkratryggingakortið',
      description: 'Application for European Health Insurance Card',
    },
    institutionName: {
      id: 'ehic.application:form.institutionName',
      defaultMessage: 'Sjúkratryggingar',
      description: 'Application for collaboration institution name',
    },
  }),

  introScreen: defineMessages({
    formName: {
      id: 'ehic.application:introScreen.form.name',
      defaultMessage: 'Evrópska sjúkratryggingakortið',
      description: 'Display name for application',
    },
    sectionLabel: {
      id: 'ehic.application:introScreen.label',
      defaultMessage: 'Upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:introScreen.title',
      defaultMessage: 'Upplýsingar um Evrópska sjúkratryggingakortið',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ehic.application:introScreen.description#markdown',
      defaultMessage:
        'Evrópska sjúkratryggingakortið veitir korthafa rétt til heilbrigðisþjónustu í öðrum EES löndum, og Sviss. Korthafi greiðir þá sama gjald fyrir heilbrigðisþjónustuna og þeir sem eru tryggðir í almannatryggingakerfi viðkomandi lands. Kortið gildir aðeins hjá opinberum heilbrigðisþjónustuveitendum, ekki á einkastofum.\n\nKortið gildir almennt í þrjú ár í senn en fimm ár fyrir elli- og örorkulífeyrisþega. Sækja má um nýtt kort þegar 6 mánuðir eru eftir af gildistíma núgildandi korts.',
      description: 'Description of what the ehic card is',
    },
  }),

  // Data collection
  data: defineMessages({
    sectionLabel: {
      id: 'ehic.application:data.section.label',
      defaultMessage: 'Gagnaöflun',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:data.name',
      defaultMessage: 'Gagnaöflun',
      description: 'Applicants for European Health Insurance Card',
    },
    dataCollectionNationalRegistryTitle: {
      id: 'ehic.application:data.national.registry.name',
      defaultMessage: 'Þjóðskrá Íslands',
      description: 'Title for NationalRegistry',
    },
    dataCollectionNationalRegistryDescription: {
      id: 'ehic.application:data.national.registry.description',
      defaultMessage:
        'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
      description: 'Description for data collection from NationalRegistry',
    },
    dataCollectionHealthInsuranceTitle: {
      id: 'ehic.application:data.health.insurance.name',
      defaultMessage: 'Sjúkratryggingar',
      description: 'Title for Health Insurance (Sjúkratryggingar Íslands)',
    },
    dataCollectionHealthInsuranceDescription: {
      id: 'ehic.application:data.health.insurance.description',
      defaultMessage:
        'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
      description:
        'Description for Health Insurance (Sjúkratryggingar Íslands)',
    },
    dataCollectionCheckboxLabel: {
      id: 'ehic.application:data.dataCollectionCheckboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað.',
      description: 'Data collection checkbox label',
    },
    dataCollectionButtonLabel: {
      id: 'ehic.application:data.dataCollectionButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Button label for retrieving data collection',
    },
    dataCollectionCompletedTitle: {
      id: 'ehic.application:data.dataCollectionCompletedTitle',
      defaultMessage: 'Gagnaöflun lokið',
      description: 'Data collection completed title',
    },
    dataCollectionCompletedDescription: {
      id: 'ehic.application:data.dataCollectionCompletedDescription',
      defaultMessage: 'Gagnaöflun tókst.',
      description: 'Data collection completed description',
    },
    checkboxError: {
      id: 'ehic.application:checkbox.error',
      defaultMessage: 'Vinsamlegast veldu að minnsta kosti einn valmöguleika',
      description: 'Error message for checkbox',
    },
  }),

  // No health insurance
  no: defineMessages({
    sectionLabel: {
      id: 'ehic.application:no.label',
      defaultMessage:
        'Því miður hefur þú ekki rétt á Evrópska Sjúkratryggingakortinu',
      description: 'Label for user is not insured',
    },
    sectionTitle: {
      id: 'ehic.application:no.description',
      defaultMessage:
        'Því miður er ekki heimild til að sækja um ES kort fyrir eftirfarandi einstaklinga.',
      description: 'Description for User or users are not insured',
    },
    sectionDescription: {
      id: 'ehic.application:no.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Einstaklingur er ekki sjúkratryggð/ur á Íslandi. \n* Einstaklingur er ekki með lögheimili á Íslandi. \n* Einstaklingur er ekki með ríkisborgararétt frá EES landi.\n\nEf þú telur þessi atriði ekki eiga við, vinsamlegast hafið samband við [ehic@sjukra.is](mailto:ehic@sjukra.is)',
      description:
        'Description of why user or users can not apply for the card',
    },
    sectionSubDescription: {
      id: 'ehic.application:no.sectionSubDescription',
      defaultMessage: ' Ekki heimild til að sækja um ES kort',
      description: 'Can not apply for card message',
    },
  }),

  // Plastic
  applicants: defineMessages({
    sectionLabel: {
      id: 'ehic.application:applicants.section.label',
      defaultMessage: 'Umsækjendur',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:applicants.name',
      defaultMessage: 'Umsækjendur',
      description: 'Applicants for European Health Insurance Card',
    },
    sectionDescription: {
      id: 'ehic.application:applicants.description',
      defaultMessage:
        'Haka þarf við hvern einstakling til þess að umsókn hans verði virk.',
      description: 'Section description',
    },
    sectionHasNoPlasticLabel: {
      id: 'ehic.application:applicants.sectionSubLabel',
      defaultMessage: 'Heimild til að sækja um ES kort',
      description: 'Button label for PDF step',
    },
    submitButtonLabel: {
      id: 'ehic.application:applicants.submitButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Button label for Plastic card step',
    },
  }),

  // PDF
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
      id: 'ehic.application:temp.description#markdown',
      defaultMessage:
        'þá kemur stuttur texti um notkun á bráðabirgðakorti vs plastkorti og svo getur þú niðurhalað PDF skjali með bráðabirgðakorti og það sendist í stafrænt pósthólf. Plast er betra og þetta dugar ekki jafn vel. Vinsamlegast hakaðu við þá aðila sem vilja fá bráða',
      description: 'Section description',
    },
    submitButtonLabel: {
      id: 'ehic.application:temp.submitButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Button label for PDF step',
    },
    sectionCanTitle: {
      id: 'ehic.application:temp.sectionCanTitle',
      defaultMessage:
        'Einstaklingar sem eiga ES kort í gildi og geta sótt um bráðabirgðakort',
      description: 'Title for users who can apply for PDF',
    },
    sectionHasPlasticLabel: {
      id: 'ehic.application:temp.sectionSubLabel',
      defaultMessage: 'Heimild til að sækja um bráðabirgðakort',
      description: 'Button label for PDF step',
    },
    sectionHasPDFLabel: {
      id: 'ehic.application:temp.sectionHasPDFLabel',
      defaultMessage:
        'Einstaklingar sem eiga bráðabirgðaskírteini í gildi í stafrænu pósthólfi',
      description: 'Label that indicates a user already has a PDF',
    },
    sectionPlasticExpiryDate: {
      id: 'ehic.application:temp.plasticExpiryDate',
      defaultMessage: 'Rennur út',
      description: 'Sublabel that states the expiry date of a plastic card',
    },
  }),

  // Review Screen
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
    sectionPersonsWhoWantPDFLabel: {
      id: 'ehic.application:review.sectionPersonsWhoWantPDFLabel.label',
      defaultMessage: 'Einstaklingar sem vilja fá tímabundið bráðabirgðakort',
      description: 'Form label for persons who want a temporary card',
    },
    sectionPDFDeliveryTitle: {
      id: 'ehic.application:review.sectionPDFDeliveryTitle',
      defaultMessage: 'Afhending',
      description: 'Form title for PDF delivery formfield',
    },
    sectionPDFDeliveryDescription: {
      id: 'ehic.application:review.sectionPDFDeliveryDescription',
      defaultMessage: 'Bráðabirgðakort sendist í stafrænt pósthólf island.is',
      description: 'Form description for PDF delivery formfield',
    },
    sectionDeliveryLabel: {
      id: 'ehic.application:review.sectionDeliveryLabel',
      defaultMessage: 'Afhending',
      description: 'Form label for delivery formfield',
    },
    sectionDeliveryDescription: {
      id: 'ehic.application:review.sectionDeliveryDescription',
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

  // Completed
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
    sectionInfoBulletSecondOne: {
      id: 'ehic.application:confirmation.section.infoBullet.second.one',
      defaultMessage: 'Kortið verður sent á',
      description: 'Second part one information sentence, in bullet list',
    },
    sectionInfoBulletSecondTwo: {
      id: 'ehic.application:confirmation.section.infoBullet.second.two',
      defaultMessage: 'og tekur 10-14 virka daga fyrir kortið að berast.',
      description: 'Second part two information sentence, in bullet list',
    },
    sectionInfoBulletThird: {
      id: 'ehic.application:confirmation.section.infoBullet.third',
      defaultMessage:
        'Bráðabirgðakortið hefur verið sent í stafræna pósthólfið þitt á island.is',
      description: 'Third information sentence, in bullet list',
    },
    sectionInfoBulletFour: {
      id: 'ehic.application:confirmation.section.infoBullet.four',
      defaultMessage:
        'Þú getur niðurhalað bráðabirgðakortinu hér að neðan. Við mælum með að prenta út skjalið.',
      description: 'Fourth information sentence, in bullet list',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'ehic.application:approved.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ehic.application:approved.section.description',
      defaultMessage:
        'Við munum fara yfir umsóknina og sendum á þig svör innan tíðar. Við verðum í sambandi ef okkur vantar frekari upplýsingar. ',
      description: 'Section title',
    },
  }),

  // Applicants already have plastic and PDF
  noApplicants: defineMessages({
    checkboxTitle: {
      id: 'ehic.application:noapplicants.checkbox.title',
      defaultMessage: 'Umsækjendur',
      description: 'Checkbox Title',
    },
    checkboxDescription: {
      id: 'ehic.application:noapplicants.checkbox.description',
      defaultMessage:
        'Einstaklingar sem eiga ES kort og bráðabirgðaskírteini í gildi í stafrænu pósthólfi',
      description: 'Checkbox description',
    },
  }),

  urls: defineMessages({
    allServices: {
      id: 'ehic.application:url.all',
      defaultMessage: 'https://island.is/s/stafraent-island/thjonustur',
      description: 'Url',
    },
    mailService: {
      id: 'ehic.application:url.mail',
      defaultMessage: '/s/stafraent-island/thjonustur/postholf',
      description: 'Url',
    },
    loginService: {
      id: 'ehic.application:url.login',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/innskraning-fyrir-alla',
      description: 'Url',
    },
    myPageService: {
      id: 'ehic.application:url.mypage',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/minar-sidur',
      description: 'Url',
    },
    certificateService: {
      id: 'ehic.application:url.certificate',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/skirteini',
      description: 'Url',
    },
    straumurService: {
      id: 'ehic.application:url.straumur',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/straumurinn',
      description: 'Url',
    },
    applyService: {
      id: 'ehic.application:url.apply',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umsoknarkerfi',
      description: 'Url',
    },
    authorityService: {
      id: 'ehic.application:url.authority',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umbodskerfi',
      description: 'Url',
    },
    webService: {
      id: 'ehic.application:url.web',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/vefur-stofnana',
      description: 'Url',
    },
    appService: {
      id: 'ehic.application:url.app',
      defaultMessage: '/https://island.iss/stafraent-island/thjonustur/app',
      description: 'Url',
    },
    islandService: {
      id: 'ehic.application:url.island',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/island-is',
      description: 'Url',
    },
  }),
}
