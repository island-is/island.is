import { defineMessages } from 'react-intl'

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
    editorMinLength: {
      id: 'doe.er.application:errors.editorMinLength',
      defaultMessage: 'Texti verður að vera að minnsta kosti 200 stafir',
    },
    alertTitle: {
      id: 'doe.er.application:errors.alertTitle',
      defaultMessage: 'Villa:',
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
    tagDraft: {
      id: 'doe.er.application:general.tagDraft',
      defaultMessage: 'Drög',
    },
    newApplicationButtonLabel: {
      id: 'doe.er.application:general.newApplicationButtonLabel',
      defaultMessage: 'Ný jafnréttisáætlun',
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
    formTitle: {
      id: 'doe.er.application:approved.formTitle',
      defaultMessage: 'Jafnréttisáætlun samþykkt!',
    },
    title: {
      id: 'doe.er.application:approved.title',
      defaultMessage: 'Jafnréttisáætlun samþykkt',
    },
    description: {
      id: 'doe.er.application:approved.description',
      defaultMessage: 'Jafnréttisáætlunin þín hefur verið samþykkt.',
    },
  }),

  rejected: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:rejected.sectionTitle',
      defaultMessage: 'Hafnað',
    },
    formTitle: {
      id: 'doe.er.application:rejected.formTitle',
      defaultMessage: 'Jafnréttisáætlun hafnað',
    },
    title: {
      id: 'doe.er.application:rejected.title',
      defaultMessage: 'Jafnréttisáætlun hafnað',
    },
    description: {
      id: 'doe.er.application:rejected.description',
      defaultMessage: 'Jafnréttisáætluninni þinni hefur verið hafnað.',
    },
  }),

  // Forsendur
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
        defaultMessage: equalityReportIntro,
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
        id:
          'doe.er.application:aboutTheCompany.generalInformation.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.generalInformation.intro',
        defaultMessage:
          'Eftirfarandi upplýsingar eru sóttar sjálfkrafa frá fyrirtækjaskrá Skattsins og úr kerfum Jafnréttisstofu. Ef upplýsingar um fjölda starfsmanna vantar, verður fjöldi útreiknaður útfrá skilum á þessari skýrslu.',
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
        id:
          'doe.er.application:aboutTheCompany.generalInformation.municipality',
        defaultMessage: 'Sveitarfélag',
      },
      numberOfEmployees: {
        id:
          'doe.er.application:aboutTheCompany.generalInformation.numberOfEmployees',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      isatClassification: {
        id:
          'doe.er.application:aboutTheCompany.generalInformation.isatClassification',
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
        id:
          'doe.er.application:aboutTheCompany.chiefExecutive.emailPlaceholder',
        defaultMessage: 'Netfang æðsta stjórnanda',
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
        defaultMessage: 'Kynsegin',
      },
      jobTitle: {
        id: 'doe.er.application:aboutTheCompany.chiefExecutive.jobTitle',
        defaultMessage: 'Starfsheiti',
      },
      jobTitlePlaceholder: {
        id:
          'doe.er.application:aboutTheCompany.chiefExecutive.jobTitlePlaceholder',
        defaultMessage: 'Starfsheiti æðsta stjórnanda',
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
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      title: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      intro: {
        id: 'doe.er.application:aboutTheCompany.employeeCount.intro',
        defaultMessage:
          'Hér er óskað eftir upplýsingum um meðalfjölda starfsmanna, skipt eftir kyni.',
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
        defaultMessage: 'Kynsegin',
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
          'Hægt er að skila inn sameiginlegri áætlun fyrir móður- og dótturfyrirtæki.',
      },
      includesSubsidiariesTitle: {
        id:
          'doe.er.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
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
        id:
          'doe.er.application:aboutTheCompany.subsidiaries.tableHeaderNationalId',
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
        defaultMessage: 'Nánar um jafnréttisáætlun',
      },
      instructionsLabel: {
        id: 'doe.er.application:equalityReport.information.instructionsLabel',
        defaultMessage: 'Leiðbeiningar',
      },
      instructionsLink: {
        id: 'doe.er.application:equalityReport.information.instructionsLink',
        defaultMessage: 'https://island.is/s/jafnrettisstofa/leidbeiningar',
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
      implementationTitle: {
        id: 'doe.er.application:equalityReport.information.implementationTitle',
        defaultMessage: 'Skipulag og framkvæmd við gerð Jafnréttisáætlunar',
      },
      implementationList: {
        id:
          'doe.er.application:equalityReport.information.implementationList#markdown',
        defaultMessage:
          '* Markmiðin eru skýr\n\n* Framkvæmdaáætlun er í samræmi við sett markmið\n\n* Aðgerðir hafa tímaramma\n\n* Áætlunin inniheldur árangursmat\n\n* Ábyrgð er skýr\n\n* Gildistími tilgreindur',
      },
      editorFetchTemplateDoc: {
        id:
          'doe.er.application:equalityReport.information.editorFetchTemplateDoc',
        defaultMessage: 'Hlaða niður sniðmáti (.docx)',
      },
      editorUploadFile: {
        id: 'doe.er.application:equalityReport.information.editorUploadFile',
        defaultMessage: 'Hlaða upp skjali',
      },
      editorSupportedFileTypes: {
        id:
          'doe.er.application:equalityReport.information.editorSupportedFileTypes',
        defaultMessage: 'Samþykktar skráartegundir eru: .docx, .txt',
      },
      editorUnsupportedFile: {
        id:
          'doe.er.application:equalityReport.information.editorUnsupportedFile',
        defaultMessage:
          'Ekki stutt skráarsnið. Vinsamlegast hlaðið upp .txt eða .docx skrá.',
      },
      editorUploadError: {
        id: 'doe.er.application:equalityReport.information.editorUploadError',
        defaultMessage:
          'Villa kom upp við lestur skráar. Vinsamlegast reynið aftur.',
      },
      editorUploadSuccess: {
        id: 'doe.er.application:equalityReport.information.editorUploadSuccess',
        defaultMessage: 'Skjalinu var hlaðið upp.',
      },
      editorUploadIncomplete: {
        id:
          'doe.er.application:equalityReport.information.editorUploadIncomplete',
        defaultMessage:
          'Ljúktu við upphleðslu jafnréttisáætlunar áður en þú heldur áfram.',
      },
      editorUploadRequired: {
        id:
          'doe.er.application:equalityReport.information.editorUploadRequired',
        defaultMessage: 'Hlaðið upp jafnréttisáætlun áður en þú heldur áfram.',
      },
    }),
    previousEqualityPlan: defineMessages({
      sectionTitle: {
        id:
          'doe.er.application:equalityReport.previousEqualityPlan.sectionTitle',
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
        defaultMessage: 'Afrita innihald eldri áætlunar',
      },
      copied: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.copied',
        defaultMessage: 'Afritað!',
      },
      alertTitle: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.alertTitle',
        defaultMessage: 'Gild jafnréttisáætlun',
      },
      approvedAt: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.approvedAt',
        defaultMessage: 'Samþykkt',
      },
      validUntil: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.validUntil',
        defaultMessage: 'Gildir til',
      },
      loadError: {
        id: 'doe.er.application:equalityReport.previousEqualityPlan.loadError',
        defaultMessage:
          'Ekki tókst að sækja eldri jafnréttisáætlun. Vinsamlegast reynið aftur síðar.',
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
      defaultMessage: 'Yfirlit jafnréttisáætlunar',
    },
    intro: {
      id: 'doe.er.application:overview.intro',
      defaultMessage:
        'Vinsamlegast farðu yfir innsendinguna áður en þú sendir.',
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
    equalityPlanFile: {
      id: 'doe.er.application:overview.equalityPlanFile',
      defaultMessage: 'Skjal',
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
      defaultMessage: 'Kynsegin',
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

  inReview: defineMessages({
    tagLabel: {
      id: 'doe.er.application:inReview.tagLabel',
      defaultMessage: 'Í vinnslu hjá ritstjórn',
    },
    sectionTitle: {
      id: 'doe.er.application:inReview.sectionTitle',
      defaultMessage: 'Sending móttekin',
    },
    formTitle: {
      id: 'doe.er.application:inReview.formTitle',
      defaultMessage: 'Takk fyrir innsendinguna',
    },
    alertTitle: {
      id: 'doe.er.application:inReview.title',
      defaultMessage: 'Jafnréttisáætlun er móttekin',
    },
    alertTitleRevised: {
      id: 'doe.er.application:inReview.alertTitleRevised',
      defaultMessage: 'Jafnréttisáætlun uppfærð',
    },
    alertDescription: {
      id: 'doe.er.application:inReview.description',
      defaultMessage:
        'Við höfum móttekið jafnréttisáætlunina þína og hún verður yfirfarin af Jafnréttisstofu. Þú færð senda staðfestingu þegar yfirferð er lokið. Ef frekari upplýsingar vantar mun Jafnréttisstofa hafa samband við þig.',
    },
    sentHistoryLog: {
      id: 'doe.er.application:inReview.sentHistoryLog',
      defaultMessage: 'Jafnréttisáætlun innsend',
    },
    approvedHistoryLog: {
      id: 'doe.er.application:inReview.approvedHistoryLog',
      defaultMessage: 'Jafnréttisáætlun samþykkt',
    },
    rejectedHistoryLog: {
      id: 'doe.er.application:inReview.rejectedHistoryLog',
      defaultMessage: 'Jafnréttisáætlun hafnað',
    },
    editHistoryLog: {
      id: 'doe.er.application:inReview.editHistoryLog',
      defaultMessage: 'Athugasemd frá Jafnréttisstofu',
    },
    expandableIntro: {
      id: 'doe.er.application:inReview.expandableIntro',
      defaultMessage: 'Jafnréttisáætlunin verður yfirfarin af Jafnréttisstofu',
    },
    expandableDescription: {
      id: 'doe.er.application:inReview.expandableDescription#markdown',
      defaultMessage:
        '* Athugasemdir og ábendingar verða sendar á tengilið í gegnum tölvupóst \n\n* Þegar öll lagaskilyrði eru uppfyllt er áætlunin samþykkt.\n\n* Gildistími jafnréttisáætlunar eru þrjú ár frá samþykki.\n\n* Þú færð áminningu frá okkur þegar það eru sex mánuðir í næstu skil.',
    },
  }),

  comments: defineMessages({
    sectionTitle: {
      id: 'doe.er.application:comments.sectionTitle',
      defaultMessage: 'Athugasemdir',
    },
    title: {
      id: 'doe.er.application:comments.title',
      defaultMessage: 'Athugasemdir',
    },
    emptyState: {
      id: 'doe.er.application:comments.emptyState',
      defaultMessage: 'Engar athugasemdir hafa verið sendar.',
    },
    textareaLabel: {
      id: 'doe.er.application:comments.textareaLabel',
      defaultMessage: 'Athugasemd',
    },
    placeholder: {
      id: 'doe.er.application:comments.placeholder',
      defaultMessage: 'Bættu við athugasemd',
    },
    replyButton: {
      id: 'doe.er.application:comments.replyButton',
      defaultMessage: 'Svara athugasemd',
    },
    sendButton: {
      id: 'doe.er.application:comments.sendButton',
      defaultMessage: 'Senda athugasemd',
    },
    cancelButton: {
      id: 'doe.er.application:comments.cancelButton',
      defaultMessage: 'Hætta við',
    },
    seeAllComments: {
      id: 'doe.er.application:comments.seeAllComments',
      defaultMessage: 'Sjá allar athugasemdir',
    },
    registersComment: {
      id: 'doe.er.application:comments.registersComment',
      defaultMessage: 'skráir athugasemd',
    },
    reviewerLabel: {
      id: 'doe.er.application:comments.reviewerLabel',
      defaultMessage: 'Jafnréttisstofa',
    },
    companyLabel: {
      id: 'doe.er.application:comments.companyLabel',
      defaultMessage: 'Þú',
    },
    today: {
      id: 'doe.er.application:comments.today',
      defaultMessage: 'Í dag',
    },
    yesterday: {
      id: 'doe.er.application:comments.yesterday',
      defaultMessage: 'Í gær',
    },
    daysAgo: {
      id: 'doe.er.application:comments.daysAgo',
      defaultMessage: 'f. {days} dögum',
    },
    sendError: {
      id: 'doe.er.application:comments.sendError',
      defaultMessage: 'Ekki tókst að senda athugasemd, reyndu aftur.',
    },
    loadError: {
      id: 'doe.er.application:comments.loadError',
      defaultMessage: 'Ekki tókst að sækja athugasemdir, reyndu aftur.',
    },
  }),

  draftRetry: defineMessages({
    tagLabel: {
      id: 'doe.er.application:draftRetry.tagLabel',
      defaultMessage: 'Þín bíða athugasemdir',
    },
    submitButton: {
      id: 'doe.er.application:draftRetry.submitButton',
      defaultMessage: 'Senda inn aftur',
    },
    pendingActionTitle: {
      id: 'doe.er.application:draftRetry.pendingActionTitle',
      defaultMessage: 'Beðið er eftir lagfæringu',
    },
    pendingActionContent: {
      id: 'doe.er.application:draftRetry.pendingActionContent',
      defaultMessage:
        'Farðu yfir athugasemdir frá Jafnréttisstofu og lagfærðu jafnréttisáætlunina.',
    },
    pendingActionButton: {
      id: 'doe.er.application:draftRetry.pendingActionButton',
      defaultMessage: 'Halda áfram',
    },
  }),

  historyLogs: defineMessages({
    draftRetry: {
      id: 'doe.er.application:historyLogs.draftRetry',
      defaultMessage: 'Jafnréttisáætlun lagfærð og send aftur',
    },
  }),
}
