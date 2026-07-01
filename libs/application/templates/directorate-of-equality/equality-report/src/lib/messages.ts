import { defineMessages } from 'react-intl'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const equalityReportIntro =
  'Fyrirtæki og stofnanir þar sem starfa 25 eða fleiri að jafnaði á ársgrundvelli skulu setja sér jafnréttisáætlun eða samþætta jafnréttissjónarmið í starfsmannastefnu sína. Skal þar meðal annars sérstaklega kveðið á um markmið og gerð áætlunar um hvernig þeim skuli náð til að tryggja starfsfólki þau réttindi sem kveðið er á um í 6.-14. gr. Jafnréttisáætlun og jafnréttissjónarmið í starfsmannastefnu skal endurskoða á þriggja ára fresti.'

export const messages = {
  errors: defineMessages({
    required: {
      id: 'equalityReport.application:errors.required',
      defaultMessage: 'Þessi reitur má ekki vera tómur',
    },
    invalidEmail: {
      id: 'equalityReport.application:errors.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
    },
    invalidNonNegativeNumber: {
      id: 'equalityReport.application:errors.invalidNonNegativeNumber',
      defaultMessage: 'Talan verður að vera 0 eða hærri',
    },
    editorMinLength: {
      id: 'equalityReport.application:errors.editorMinLength',
      defaultMessage: 'Texti verður að vera að minnsta kosti 200 stafir',
    },
    duplicateSubsidiary: {
      id: 'equalityReport.application:errors.duplicateSubsidiary',
      defaultMessage: 'Þetta dótturfélag er þegar á listanum',
    },
  }),

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
        defaultMessage:
          'Við sækjum upplýsingar um þína stöðu hjá Jafnréttisstofu.',
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
    generalInformation: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.intro',
        defaultMessage: lorem,
      },
      companyName: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.companyName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      nationalId: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.nationalId',
        defaultMessage: 'Kennitala',
      },
      address: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.address',
        defaultMessage: 'Heimilisfang',
      },
      postalCode: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.postalCode',
        defaultMessage: 'Póstnúmer',
      },
      municipality: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.municipality',
        defaultMessage: 'Sveitarfélag',
      },
      numberOfEmployees: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.numberOfEmployees',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      isatClassification: {
        id: 'equalityReport.application:aboutTheCompany.generalInformation.isatClassification',
        defaultMessage: 'ÍSAT atvinnugreinarflokkun',
      },
    }),
    chiefExecutive: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.sectionTitle',
        defaultMessage: 'Æðsti stjórnandi',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.title',
        defaultMessage: 'Æðsti stjórnandi',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.intro',
        defaultMessage: lorem,
      },
      name: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.namePlaceholder',
        defaultMessage: 'Nafn æðsta stjórnanda',
      },
      email: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.emailPlaceholder',
        defaultMessage: 'Netfang æðsta stjórnanda',
      },
      gender: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.gender',
        defaultMessage: 'Kyn',
      },
      genderMale: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.genderMale',
        defaultMessage: 'Karl',
      },
      genderFemale: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.genderFemale',
        defaultMessage: 'Kona',
      },
      genderNonBinary: {
        id: 'equalityReport.application:aboutTheCompany.chiefExecutive.genderNonBinary',
        defaultMessage: 'Hlutlægt',
      },
    }),
    contactPerson: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.sectionTitle',
        defaultMessage: 'Tengiliður',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.title',
        defaultMessage: 'Tengiliður',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.intro',
        defaultMessage: lorem,
      },
      contactInfoTitle: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.contactInfoTitle',
        defaultMessage: 'Upplýsingar um tengilið',
      },
      name: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.namePlaceholder',
        defaultMessage: 'Nafn tengiliðs',
      },
      email: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.emailPlaceholder',
        defaultMessage: 'Netfang tengiliðs',
      },
      phone: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.phone',
        defaultMessage: 'Símanúmer',
      },
      phonePlaceholder: {
        id: 'equalityReport.application:aboutTheCompany.contactPerson.phonePlaceholder',
        defaultMessage: 'Símanúmer tengiliðs',
      },
    }),
    employeeCount: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.sectionTitle',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.intro',
        defaultMessage: lorem,
      },
      women: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.women',
        defaultMessage: 'Konur',
      },
      men: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.men',
        defaultMessage: 'Karlar',
      },
      nonBinary: {
        id: 'equalityReport.application:aboutTheCompany.employeeCount.nonBinary',
        defaultMessage: 'Hlutlæg skráning kyns í þjóðskrá',
      },
    }),
    subsidiaries: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.sectionTitle',
        defaultMessage: 'Dótturfyrirtæki',
      },
      title: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.title',
        defaultMessage: 'Dótturfyrirtæki',
      },
      intro: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.intro',
        defaultMessage: lorem,
      },
      includesSubsidiariesTitle: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
        defaultMessage: 'Nær jafnréttisáætlun einnig til dótturfyrirtækja?',
      },
      yes: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.yes',
        defaultMessage: 'Já',
      },
      no: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.no',
        defaultMessage: 'Nei',
      },
      tableFormTitle: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableFormTitle',
        defaultMessage: 'Upplýsingar um dótturfyrirtæki',
      },
      tableAddButton: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableAddButton',
        defaultMessage: 'Bæta við dótturfyrirtæki',
      },
      tableSaveButton: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableSaveButton',
        defaultMessage: 'Vista dótturfyrirtæki',
      },
      tableRemoveButton: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableRemoveButton',
        defaultMessage: 'Eyða dótturfyrirtæki',
      },
      tableEditButton: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableEditButton',
        defaultMessage: 'Breyta dótturfyrirtæki',
      },
      tableHeaderName: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableHeaderName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      tableHeaderNationalId: {
        id: 'equalityReport.application:aboutTheCompany.subsidiaries.tableHeaderNationalId',
        defaultMessage: 'Kennitala',
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
    information: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.information.sectionTitle',
        defaultMessage: 'Upplýsingar',
      },
      title: {
        id: 'equalityReport.application:equalityReport.information.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.information.intro',
        defaultMessage: equalityReportIntro,
      },
      detailLink: {
        id: 'equalityReport.application:equalityReport.information.detailLink',
        defaultMessage: 'https://island.is/s/jafnrettisstofa/jafnrettisaaetlun',
      },
      detailLinkLabel: {
        id: 'equalityReport.application:equalityReport.information.detailLinkLabel',
        defaultMessage: 'Nánari upplýsingar um kröfu um jafnréttisáætlun',
      },
      listTitle: {
        id: 'equalityReport.application:equalityReport.information.listTitle',
        defaultMessage: 'Markmið og lagalegar aðgerðir jafnréttisáætlunar',
      },
      list: {
        id: 'equalityReport.application:equalityReport.information.list#markdown',
        defaultMessage:
          '* Launajafnrétti\n\n* Jafnlaunastaðfesting eða jafnlaunavottun\n\n* Laus störf, starfsþjálfun, endurmenntun og símenntun\n\n* Samræming fjölskyldu- og atvinnulífs\n\n* Kynbundið ofbeldi, kynbundin áreitni og kynferðisleg áreitni (fyrirbyggjandi aðgerðir)',
      },
      checkboxLabel: {
        id: 'equalityReport.application:equalityReport.information.checkboxLabel',
        defaultMessage:
          'Ég staðfesti að ég muni framfylgja markmiðum jafnréttisáætlunar',
      },
      editorTitle: {
        id: 'equalityReport.application:equalityReport.information.editorTitle',
        defaultMessage: 'Innihald efnis',
      },
      editorFetchTemplate: {
        id: 'equalityReport.application:equalityReport.information.editorFetchTemplate',
        defaultMessage: 'Sækja sniðmát',
      },
      editorFetchTemplateDoc: {
        id: 'equalityReport.application:equalityReport.information.editorFetchTemplateDoc',
        defaultMessage: 'Hlaða niður sniðmáti (.docx)',
      },
      editorFetchTemplateFill: {
        id: 'equalityReport.application:equalityReport.information.editorFetchTemplateFill',
        defaultMessage: 'Fá sniðmát í ritil',
      },
      editorUploadFile: {
        id: 'equalityReport.application:equalityReport.information.editorUploadFile',
        defaultMessage: 'Hlaða upp skjali',
      },
      editorUnsupportedFile: {
        id: 'equalityReport.application:equalityReport.information.editorUnsupportedFile',
        defaultMessage:
          'Ekki stutt skráarsnið. Vinsamlegast hlaðið upp .txt eða .docx skrá.',
      },
      editorUploadError: {
        id: 'equalityReport.application:equalityReport.information.editorUploadError',
        defaultMessage:
          'Villa kom upp við lestur skráar. Vinsamlegast reynið aftur.',
      },
    }),
    previousEqualityPlan: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.previousEqualityPlan.sectionTitle',
        defaultMessage: 'Eldri Jafnréttisáætlun',
      },
      title: {
        id: 'equalityReport.application:equalityReport.previousEqualityPlan.title',
        defaultMessage: 'Virk jafnréttisáætlun tilstaðar',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.previousEqualityPlan.intro',
        defaultMessage:
          'Fyrirtækið hefur skilað inn jafnréttisáætlun til Jafnréttisstofu á síðustu 3 árum og er með virka áætlun skráða. Þú getur sent inn nýja áætlun og látið þá eldri falla úr gildi.',
      },
      copyButton: {
        id: 'equalityReport.application:equalityReport.previousEqualityPlan.copyButton',
        defaultMessage: 'Afrita',
      },
      copied: {
        id: 'equalityReport.application:equalityReport.previousEqualityPlan.copied',
        defaultMessage: 'Afritað!',
      },
    }),
    goalsAndActions: defineMessages({
      sectionTitle: {
        id: 'equalityReport.application:equalityReport.goalsAndActions.sectionTitle',
        defaultMessage: 'Markmið og aðgerðir',
      },
      title: {
        id: 'equalityReport.application:equalityReport.goalsAndActions.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'equalityReport.application:equalityReport.goalsAndActions.intro',
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
    submitButton: {
      id: 'equalityReport.application:overview.submitButton',
      defaultMessage: 'Senda inn',
    },
    companyInfo: {
      id: 'equalityReport.application:overview.companyInfo',
      defaultMessage: 'Upplýsingar um fyrirtæki',
    },
    chiefExecutive: {
      id: 'equalityReport.application:overview.chiefExecutive',
      defaultMessage: 'Æðsti stjórnandi',
    },
    contactPerson: {
      id: 'equalityReport.application:overview.contactPerson',
      defaultMessage: 'Tengiliður',
    },
    employeeCount: {
      id: 'equalityReport.application:overview.employeeCount',
      defaultMessage: 'Fjöldi starfsmanna',
    },
    subsidiaries: {
      id: 'equalityReport.application:overview.subsidiaries',
      defaultMessage: 'Dótturfyrirtæki',
    },
    equalityPlan: {
      id: 'equalityReport.application:overview.equalityPlan',
      defaultMessage: 'Jafnréttisáætlun',
    },
    women: {
      id: 'equalityReport.application:overview.women',
      defaultMessage: 'Konur',
    },
    men: {
      id: 'equalityReport.application:overview.men',
      defaultMessage: 'Karlar',
    },
    nonBinary: {
      id: 'equalityReport.application:overview.nonBinary',
      defaultMessage: 'Hlutlægt kyn',
    },
    hasSubsidiaries: {
      id: 'equalityReport.application:overview.hasSubsidiaries',
      defaultMessage: 'Inniheldur dótturfyrirtæki',
    },
    noSubsidiaries: {
      id: 'equalityReport.application:overview.noSubsidiaries',
      defaultMessage: 'Nei',
    },
  }),

  completed: defineMessages({
    sectionTitle: {
      id: 'equalityReport.application:completed.sectionTitle',
      defaultMessage: 'Umsókn móttekin',
    },
    alertTitle: {
      id: 'equalityReport.application:completed.title',
      defaultMessage: 'Jafnréttisáætlun hefur verið send til Jafnréttisstofu',
    },
    alertDescription: {
      id: 'equalityReport.application:completed.description',
      defaultMessage:
        'Við höfum móttekið jafnréttisáætlunina þína og hún verður yfirfarin af Jafnréttisstofu. Þú færð senda staðfestingu þegar yfirferð er lokið. Ef frekari upplýsingar vantar mun Jafnréttisstofa hafa samband við þig.',
    },
  }),
}
