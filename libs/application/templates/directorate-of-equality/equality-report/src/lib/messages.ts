import { defineMessages } from 'react-intl'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const equalityReportIntro =
  'Fyrirtæki og stofnanir þar sem starfa 25 eða fleiri að jafnaði á ársgrundvelli skulu setja sér jafnréttisáætlun eða samþætta jafnréttissjónarmið í starfsmannastefnu sína. Skal þar meðal annars sérstaklega kveðið á um markmið og gerð áætlunar um hvernig þeim skuli náð til að tryggja starfsfólki þau réttindi sem kveðið er á um í 6.-14. gr. Jafnréttisáætlun og jafnréttissjónarmið í starfsmannastefnu skal endurskoða á þriggja ára fresti.'

export const messages = {
  errors: defineMessages({
    required: {
      id: 'doe.er.application:errors.required',
      defaultMessage: 'Þessi reitur má ekki vera tómur',
    },
    invalidEmail: {
      id: 'doe.er.application:errors.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
    },
    invalidNonNegativeNumber: {
      id: 'doe.er.application:errors.invalidNonNegativeNumber',
      defaultMessage: 'Talan verður að vera 0 eða hærri',
    },
    duplicateSubsidiary: {
      id: 'doe.er.application:errors.duplicateSubsidiary',
      defaultMessage: 'Þetta dótturfélag er þegar á listanum',
    },
    invalidCompanyNationalId: {
      id: 'doe.er.application:errors.invalidCompanyNationalId',
      defaultMessage: 'Kennitala er ekki gild kennitala fyrirtækis',
    },
  }),

  general: defineMessages({
    applicationName: {
      id: 'doe.er.application:general.applicationName',
      defaultMessage: 'Jafnréttisáætlun',
    },
    institution: {
      id: 'doe.er.application:general.institution',
      defaultMessage: 'Jafnréttisstofa',
    },
  }),

  notAllowed: defineMessages({
    title: {
      id: 'doe.er.application:notAllowed.title',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    description: {
      id: 'doe.er.application:notAllowed.description',
      defaultMessage:
        'Vinsamlegast skráðu þig inn í umboði fyrirtækis til að skila inn jafnréttisáætlun.',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:approved.sectionTitle',
      defaultMessage: 'Samþykkt',
    },
    title: {
      id: 'doe.er.application:approved.title',
      defaultMessage: 'Umsókn samþykkt',
    },
    description: {
      id: 'doe.er.application:approved.description',
      defaultMessage: 'Umsókn þín hefur verið samþykkt.',
    },
  }),

  rejected: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:rejected.sectionTitle',
      defaultMessage: 'Hafnað',
    },
    title: {
      id: 'doe.er.application:rejected.title',
      defaultMessage: 'Umsókn hafnað',
    },
    description: {
      id: 'doe.er.application:rejected.description',
      defaultMessage: 'Umsókn þinni hefur verið hafnað.',
    },
  }),

  //
  prerequisites: {
    errors: defineMessages({
      approveExternalData: {
        id: 'doe.er.application:prerequisites.errors.approveExternalData',
        defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      },
    }),
    section: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:prerequisites.section.sectionTitle',
        defaultMessage: 'Forsendur',
      },
      title: {
        id: 'doe.er.application:prerequisites.section.title',
        defaultMessage: 'Gagnaöflun',
      },
      intro: {
        id: 'doe.er.application:prerequisites.section.intro',
        defaultMessage: lorem,
      },
      checkboxLabel: {
        id: 'doe.er.application:prerequisites.section.checkboxLabel',
        defaultMessage:
          'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      },
    }),
    companyRegistry: defineMessages({
      title: {
        id: 'doe.er.application:prerequisites.companyRegistry.title',
        defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
      },
      intro: {
        id: 'doe.er.application:prerequisites.companyRegistry.intro',
        defaultMessage:
          'Nafn fyrirtækis, kennitala, heimilisfang og fleiri upplýsingar.',
      },
    }),
    userProfile: defineMessages({
      title: {
        id: 'doe.er.application:prerequisites.userProfile.title',
        defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      },
      intro: {
        id: 'doe.er.application:prerequisites.userProfile.intro',
        defaultMessage:
          'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
      },
    }),
    activeEqualityReport: defineMessages({
      title: {
        id: 'doe.er.application:prerequisites.activeEqualityReport.title',
        defaultMessage: 'Upplýsingar frá Jafnréttisstofu',
      },
      intro: {
        id: 'doe.er.application:prerequisites.activeEqualityReport.intro',
        defaultMessage:
          'Við sækjum upplýsingar um þína stöðu hjá Jafnréttisstofu.',
      },
    }),
    nationalRegistry: defineMessages({
      title: {
        id: 'doe.er.application:prerequisites.nationalRegistry.title',
        defaultMessage: 'Upplýsingar úr Þjóðskrá',
      },
      intro: {
        id: 'doe.er.application:prerequisites.nationalRegistry.intro',
        defaultMessage:
          'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      },
    }),
    personalData: defineMessages({
      title: {
        id: 'doe.er.application:prerequisites.personalData.title',
        defaultMessage: 'Meðferð persónuupplýsinga',
      },
      intro: {
        id: 'doe.er.application:prerequisites.personalData.intro',
        defaultMessage:
          'Vefsvæðið er öruggt og vinnur aðeins með auðkenni starfsmanna en ekki persónugreinanlegar upplýsingar, svo sem nöfn eða kennitölur. Skipulag vinnunnar skiptir því miklu máli og nauðsynlegt er að halda vel utan um öll gögn sem henni tengjast, auðkenni starfsmanna o.s.frv.. Ef það kemur til dæmis í ljós að þú þurfir að leiðrétta laun starfsmanns með auðkennið 10, þá viltu vita á auðveldan hátt hvaða starfsmann um ræðir.',
      },
    }),
  },

  // Upplýsingar um fyrirtækið
  aboutTheCompany: {
    section: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.section.sectionTitle',
        defaultMessage: 'Upplýsingar um fyrirtækið',
      },
    }),
    generalInformation: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.intro',
        defaultMessage:
          'Eftirfarandi upplýsingar eru sóttar sjálfkrafa frá fyrirtækjaskrá Skattsins og úr kerfum Jafnréttisstofu. Ef upplýsingar um fjölda starfsmanna vantar, verður fjöldi útreiknaður útfrá skilum á þessari áætlun.',
      },
      companyName: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.companyName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      nationalId: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.nationalId',
        defaultMessage: 'Kennitala',
      },
      address: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.address',
        defaultMessage: 'Heimilisfang',
      },
      postalCode: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.postalCode',
        defaultMessage: 'Póstnúmer',
      },
      municipality: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.municipality',
        defaultMessage: 'Sveitarfélag',
      },
      numberOfEmployees: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.numberOfEmployees',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      isatClassification: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.isatClassification',
        defaultMessage: 'ÍSAT atvinnugreinarflokkun',
      },
    }),
    chiefExecutive: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.sectionTitle',
        defaultMessage: 'Æðsti stjórnandi',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.title',
        defaultMessage: 'Æðsti stjórnandi',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.intro',
        defaultMessage:
          'Óskað er sérstaklega eftir upplýsingum um kyn æðsta stjórnanda til að fylgjast með kynjaskiptingu í æðstu stjórnendastöðum á vinnumarkaði. Þá er hægt að greina þróun yfir tíma, bera saman atvinnugreinar og meta hvort markmið jafnréttislaga um að jafna stöðu kynjanna séu að nást.',
      },
      name: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.namePlaceholder',
        defaultMessage: 'Nafn æðsta stjórnanda',
      },
      email: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.emailPlaceholder',
        defaultMessage: 'Netfang æðsta stjórnanda',
      },
      jobTitle: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.jobTitle',
        defaultMessage: 'Starfstitill',
      },
      jobTitlePlaceholder: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.jobTitlePlaceholder',
        defaultMessage: 'Starfstitill æðsta stjórnanda',
      },
      gender: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.gender',
        defaultMessage: 'Kyn',
      },
      genderMale: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.genderMale',
        defaultMessage: 'Karl',
      },
      genderFemale: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.genderFemale',
        defaultMessage: 'Kona',
      },
      genderNonBinary: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.genderNonBinary',
        defaultMessage: 'Hlutlæg skráning kyns í þjóðskrá',
      },
    }),
    contactPerson: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.sectionTitle',
        defaultMessage: 'Tengiliður',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.title',
        defaultMessage: 'Tengiliður',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.intro',
        defaultMessage:
          'Tengiliður er sá aðili sem ber ábyrgð á skýrslugjöfinni auk stjórnanda. Við höfum samskipti við tengiliðinn svo mikilvægt er að hann sé með á nótunum.',
      },
      contactInfoTitle: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.contactInfoTitle',
        defaultMessage: 'Upplýsingar um tengilið',
      },
      name: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.namePlaceholder',
        defaultMessage: 'Nafn tengiliðs',
      },
      email: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.emailPlaceholder',
        defaultMessage: 'Netfang tengiliðs',
      },
      phone: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.phone',
        defaultMessage: 'Símanúmer',
      },
      phonePlaceholder: {
        id: 'doe.er.application:aboutTheCompany.contactPerson.phonePlaceholder',
        defaultMessage: 'Símanúmer tengiliðs',
      },
    }),
    employeeCount: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.sectionTitle',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.intro',
        defaultMessage:
          'Forskráðar upplýsingar um starfsmannafjölda koma frá Skattinum í janúar ár hvert. Hér að neðan er hins vegar beðið um upplýsingar um þann núverandi fjölda starfsmanna.',
      },
      women: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.women',
        defaultMessage: 'Konur',
      },
      men: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.men',
        defaultMessage: 'Karlar',
      },
      nonBinary: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.nonBinary',
        defaultMessage: 'Hlutlæg skráning kyns í þjóðskrá',
      },
    }),
    subsidiaries: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.sectionTitle',
        defaultMessage: 'Dótturfyrirtæki',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.title',
        defaultMessage: 'Dótturfyrirtæki',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.intro',
        defaultMessage:
          'Hægt er að skila inn einni áætlun fyrir móður- og dótturfyrirtæki.',
      },
      includesSubsidiariesTitle: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
        defaultMessage: 'Nær jafnréttisáætlun einnig til dótturfyrirtækja?',
      },
      yes: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.yes',
        defaultMessage: 'Já',
      },
      no: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.no',
        defaultMessage: 'Nei',
      },
      tableFormTitle: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableFormTitle',
        defaultMessage: 'Upplýsingar um dótturfyrirtæki',
      },
      tableAddButton: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableAddButton',
        defaultMessage: 'Bæta við dótturfyrirtæki',
      },
      tableSaveButton: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableSaveButton',
        defaultMessage: 'Vista dótturfyrirtæki',
      },
      tableRemoveButton: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableRemoveButton',
        defaultMessage: 'Eyða dótturfyrirtæki',
      },
      tableEditButton: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableEditButton',
        defaultMessage: 'Breyta dótturfyrirtæki',
      },
      tableHeaderName: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableHeaderName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      tableHeaderNationalId: {
        id: 'doe.er.application:aboutTheCompany.subsidiaries.tableHeaderNationalId',
        defaultMessage: 'Kennitala',
      },
    }),
  },

  // Jafnréttisáætlun
  equalityReport: {
    section: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:equalityReport.section.sectionTitle',
        defaultMessage: 'Jafnréttisáætlun',
      },
    }),
    information: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:equalityReport.information.sectionTitle',
        defaultMessage: 'Upplýsingar',
      },
      title: {
        id: 'doe.er.application:equalityReport.information.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'doe.er.application:equalityReport.information.intro',
        defaultMessage: equalityReportIntro,
      },
      detailLink: {
        id: 'doe.er.application:equalityReport.information.detailLink',
        defaultMessage: 'https://island.is/s/jafnrettisstofa/jafnrettisaaetlun',
      },
      detailLinkLabel: {
        id: 'doe.er.application:equalityReport.information.detailLinkLabel',
        defaultMessage: 'Nánari upplýsingar um kröfu um jafnréttisáætlun',
      },
      listTitle: {
        id: 'doe.er.application:equalityReport.information.listTitle',
        defaultMessage: 'Markmið og lagalegar aðgerðir jafnréttisáætlunar',
      },
      list: {
        id: 'doe.er.application:equalityReport.information.list#markdown',
        defaultMessage:
          '* Launajafnrétti\n\n* Jafnlaunastaðfesting eða jafnlaunavottun\n\n* Laus störf, starfsþjálfun, endurmenntun og símenntun\n\n* Samræming fjölskyldu- og atvinnulífs\n\n* Kynbundið ofbeldi, kynbundin áreitni og kynferðisleg áreitni (fyrirbyggjandi aðgerðir)',
      },
      checkboxLabel: {
        id: 'doe.er.application:equalityReport.information.checkboxLabel',
        defaultMessage:
          'Ég staðfesti að ég muni framfylgja markmiðum jafnréttisáætlunar',
      },
      editorTitle: {
        id: 'doe.er.application:equalityReport.information.editorTitle',
        defaultMessage: 'Innihald efnis',
      },
      editorFetchTemplate: {
        id: 'doe.er.application:equalityReport.information.editorFetchTemplate',
        defaultMessage: 'Sækja sniðmát',
      },
      editorFetchTemplateDoc: {
        id: 'doe.er.application:equalityReport.information.editorFetchTemplateDoc',
        defaultMessage: 'Hlaða niður sniðmáti (.docx)',
      },
      editorFetchTemplateFill: {
        id: 'doe.er.application:equalityReport.information.editorFetchTemplateFill',
        defaultMessage: 'Fá sniðmát í ritil',
      },
      editorUploadFile: {
        id: 'doe.er.application:equalityReport.information.editorUploadFile',
        defaultMessage: 'Hlaða upp skjali',
      },
      editorUnsupportedFile: {
        id: 'doe.er.application:equalityReport.information.editorUnsupportedFile',
        defaultMessage:
          'Ekki stutt skráarsnið. Vinsamlegast hlaðið upp .txt eða .docx skrá.',
      },
      editorUploadError: {
        id: 'doe.er.application:equalityReport.information.editorUploadError',
        defaultMessage:
          'Villa kom upp við lestur skráar. Vinsamlegast reynið aftur.',
      },
    }),
    previousEqualityPlan: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.sectionTitle',
        defaultMessage: 'Eldri Jafnréttisáætlun',
      },
      title: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.title',
        defaultMessage: 'Virk jafnréttisáætlun tilstaðar',
      },
      intro: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.intro',
        defaultMessage:
          'Fyrirtækið hefur skilað inn jafnréttisáætlun til Jafnréttisstofu á síðustu 3 árum og er með virka áætlun skráða. Þú getur sent inn nýja áætlun og látið þá eldri falla úr gildi.',
      },
      copyButton: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.copyButton',
        defaultMessage: 'Afrita',
      },
      copied: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.copied',
        defaultMessage: 'Afritað!',
      },
    }),
    goalsAndActions: defineMessages({
      sectionTitle: {
        id: 'doe.er.application:equalityReport.goalsAndActions.sectionTitle',
        defaultMessage: 'Markmið og aðgerðir',
      },
      title: {
        id: 'doe.er.application:equalityReport.goalsAndActions.title',
        defaultMessage: 'Jafnréttisáætlun',
      },
      intro: {
        id: 'doe.er.application:equalityReport.goalsAndActions.intro',
        defaultMessage: equalityReportIntro,
      },
    }),
  },

  // Yfirlit
  overview: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit',
    },
    title: {
      id: 'doe.er.application:overview.title',
      defaultMessage: 'Yfirlit umsóknar',
    },
    intro: {
      id: 'doe.er.application:overview.intro',
      defaultMessage: 'Vinsamlegast farðu yfir umsóknina áður en þú sendir.',
    },
    submitButton: {
      id: 'doe.er.application:overview.submitButton',
      defaultMessage: 'Senda inn',
    },
    companyInfo: {
      id: 'doe.er.application:overview.companyInfo',
      defaultMessage: 'Upplýsingar um fyrirtæki',
    },
    chiefExecutive: {
      id: 'doe.er.application:overview.chiefExecutive',
      defaultMessage: 'Æðsti stjórnandi',
    },
    contactPerson: {
      id: 'doe.er.application:overview.contactPerson',
      defaultMessage: 'Tengiliður',
    },
    employeeCount: {
      id: 'doe.er.application:overview.employeeCount',
      defaultMessage: 'Fjöldi starfsmanna',
    },
    subsidiaries: {
      id: 'doe.er.application:overview.subsidiaries',
      defaultMessage: 'Dótturfyrirtæki',
    },
    equalityPlan: {
      id: 'doe.er.application:overview.equalityPlan',
      defaultMessage: 'Jafnréttisáætlun',
    },
    women: {
      id: 'doe.er.application:overview.women',
      defaultMessage: 'Konur',
    },
    men: {
      id: 'doe.er.application:overview.men',
      defaultMessage: 'Karlar',
    },
    nonBinary: {
      id: 'doe.er.application:overview.nonBinary',
      defaultMessage: 'Hlutlægt kyn',
    },
    hasSubsidiaries: {
      id: 'doe.er.application:overview.hasSubsidiaries',
      defaultMessage: 'Inniheldur dótturfyrirtæki',
    },
    noSubsidiaries: {
      id: 'doe.er.application:overview.noSubsidiaries',
      defaultMessage: 'Nei',
    },
    yesSubsidiaries: {
      id: 'doe.er.application:overview.yesSubsidiaries',
      defaultMessage: 'Já',
    },
  }),

  completed: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:completed.sectionTitle',
      defaultMessage: 'Umsókn móttekin',
    },
    alertTitle: {
      id: 'doe.er.application:completed.title',
      defaultMessage: 'Jafnréttisáætlun hefur verið send til Jafnréttisstofu',
    },
    alertDescription: {
      id: 'doe.er.application:completed.description',
      defaultMessage:
        'Við höfum móttekið jafnréttisáætlunina þína og hún verður yfirfarin af Jafnréttisstofu. Þú færð senda staðfestingu þegar yfirferð er lokið. Ef frekari upplýsingar vantar mun Jafnréttisstofa hafa samband við þig.',
    },
  }),
}
