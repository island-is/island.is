import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ra.application:application.name',
    defaultMessage: 'Leigusamningur',
    description: `Name of rental agreement application`,
  },
  institutionName: {
    id: 'ra.application:application.institutionName',
    defaultMessage: 'Húsnæðis- og mannvirkjastofnun',
    description: `Name of institution`,
  },
  housingSectionName: {
    id: 'ra.application:application.housingSectionName',
    defaultMessage: 'Húsnæðið',
    description: `Name of housing section`,
  },
  rentalPeriodSectionName: {
    id: 'ra.application:application.rentalPeriodSectionName',
    defaultMessage: 'Tímabil og verð',
    description: `Name of rental period section`,
  },
  goToOverviewButton: {
    id: 'ra.application:application.sendToOverviewButton',
    defaultMessage: 'Senda í yfirlestur',
    description: `Button text for send overview`,
  },
  backToOverviewButton: {
    id: 'ra.application:application.backToOverviewButton',
    defaultMessage: 'Til baka/breyta samningi',
    description: `Button text for going back to overview`,
  },
  goToSigningButton: {
    id: 'ra.application:application.goToSigningButton',
    defaultMessage: 'Senda í undirritun',
    description: `Button text for going to signing`,
  },
  approve: {
    id: 'ra.application:application.approve',
    defaultMessage: 'Samþykkja',
    description: `Button text for approving`,
  },
})

export const prerequisites = {
  intro: defineMessages({
    sectionTitle: {
      id: 'ra.application:prerequisites.intro.sectionTitle',
      defaultMessage: 'Forsendur',
      description: 'Section title for intro',
    },
    subSectionTitle: {
      id: 'ra.application:prerequisites.intro.subSectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Subsection title for intro',
    },
    pageTitle: {
      id: 'ra.application:prerequisites.intro.pageTitle',
      defaultMessage: 'Þú ert að fara að gera rafrænan húsaleigusamning',
      description: 'Page title for intro',
    },
    text: {
      id: 'ra.application:prerequisites.intro.text',
      defaultMessage:
        'Mikilvægt er að hafa í huga að í samningnum þurfa að koma fram öll þau atriði sem aðilar samningsins eru sammála um og skipta máli við skilgreiningar og skýringar á því um hvað samningurinn snýst.',
      description: 'Introductory text about the application',
    },
    bullets: {
      id: 'ra.application:prerequisites.intro.bullets#markdown',
      defaultMessage:
        '- Leigusamningur er skráður í Leiguskrá HMS þegar allir aðilar samningsins hafa undirritað rafrænt. \n- Skráning leigusamnings í Leiguskrá HMS er ein forsenda þess að leigjandi geti fengið greiddar húsnæðisbætur. \n- Hægt er að sækja um húsnæðisbætur samhliða skráningu á leigusamningnum og því þinglýsing óþörf. \n- Með rafrænni skráningu eru vottar óþarfi. \n- Staðfesting á brunavörnum og ástandi húsnæðis er hluti af leigusamningnum',
      description: 'First bullet point about the application',
    },
  }),

  externalData: defineMessages({
    sectionTitle: {
      id: 'ra.application:prerequisites.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Section title for external data',
    },
    pageTitle: {
      id: 'ra.application:prerequisites.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Page title for external data',
    },
    subTitle: {
      id: 'ra.application:prerequisites.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
      description: 'Explanation about the external data collection',
    },
    checkboxLabel: {
      id: 'ra.application:prerequisites.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í samningsferlinu',
      description: 'Text for external data collection approval',
    },
    nationalRegistryTitle: {
      id: 'ra.application:prerequisites.externalData.nationalRegistryTitle',
      defaultMessage: 'Þjóðskrá',
      description: 'Title for national registry data collection',
    },
    nationalRegistrySubTitle: {
      id: 'ra.application:prerequisites.externalData.nationalRegistrySubTitle',
      defaultMessage: 'Upplýsingar um lögheimili og hjúskaparstöðu.',
      description: 'Subtitle for national registry data collection',
    },
    currentApplicationTitle: {
      id: 'ra.application:prerequisites.externalData.currentApplicationTitle',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      description: 'Title for current application data collection',
    },
    currentApplicationSubTitle: {
      id: 'ra.application:prerequisites.externalData.currentApplicationSubTitle',
      defaultMessage:
        'Upplýsingar um símanúmer og netfang til að auðvelda samningagerðina.',
      description: 'Subtitle for current application data collection',
    },
  }),
}
