import { defineMessages } from 'react-intl'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const equalityReportIntro =
  'Fyrirtæki og stofnanir þar sem starfa 25 eða fleiri að jafnaði á ársgrundvelli skulu setja sér jafnréttisáætlun eða samþætta jafnréttissjónarmið í starfsmannastefnu sína. Skal þar meðal annars sérstaklega kveðið á um markmið og gerð áætlunar um hvernig þeim skuli náð til að tryggja starfsfólki þau réttindi sem kveðið er á um í 6.-14. gr. Jafnréttisáætlun og jafnréttissjónarmið í starfsmannastefnu skal endurskoða á þriggja ára fresti.'

export const messages = {
  general: defineMessages({
    applicationName: {
      id: 'equalityReport.application:general.applicationName',
      defaultMessage: 'Jafnréttisáætlun',
    },
    institution: {
      id: 'equalityReport.application:general.institution',
      defaultMessage: 'Dómsmálaráðuneytið',
    },
  }),

  notAllowed: defineMessages({
    title: {
      id: 'equalityReport.application:notAllowed.title',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    description: {
      id: 'equalityReport.application:notAllowed.description',
      defaultMessage:
        'Vinsamlegast skráðu þig inn í umboði fyrirtækis til að skila inn jafnréttisáætlun.',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'equalityReport.application:approved.sectionTitle',
      defaultMessage: 'Samþykkt',
    },
    title: {
      id: 'equalityReport.application:approved.title',
      defaultMessage: 'Umsókn samþykkt',
    },
    description: {
      id: 'equalityReport.application:approved.description',
      defaultMessage: 'Umsókn þín hefur verið samþykkt.',
    },
  }),

  rejected: defineMessages({
    sectionTitle: {
      id: 'equalityReport.application:rejected.sectionTitle',
      defaultMessage: 'Hafnað',
    },
    title: {
      id: 'equalityReport.application:rejected.title',
      defaultMessage: 'Umsókn hafnað',
    },
    description: {
      id: 'equalityReport.application:rejected.description',
      defaultMessage: 'Umsókn þinni hefur verið hafnað.',
    },
  }),

  // Forsendur
  prerequisites: {
    errors: defineMessages({
      approveExternalData: {
        id: 'equalityReport.application:prerequisites.errors.approveExternalData',
        defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      },
    }),
    section: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:prerequisites.section.sectionTitle',
        defaultMessage: 'Forsendur',
      },
      title: {
        id: 'equalityReport.application:prerequisites.section.title',
        defaultMessage: 'Gagnaöflun',
      },
      intro: {
        id: 'equalityReport.application:prerequisites.section.intro',
        defaultMessage: lorem,
      },
      checkboxLabel: {
        id: 'equalityReport.application:prerequisites.section.checkboxLabel',
        defaultMessage:
          'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      },
    }),
    companyRegistry: defineMessages({
      title: {
        id: 'equalityReport.application:prerequisites.companyRegistry.title',
        defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
      },
      intro: {
        id: 'equalityReport.application:prerequisites.companyRegistry.intro',
        defaultMessage:
          'Nafn fyrirtækis, kennitala, heimilisfang og fleiri upplýsingar.',
      },
    }),
    userProfile: defineMessages({
      title: {
        id: 'equalityReport.application:prerequisites.userProfile.title',
        defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      },
      intro: {
        id: 'equalityReport.application:prerequisites.userProfile.intro',
        defaultMessage:
          'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
      },
    }),
    activeEqualityReport: defineMessages({
      title: {
        id: 'equalityReport.application:prerequisites.activeEqualityReport.title',
        defaultMessage: 'Upplýsingar frá Jafnréttisstofu',
      },
      intro: {
        id: 'equalityReport.application:prerequisites.activeEqualityReport.intro',
        defaultMessage: 'Við sækjum upplýsingar um þína stöðu hjá Jafnréttisstofu.',
      },
    }),
    nationalRegistry: defineMessages({
      title: {
        id: 'equalityReport.application:prerequisites.nationalRegistry.title',
        defaultMessage: 'Upplýsingar úr Þjóðskrá',
      },
      intro: {
        id: 'equalityReport.application:prerequisites.nationalRegistry.intro',
        defaultMessage:
          'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      },
    }),
  },

  // Upplýsingar um fyrirtækið
  aboutTheCompany: {
    section: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.section.sectionTitle',
        defaultMessage: 'Upplýsingar um fyrirtækið',
      },
    }),
    almennarUpplysingar: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.almennarUpplysingar.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.almennarUpplysingar.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.almennarUpplysingar.intro',
        defaultMessage: lorem,
      },
    }),
    aedstiStjornandi: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.aedstiStjornandi.sectionTitle',
        defaultMessage: 'Æðsti stjórnandi',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.aedstiStjornandi.title',
        defaultMessage: 'Æðsti stjórnandi',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.aedstiStjornandi.intro',
        defaultMessage: lorem,
      },
    }),
    tengiliður: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.tengiliður.sectionTitle',
        defaultMessage: 'Tengiliður',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.tengiliður.title',
        defaultMessage: 'Tengiliður',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.tengiliður.intro',
        defaultMessage: lorem,
      },
    }),
    medalfjoldiStarfsmanna: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.medalfjoldiStarfsmanna.sectionTitle',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.medalfjoldiStarfsmanna.title',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.medalfjoldiStarfsmanna.intro',
        defaultMessage: lorem,
      },
    }),
    dotturfyrirtaeki: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.dotturfyrirtaeki.sectionTitle',
        defaultMessage: 'Dótturfyrirtæki',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.dotturfyrirtaeki.title',
        defaultMessage: 'Dótturfyrirtæki',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.dotturfyrirtaeki.intro',
        defaultMessage: lorem,
      },
    }),
  },

  // Jafnréttisáætlun
  equalityReport: {
    section: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.section.sectionTitle',
        defaultMessage: 'Jafnréttisáætlun',
      },
    }),
    uplysingar: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.uplysingar.sectionTitle',
        defaultMessage: 'Upplýsingar',
      },
      title: {
        id: 'equalityReport.application:equalityReport.uplysingar.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.uplysingar.intro',
        defaultMessage: equalityReportIntro,
      },
    }),
    eldriJafnrettisaetlun: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.eldriJafnrettisaetlun.sectionTitle',
        defaultMessage: 'Eldri Jafnréttisáætlun',
      },
      title: {
        id: 'equalityReport.application:equalityReport.eldriJafnrettisaetlun.title',
        defaultMessage: 'Eldri Jafnréttisáætlun',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.eldriJafnrettisaetlun.intro',
        defaultMessage: lorem,
      },
    }),
    markmidOgAdgerdir: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.markmidOgAdgerdir.sectionTitle',
        defaultMessage: 'Markmið og aðgerðir',
      },
      title: {
        id: 'equalityReport.application:equalityReport.markmidOgAdgerdir.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.markmidOgAdgerdir.intro',
        defaultMessage: equalityReportIntro,
      },
    }),
  },

  // Yfirlit
  overview: defineMessages({
    sectionTitle: {
      id: 'equalityReport.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit',
    },
    title: {
      id: 'equalityReport.application:overview.title',
      defaultMessage: 'Yfirlit umsóknar',
    },
    intro: {
      id: 'equalityReport.application:overview.intro',
      defaultMessage: 'Vinsamlegast farðu yfir umsóknina áður en þú sendir.',
    },
  }),
}
