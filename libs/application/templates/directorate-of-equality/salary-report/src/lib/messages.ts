import { defineMessages } from 'react-intl'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export const messages = {
  errors: defineMessages({
    required: {
      id: 'doe.sr.application:errors.required',
      defaultMessage: 'Þessi reitur má ekki vera tómur',
    },
    invalidEmail: {
      id: 'doe.sr.application:errors.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
    },
    duplicateSubsidiary: {
      id: 'doe.sr.application:errors.duplicateSubsidiary',
      defaultMessage: 'Þetta dótturfélag er þegar á listanum',
    },
    invalidCompany: {
      id: 'doe.sr.application:errors.invalidCompany',
      defaultMessage: 'Kennitala fyrirtækis er ekki gild',
    },
    draftSyncFailed: {
      id: 'doe.sr.application:errors.draftSyncFailed',
      defaultMessage:
        'Ekki tókst að vista breytingarnar. Reyndu aftur áður en þú heldur áfram.',
    },
    draftLoadFailed: {
      id: 'doe.sr.application:errors.draftLoadFailed',
      defaultMessage: 'Ekki tókst að sækja gögnin. Reyndu aftur.',
    },
    submitConflict: {
      id: 'doe.sr.application:errors.submitConflict',
      defaultMessage:
        'Fyrirtæki er nú þegar með innsenda skýrslu sem er í vinnslu hjá ritstjórn.',
    },
    retryButton: {
      id: 'doe.sr.application:errors.retryButton',
      defaultMessage: 'Reyna aftur',
    },
    // A remedy date can be in range when it is picked and out of range by the
    // time the plan is submitted, so this is a distinct complaint from
    // errors.required rather than a variant of it.
    remedyDateOutOfRange: {
      id: 'doe.sr.application:errors.remedyDateOutOfRange',
      defaultMessage:
        'Dagsetning úrbóta þarf að vera í framtíðinni og ekki meira en þrjú ár fram í tímann.',
    },
    alertTitle: {
      id: 'doe.sr.application:errors.alertTitle',
      defaultMessage: 'Villa:',
    },
  }),

  general: defineMessages({
    applicationName: {
      id: 'doe.sr.application:general.applicationName',
      defaultMessage: 'Skýrslugjöf um kynbundinn launamun',
    },
    institution: {
      id: 'doe.sr.application:general.institution',
      defaultMessage: 'Jafnréttisstofa',
    },
    tagDraft: {
      id: 'doe.sr.application:general.tagDraft',
      defaultMessage: 'Drög',
    },
    newApplicationButtonLabel: {
      id: 'doe.sr.application:general.newApplicationButtonLabel',
      defaultMessage: 'Ný skýrsla',
    },
  }),

  notAllowed: defineMessages({
    title: {
      id: 'doe.sr.application:notAllowed.title',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    description: {
      id: 'doe.sr.application:notAllowed.description',
      defaultMessage:
        'Þú þarft að vera með gilda [jafnréttisáætlun](/umsoknir/jafnrettisstofa-jafnrettisaaetlun) til þess að senda inn launagreiningu.',
    },
    notCompanyTitle: {
      id: 'doe.sr.application:notAllowed.notCompanyTitle',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    notCompanyDescription: {
      id: 'doe.sr.application:notAllowed.notCompanyDescription',
      defaultMessage:
        'Vinsamlegast skráðu þig inn í umboði fyrirtækis til að senda inn launagreiningu.',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:approved.sectionTitle',
      defaultMessage: 'Samþykkt',
    },
    formTitle: {
      id: 'doe.sr.application:approved.formTitle',
      defaultMessage: 'Skýrslugjöf samþykkt!',
    },
    title: {
      id: 'doe.sr.application:approved.title',
      defaultMessage: 'Skýrslugjöf samþykkt',
    },
    description: {
      id: 'doe.sr.application:approved.description',
      defaultMessage: 'Skýrslugjöfin þín hefur verið samþykkt.',
    },
  }),

  // Forsendur
  prerequisites: {
    errors: defineMessages({
      approveExternalData: {
        id: 'doe.sr.application:prerequisites.errors.approveExternalData',
        defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      },
    }),
    section: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:prerequisites.section.sectionTitle',
        defaultMessage: 'Forsendur',
      },
      title: {
        id: 'doe.sr.application:prerequisites.section.title',
        defaultMessage: 'Gagnaöflun',
      },
      checkboxLabel: {
        id: 'doe.sr.application:prerequisites.section.checkboxLabel',
        defaultMessage:
          'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      },
    }),
    activeEqualityReport: defineMessages({
      title: {
        id: 'doe.sr.application:prerequisites.activeEqualityReport.title',
        defaultMessage: 'Upplýsingar frá Jafnréttisstofu',
      },
      intro: {
        id: 'doe.sr.application:prerequisites.activeEqualityReport.intro',
        defaultMessage:
          'Við sækjum upplýsingar um þína stöðu hjá Jafnréttisstofu.',
      },
    }),
    companyRegistry: defineMessages({
      title: {
        id: 'doe.sr.application:prerequisites.companyRegistry.title',
        defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
      },
      intro: {
        id: 'doe.sr.application:prerequisites.companyRegistry.intro',
        defaultMessage:
          'Nafn fyrirtækis, kennitala, heimilisfang, stærðarflokk og ÍSAT atvinnugreinaflokkun.',
      },
    }),
    userProfile: defineMessages({
      title: {
        id: 'doe.sr.application:prerequisites.userProfile.title',
        defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      },
      intro: {
        id: 'doe.sr.application:prerequisites.userProfile.intro',
        defaultMessage:
          'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
      },
    }),
    nationalRegistry: defineMessages({
      title: {
        id: 'doe.sr.application:prerequisites.nationalRegistry.title',
        defaultMessage: 'Upplýsingar úr Þjóðskrá',
      },
      intro: {
        id: 'doe.sr.application:prerequisites.nationalRegistry.intro',
        defaultMessage:
          'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      },
    }),
  },

  // Upplýsingar um fyrirtækið
  aboutTheCompany: {
    section: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.section.sectionTitle',
        defaultMessage: 'Upplýsingar um fyrirtækið',
      },
    }),
    generalInformation: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.intro',
        defaultMessage:
          'Eftirfarandi upplýsingar eru sóttar sjálfkrafa frá fyrirtækjaskrá Skattsins og úr kerfum Jafnréttisstofu. Ef upplýsingar um fjölda starfsmanna vantar, verður fjöldi útreiknaður útfrá skilum á þessari skýrslu.',
      },
      companyName: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.companyName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      nationalId: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.nationalId',
        defaultMessage: 'Kennitala',
      },
      address: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.address',
        defaultMessage: 'Heimilisfang',
      },
      postalCode: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.postalCode',
        defaultMessage: 'Póstnúmer',
      },
      municipality: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.municipality',
        defaultMessage: 'Sveitarfélag',
      },
      numberOfEmployees: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.numberOfEmployees',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      isatClassification: {
        id: 'doe.sr.application:aboutTheCompany.generalInformation.isatClassification',
        defaultMessage: 'ÍSAT atvinnugreinarflokkun',
      },
    }),
    chiefExecutive: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.sectionTitle',
        defaultMessage: 'Æðsti stjórnandi',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.title',
        defaultMessage: 'Æðsti stjórnandi',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.intro',
        defaultMessage:
          'Óskað er sérstaklega eftir upplýsingum um kyn æðsta stjórnanda til að fylgjast með kynjaskiptingu í æðstu stjórnendastöðum á vinnumarkaði. Þá er hægt að greina þróun yfir tíma, bera saman atvinnugreinar og meta hvort markmið jafnréttislaga um að jafna stöðu kynjanna séu að nást.',
      },
      name: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.namePlaceholder',
        defaultMessage: 'Nafn æðsta stjórnanda',
      },
      email: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.emailPlaceholder',
        defaultMessage: 'Netfang æðsta stjórnanda',
      },
      jobTitle: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.jobTitle',
        defaultMessage: 'Starfstitill',
      },
      jobTitlePlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.jobTitlePlaceholder',
        defaultMessage: 'Starfstitill æðsta stjórnanda',
      },
      gender: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.gender',
        defaultMessage: 'Kyn',
      },
      genderMale: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.genderMale',
        defaultMessage: 'Karl',
      },
      genderFemale: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.genderFemale',
        defaultMessage: 'Kona',
      },
      genderNonBinary: {
        id: 'doe.sr.application:aboutTheCompany.chiefExecutive.genderNonBinary',
        defaultMessage: 'Kynsegin',
      },
    }),
    contactPerson: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.sectionTitle',
        defaultMessage: 'Tengiliður',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.title',
        defaultMessage: 'Tengiliður',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.intro',
        defaultMessage:
          'Tengiliður er sá aðili sem ber ábyrgð á skýrslugjöfinni auk stjórnanda. Samskipti Jafnréttisstofu fara fram við tengiliðinn.',
      },
      contactInfoTitle: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.contactInfoTitle',
        defaultMessage: 'Upplýsingar um tengilið',
      },
      name: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.namePlaceholder',
        defaultMessage: 'Nafn tengiliðs',
      },
      jobTitle: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.jobTitle',
        defaultMessage: 'Starfstitill',
      },
      jobTitlePlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.jobTitlePlaceholder',
        defaultMessage: 'Starfstitill tengiliðs',
      },
      email: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.emailPlaceholder',
        defaultMessage: 'Netfang tengiliðs',
      },
      phone: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.phone',
        defaultMessage: 'Símanúmer',
      },
      phonePlaceholder: {
        id: 'doe.sr.application:aboutTheCompany.contactPerson.phonePlaceholder',
        defaultMessage: 'Símanúmer tengiliðs',
      },
    }),
    subsidiaries: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.sectionTitle',
        defaultMessage: 'Dótturfyrirtæki',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.title',
        defaultMessage: 'Dótturfyrirtæki',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.intro',
        defaultMessage:
          'Hægt er að skila sameiginlegri skýrslu fyrir móður- og dótturfyrirtæki.',
      },
      includesSubsidiariesTitle: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
        defaultMessage: 'Nær skýrslugjöfin einnig til dótturfyrirtækja?',
      },
      yes: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.yes',
        defaultMessage: 'Já',
      },
      no: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.no',
        defaultMessage: 'Nei',
      },
      tableFormTitle: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableFormTitle',
        defaultMessage: 'Upplýsingar um dótturfyrirtæki',
      },
      tableAddButton: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableAddButton',
        defaultMessage: 'Bæta við dótturfyrirtæki',
      },
      tableSaveButton: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableSaveButton',
        defaultMessage: 'Vista dótturfyrirtæki',
      },
      tableRemoveButton: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableRemoveButton',
        defaultMessage: 'Eyða dótturfyrirtæki',
      },
      tableEditButton: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableEditButton',
        defaultMessage: 'Breyta dótturfyrirtæki',
      },
      tableHeaderName: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableHeaderName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      tableHeaderNationalId: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.tableHeaderNationalId',
        defaultMessage: 'Kennitala',
      },
    }),
    period: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.period.sectionTitle',
        defaultMessage: 'Tímabil launagreiningar',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.period.title',
        defaultMessage: 'Tímabil launagreiningar',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.period.intro',
        defaultMessage:
          'Launagreining felur í sér að gefa þarf upp greidd laun fyrir ákveðið tímabil.',
      },
      label: {
        id: 'doe.sr.application:aboutTheCompany.period.label',
        defaultMessage: 'Veldu tímabil launagreiningar',
      },
      medium12months: {
        id: 'doe.sr.application:aboutTheCompany.period.medium12months',
        defaultMessage: 'Meðaltal á tólf mánaða tímabili',
      },
      oneMonth: {
        id: 'doe.sr.application:aboutTheCompany.period.oneMonth',
        defaultMessage: 'Einn mánuður undangenginna tólf mánaða',
      },
      month: {
        id: 'doe.sr.application:aboutTheCompany.period.month',
        defaultMessage: 'Veldu mánuð',
      },
      year: {
        id: 'doe.sr.application:aboutTheCompany.period.year',
        defaultMessage: 'Veldu ár',
      },
      january: {
        id: 'doe.sr.application:aboutTheCompany.period.january',
        defaultMessage: 'Janúar',
      },
      february: {
        id: 'doe.sr.application:aboutTheCompany.period.february',
        defaultMessage: 'Febrúar',
      },
      march: {
        id: 'doe.sr.application:aboutTheCompany.period.march',
        defaultMessage: 'Mars',
      },
      april: {
        id: 'doe.sr.application:aboutTheCompany.period.april',
        defaultMessage: 'Apríl',
      },
      may: {
        id: 'doe.sr.application:aboutTheCompany.period.may',
        defaultMessage: 'Maí',
      },
      june: {
        id: 'doe.sr.application:aboutTheCompany.period.june',
        defaultMessage: 'Júní',
      },
      july: {
        id: 'doe.sr.application:aboutTheCompany.period.july',
        defaultMessage: 'Júlí',
      },
      august: {
        id: 'doe.sr.application:aboutTheCompany.period.august',
        defaultMessage: 'Ágúst',
      },
      september: {
        id: 'doe.sr.application:aboutTheCompany.period.september',
        defaultMessage: 'September',
      },
      october: {
        id: 'doe.sr.application:aboutTheCompany.period.october',
        defaultMessage: 'Október',
      },
      november: {
        id: 'doe.sr.application:aboutTheCompany.period.november',
        defaultMessage: 'Nóvember',
      },
      december: {
        id: 'doe.sr.application:aboutTheCompany.period.december',
        defaultMessage: 'Desember',
      },
    }),
  },

  report: {
    section: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.section.sectionTitle',
        defaultMessage: 'Skýrsla',
      },
    }),
    personalData: defineMessages({
      title: {
        id: 'doe.sr.application:report.personalData.title',
        defaultMessage: 'Meðferð persónuupplýsinga',
      },
      intro: {
        id: 'doe.sr.application:report.personalData.intro',
        defaultMessage:
          'Vefsvæðið er öruggt og vinnur aðeins með auðkenni starfsmanna en ekki persónugreinanlegar upplýsingar, svo sem nöfn eða kennitölur. Skipulag vinnunnar skiptir því miklu máli og nauðsynlegt er að halda vel utan um öll gögn sem henni tengjast, auðkenni starfsmanna o.s.frv.. Ef það kemur til dæmis í ljós að þú þurfir að leiðrétta laun starfsmanns með auðkennið 10, þá viltu vita á auðveldan hátt hvaða starfsmann um ræðir.',
      },
    }),
    dataEntry: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.dataEntry.sectionTitle',
        defaultMessage: 'Gögn',
      },
      title: {
        id: 'doe.sr.application:report.dataEntry.title',
        defaultMessage: 'Gögn',
      },
      // This should be added when a third party connection is ready
      // Mælt er með því að stærri aðilar nýti Thirdparty eða sæki excel sniðmát.
      intro: {
        id: 'doe.sr.application:report.dataEntry.intro',
        defaultMessage:
          'Nú ertu í skýrslugjafarhluta kerfisins. Hér fyrir neðan velurðu þá leið sem þú vilt fara til að skila inn gögnum. Óháð því hvaða leið þú velur þá er góður undirbúningur grundvallaratriði starfaflokkunar. ',
      },
      instructions: {
        id: 'doe.sr.application:report.dataEntry.instructions',
        defaultMessage:
          'Í fullkomnum heimi fylgir launasetningin stigagjöf, þannig að hæstu stig gefa hæstu launin. Þegar launasetningin er gerð eftir ákveðnu kerfi þá er dregið úr hættu á mismunun. Öll störf eru metin eftir sömu þáttum og þá sést hvar laun víkja frá því sem starfsmatsstigin gefa til kynna, í báðar áttir, og þarfnast skýringa.',
      },
      downloadTemplateButton: {
        id: 'doe.sr.application:report.dataEntry.downloadTemplateButton',
        defaultMessage: 'Sækja sniðmát',
      },
      uploadButtonLabel: {
        id: 'doe.sr.application:report.dataEntry.uploadButtonLabel',
        defaultMessage: 'Hlaða upp skjali',
      },
      uploadCardTitle: {
        id: 'doe.sr.application:report.dataEntry.uploadCardTitle',
        defaultMessage: 'Excel skjal',
      },
      uploadCardIntro: {
        id: 'doe.sr.application:report.dataEntry.uploadCardIntro',
        defaultMessage:
          'Sæktu sniðmátið hér að ofan, fylltu út og hér hleður þú því upp. Gögnin flytjast sjálfkrafa inn í umsóknina.',
      },
      manualEntryCardTitle: {
        id: 'doe.sr.application:report.dataEntry.manualEntryCardTitle',
        defaultMessage: 'Handvirkur innsláttur',
      },
      manualEntryCardIntro: {
        id: 'doe.sr.application:report.dataEntry.manualEntryCardIntro',
        defaultMessage:
          'Skráðu gögnin beint í næstu skrefum umsóknarinnar án þess að nota Excel-skjal.',
      },
      manualEntryButtonLabel: {
        id: 'doe.sr.application:report.dataEntry.manualEntryButtonLabel',
        defaultMessage: 'Byrja innslátt',
      },
      importingLabel: {
        id: 'doe.sr.application:report.dataEntry.importingLabel',
        defaultMessage: 'Flyt inn skjal...',
      },
      importSuccess: {
        id: 'doe.sr.application:report.dataEntry.importSuccess',
        defaultMessage:
          'Skjalinu var hlaðið upp og launagreining fer fram í næsta skrefi.',
      },
      importSuccessContinueButton: {
        id: 'doe.sr.application:report.dataEntry.importSuccessContinueButton',
        defaultMessage: 'Halda áfram í launagreiningu',
      },
      importErrorTitle: {
        id: 'doe.sr.application:report.dataEntry.importErrorTitle',
        defaultMessage: 'Villa kom upp við úrvinnslu skjalsins',
      },
      importError: {
        id: 'doe.sr.application:report.dataEntry.importError',
        defaultMessage:
          'Villa kom upp við innflutning. Vinsamlegast reyndu aftur.',
      },
      invalidFileType: {
        id: 'doe.sr.application:report.dataEntry.invalidFileType',
        defaultMessage: 'Aðeins er hægt að hlaða upp Excel (.xlsx) skjölum.',
      },
      excelTemplateDownloadDescription: {
        id: 'doe.sr.application:report.dataEntry.excelTemplateDownloadDescription',
        defaultMessage:
          'Athugið að bein tenging við vefþjónustu Jafnréttisstofu er væntanleg.',
      },
    }),
    criteria: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.criteria.sectionTitle',
        defaultMessage: 'Yfirviðmið',
      },
      title: {
        id: 'doe.sr.application:report.criteria.title',
        defaultMessage: 'Yfirviðmið',
      },
      intro: {
        id: 'doe.sr.application:report.criteria.intro#markdown',
        defaultMessage:
          'Næstu skref fela í sér starfaflokkun. Valin eru viðmið, þeim gefið vægi og fjöldi þrepa ákveðinn. Því næst eru slegnar inn upplýsingar um starfsfólk og laun. Að því búnu eru störf og starfsfólk metið á grundvelli þeirra viðmiða sem valin voru. Þannig flokkast saman sömu eða jafnverðmæt störf. \n\n*        Ef persónubundnir þættir hafa áhrif á launasetningu þá skal meta alla starfsmenn á sama hátt samkvæmt viðeigandi við yfir- og undirviðmiðum.',
      },
      jobFactorTitle: {
        id: 'doe.sr.application:report.criteria.jobFactorTitle',
        defaultMessage: 'Yfirviðmið fyrir störf',
      },
      jobFactorIntro: {
        id: 'doe.sr.application:report.criteria.jobFactorIntro#markdown',
        defaultMessage:
          'Í þessu skrefi þarf að ákveða vægi (%) yfirviðmiða fyrir mat og flokkun á störfum. \n\n* Yfirviðmiðin fyrir störf eru ekki valkvæð, þau eru óbreytanleg. Samanlagt vægi starfsbundinna og einstaklingsbundinna yfirviðmiða er 100%. Að lágmarki skal meta störf út frá viðmiðum um ábyrgð, álag, hæfni og vinnuaðstæður.',
      },
      personalFactorTitle: {
        id: 'doe.sr.application:report.criteria.personalFactorTitle',
        defaultMessage: 'Yfirviðmið fyrir starfsfólk',
      },
      personalFactorIntro: {
        id: 'doe.sr.application:report.criteria.personalFactorIntro#markdown',
        defaultMessage:
          'Í þessu skrefi þarf að ákveða einstaklingsbundin yfirviðmið og vægi þeirra. \n\n* Ef einstaklingsbundin hæfni starfsfólks er metin til launa þá þarftu að ákveða hlutlæg og kynhlutlaus yfirviðmið fyrir þá hæfni. \n\n* Samanlagt vægi starfsbundinna og einstaklingsbundinna yfirviðmiða þarf að vera 100%. Þú getur bætt við yfirviðmiðum fyrir einstaklingsbundna þætti eftir því sem við á.',
      },
      personalFactorInstructions: {
        id: 'doe.sr.application:report.criteria.personalFactorInstructions',
        defaultMessage:
          'Viðmiðin fyrir einstaklingsbundna hæfni endurspegla það sem starfsfólki er sérstaklega umbunað fyrir í launum án þess að starfið geri kröfur um það. Svo sem menntun eða starfsreynsla umfram þær kröfur sem þarf til að sinna starfinu. Einfaldasta útskýringin er að yfirmaður kann að meta ákveðna þætti sem einstaklingurinn kemur með sér og hækkir því laun viðkomandi eftir ákveðnu kerfi. Allt starfsfólk situr hér við sama borð.',
      },
      weightLabel: {
        id: 'doe.sr.application:report.criteria.weightLabel',
        defaultMessage: 'Vægi',
      },
      criterionNameLabel: {
        id: 'doe.sr.application:report.criteria.criterionNameLabel',
        defaultMessage: 'Viðmið',
      },
      descriptionLabel: {
        id: 'doe.sr.application:report.criteria.descriptionLabel',
        defaultMessage: 'Lýsing',
      },
      deleteButton: {
        id: 'doe.sr.application:report.criteria.deleteButton',
        defaultMessage: 'Eyða',
      },
      addCriterionButton: {
        id: 'doe.sr.application:report.criteria.addCriterionButton',
        defaultMessage: 'Bæta við viðmiði',
      },
      weightSumError: {
        id: 'doe.sr.application:report.criteria.weightSumError',
        defaultMessage:
          'Vægi allra viðmiða verður að vera samtals 100% (núverandi: {total}%)',
      },
      deleteSaveError: {
        id: 'doe.sr.application:report.criteria.deleteSaveError',
        defaultMessage:
          'Ekki tókst að vista eyðingu viðmiðsins. Vinsamlegast reyndu aftur.',
      },
      retryButton: {
        id: 'doe.sr.application:report.criteria.retryButton',
        defaultMessage: 'Reyna aftur',
      },
    }),
    subCriteria: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.subCriteria.sectionTitle',
        defaultMessage: 'Undirviðmið',
      },
      title: {
        id: 'doe.sr.application:report.subCriteria.title',
        defaultMessage: 'Undirviðmið',
      },
      intro: {
        id: 'doe.sr.application:report.subCriteria.intro#markdown',
        defaultMessage:
          'Nú er komið að því að velja undirviðmið fyrir starfs- og einstaklingsbundna þætti.\n\nHér að neðan færðu dæmi um valkvæð undirviðmið sem eru algeng á vinnumarkaði en þú getur bætt við eigin viðmiðum eftir því sem við á. Öll viðmiðin sem valin eru þurfa að vera málefnaleg og í samræmi við starfsemina sem um ræðir.\n\nEinnig þarf að ákveða hve mörg þrep eru í boði fyrir hvert þeirra undirviðmiða sem valin eru. Velja þarf þrep fyrir bæði starfsbundin og einstaklingsbundin undirviðmið.\n\n Við val á fjölda þrepa er gott að horfa yfir sviðið og velta því fyrir sér hve mikil dreifing á hinum völdu þáttum er nauðsynleg til að gegna störfunum og ná fram markmiðunum með kjarnastarfseminni. Ef til dæmis undirviðmiðið menntun hefur verið valið undir hæfni, þá er gott að hugsa á hvaða skala menntunin þarf að vera.\n\n**Dæmi 1:** frá grunnskólaprófi og upp í doktorsgráðu.\n\n**Dæmi 2:** frá stúdentsprófi og til iðnmenntunar/grunnháskólagráðu.',
      },
      criterionWeightLabel: {
        id: 'doe.sr.application:report.subCriteria.criterionWeightLabel',
        defaultMessage: 'Vægi yfirviðmiðs: {weight}%',
      },
      // Shown next to the weight while the panel is COLLAPSED, so the red
      // header is never the only thing marking it as blocking.
      criterionWeightMismatchBadge: {
        id: 'doe.sr.application:report.subCriteria.criterionWeightMismatchBadge',
        defaultMessage: 'Vægi stemmir ekki',
      },
      catalogLabel: {
        id: 'doe.sr.application:report.subCriteria.catalogLabel',
        defaultMessage: 'Nota sniðmát',
      },
      catalogPlaceholder: {
        id: 'doe.sr.application:report.subCriteria.catalogPlaceholder',
        defaultMessage: 'Veldu sniðmát úr listanum',
      },
      nameLabel: {
        id: 'doe.sr.application:report.subCriteria.nameLabel',
        defaultMessage: 'Undirviðmið',
      },
      definitionLabel: {
        id: 'doe.sr.application:report.subCriteria.definitionLabel',
        defaultMessage: 'Skilgreining',
      },
      weightLabel: {
        id: 'doe.sr.application:report.subCriteria.weightLabel',
        defaultMessage: 'Vægi',
      },
      stepCountLabel: {
        id: 'doe.sr.application:report.subCriteria.stepCountLabel',
        defaultMessage: 'Fjöldi þrepa',
      },
      stepsLabel: {
        id: 'doe.sr.application:report.subCriteria.stepsLabel',
        defaultMessage: 'Þrep',
      },
      stepLabel: {
        id: 'doe.sr.application:report.subCriteria.stepLabel',
        defaultMessage: '{index}. þrep',
      },
      deleteButton: {
        id: 'doe.sr.application:report.subCriteria.deleteButton',
        defaultMessage: 'Eyða',
      },
      addButton: {
        id: 'doe.sr.application:report.subCriteria.addButton',
        defaultMessage: 'Bæta við undirviðmiði',
      },
      jobFactorGroupTitle: {
        id: 'doe.sr.application:report.subCriteria.jobFactorGroupTitle',
        defaultMessage: 'Undirviðmið fyrir störf',
      },
      jobFactorGroupIntro: {
        id: 'doe.sr.application:report.subCriteria.jobFactorGroupIntro#markdown',
        defaultMessage:
          'Í þessu skrefi þarf að ákveða undirviðmið fyrir störf, vægi (%) þeirra og fjölda þrepa sem í boði eru fyrir hvert þeirra. \n\n* Hér að neðan færðu dæmi um valkvæð undirviðmið sem eru algeng á vinnumarkaði og tillögur að skilgreiningum, en þú getur bætt við eigin viðmiðum eftir því sem við á. Öll viðmiðin sem valin eru þurfa að vera málefnaleg og viðeigandi fyrir starfsemina sem um ræðir.\n\n* Veldu vægi fyrir hvert undirviðmið þannig að þau nái að fullu upp í vægi hvers yfirviðmiðs.\n\n* Þú getur breytt textanum í boxunum eða búið til nýjan eftir því sem við á.',
      },
      personalFactorGroupTitle: {
        id: 'doe.sr.application:report.subCriteria.personalFactorGroupTitle',
        defaultMessage: 'Undirviðmið fyrir starfsfólk',
      },
      personalFactorGroupIntro: {
        id: 'doe.sr.application:report.subCriteria.personalFactorGroupIntro#markdown',
        defaultMessage:
          'Í þessu skrefi þarf að ákveða einstaklingsbundin undirviðmið, vægi þeirra og fjölda þrepa sem í boði eru fyrir hvert þeirra. \n\n* Hér að neðan færðu dæmi um valkvæð undirviðmið sem eru algeng á vinnumarkaði en þú getur bætt við eigin viðmiðum eftir því sem við á.\n\n* Veldu vægi fyrir hvert undirviðmið þannig að þau nái að fullu upp í vægi hvers yfirviðmiðs.\n\n* Þú getur breytt textanum í boxunum eða búið til nýjan eftir því sem við á.',
      },
      weightSumError: {
        id: 'doe.sr.application:report.subCriteria.weightSumError',
        defaultMessage:
          'Vægi undirviðmiða verður að vera samtals jafnt vægi yfirviðmiðsins ({expected}%) — núverandi samtals: {total}%',
      },
      deleteSaveError: {
        id: 'doe.sr.application:report.subCriteria.deleteSaveError',
        defaultMessage:
          'Ekki tókst að vista eyðingu undirviðmiðsins. Vinsamlegast reyndu aftur.',
      },
      retryButton: {
        id: 'doe.sr.application:report.subCriteria.retryButton',
        defaultMessage: 'Reyna aftur',
      },
    }),
    employees: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.employees.sectionTitle',
        defaultMessage: 'Innsetning gagna',
      },
      title: {
        id: 'doe.sr.application:report.employees.title',
        defaultMessage: 'Innsetning gagna',
      },
      intro: {
        id: 'doe.sr.application:report.employees.intro',
        defaultMessage:
          'Nú hefurðu skilgreint yfir- og undirviðmið og vægi þeirra fyrir mat og flokkun starfa. Næsta skref er að skrá allar upplýsingar um störf og starfsfólk og gefa upp öll laun og launaliði á völdu tímabili launagreiningar. Starfsheiti munu flytjast sjálfkrafa yfir á næstu síðu.\n\nAthugið að ef gögnum var hlaðið upp með Excel skjali ættu upplýsingar að hafa fyllst út sjálfkrafa.',
      },
      paginationPageLabel: {
        id: 'doe.sr.application:report.employees.paginationPageLabel',
        defaultMessage: 'Fara á síðu {page}',
      },
      nameColumn: {
        id: 'doe.sr.application:report.employees.nameColumn',
        defaultMessage: 'Auðkenni',
      },
      roleColumn: {
        id: 'doe.sr.application:report.employees.roleColumn',
        defaultMessage: 'Starf',
      },
      genderColumn: {
        id: 'doe.sr.application:report.employees.genderColumn',
        defaultMessage: 'Kyn',
      },
      // New id, not a renamed defaultMessage on the old `identifierLabel`: the
      // CMS translation for that id ("Auðkenni") wins over whatever is written
      // here, so the ordinal only gets a truthful label under an id Contentful
      // has never seen.
      ordinalLabel: {
        id: 'doe.sr.application:report.employees.ordinalLabel',
        defaultMessage: 'Númer starfsmanns',
      },
      fieldLabel: {
        id: 'doe.sr.application:report.employees.fieldLabel',
        defaultMessage: 'Svið',
      },
      departmentLabel: {
        id: 'doe.sr.application:report.employees.departmentLabel',
        defaultMessage: 'Deild',
      },
      startDateLabel: {
        id: 'doe.sr.application:report.employees.startDateLabel',
        defaultMessage: 'Ráðningardagsetning',
      },
      paidHoursLabel: {
        id: 'doe.sr.application:report.employees.paidHoursLabel',
        defaultMessage: 'Greiddar stundir',
      },
      baseSalaryLabel: {
        id: 'doe.sr.application:report.employees.baseSalaryLabel',
        defaultMessage: 'Grunnlaun',
      },
      additionalSalaryLabel: {
        id: 'doe.sr.application:report.employees.additionalSalaryLabel',
        defaultMessage: 'Viðbótarlaun',
      },
      bonusSalaryLabel: {
        id: 'doe.sr.application:report.employees.bonusSalaryLabel',
        defaultMessage: 'Aukagreiðslur',
      },
      // Icelandic labels below are best-guess mappings of the API fields —
      // adjust wording as needed.
      additionalFixedOvertimeLabel: {
        id: 'doe.sr.application:report.employees.additionalFixedOvertimeLabel',
        defaultMessage: 'Föst yfirvinna',
      },
      additionalFixedCarAllowanceLabel: {
        id: 'doe.sr.application:report.employees.additionalFixedCarAllowanceLabel',
        defaultMessage: 'Föst bifreiðahlunnindi',
      },
      bonusOccasionalCarAllowanceLabel: {
        id: 'doe.sr.application:report.employees.bonusOccasionalCarAllowanceLabel',
        defaultMessage: 'Tilfallandi bifreiðahlunnindi',
      },
      bonusOccasionalOvertimeLabel: {
        id: 'doe.sr.application:report.employees.bonusOccasionalOvertimeLabel',
        defaultMessage: 'Tilfallandi yfirvinna',
      },
      bonusPaymentsLabel: {
        id: 'doe.sr.application:report.employees.bonusPaymentsLabel',
        defaultMessage: 'Bónusgreiðslur',
      },
      bonusOtherLabel: {
        id: 'doe.sr.application:report.employees.bonusOtherLabel',
        defaultMessage: 'Aðrar greiðslur',
      },
      addButton: {
        id: 'doe.sr.application:report.employees.addButton',
        defaultMessage: 'Bæta við starfsmanni',
      },
      removeButton: {
        id: 'doe.sr.application:report.employees.removeButton',
        defaultMessage: 'Fjarlægja starfsmann',
      },
      editButton: {
        id: 'doe.sr.application:report.employees.editButton',
        defaultMessage: 'Breyta starfsmanni',
      },
      removeConfirmTitle: {
        id: 'doe.sr.application:report.employees.removeConfirmTitle',
        defaultMessage: 'Eyða starfsmanni',
      },
      removeConfirmDescription: {
        id: 'doe.sr.application:report.employees.removeConfirmDescription',
        defaultMessage:
          'Ertu viss um að þú viljir eyða þessum starfsmanni? Þessa aðgerð er ekki hægt að afturkalla.',
      },
      removeConfirmButton: {
        id: 'doe.sr.application:report.employees.removeConfirmButton',
        defaultMessage: 'Eyða',
      },
      addFormTitle: {
        id: 'doe.sr.application:report.employees.addFormTitle',
        defaultMessage: 'Nýr starfsmaður',
      },
      editFormTitle: {
        id: 'doe.sr.application:report.employees.editFormTitle',
        defaultMessage: 'Breyta starfsmanni',
      },
      genderInputLabel: {
        id: 'doe.sr.application:report.employees.genderInputLabel',
        defaultMessage: 'Kyn',
      },
      roleInputLabel: {
        id: 'doe.sr.application:report.employees.roleInputLabel',
        defaultMessage: 'Starf',
      },
      paidHoursInputLabel: {
        id: 'doe.sr.application:report.employees.paidHoursInputLabel',
        defaultMessage: 'Greiddar stundir í mánuði',
      },
      paidHoursPlaceholder: {
        id: 'doe.sr.application:report.employees.paidHoursPlaceholder',
        defaultMessage: 'T.d. 173,33',
      },
      paidHoursRangeError: {
        id: 'doe.sr.application:report.employees.paidHoursRangeError',
        defaultMessage:
          'Greiddar stundir þurfa að vera á bilinu 4–750. Skráðu fjölda greiddra stunda í mánuðinum, ekki starfshlutfall.',
      },
      saveButton: {
        id: 'doe.sr.application:report.employees.saveButton',
        defaultMessage: 'Vista starfsmann',
      },
      cancelButton: {
        id: 'doe.sr.application:report.employees.cancelButton',
        defaultMessage: 'Hætta við',
      },
    }),
    jobClassification: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.jobClassification.sectionTitle',
        defaultMessage: 'Starfsmat',
      },
      title: {
        id: 'doe.sr.application:report.jobClassification.title',
        defaultMessage: 'Starfsmat',
      },
      intro: {
        id: 'doe.sr.application:report.jobClassification.intro',
        defaultMessage:
          'Hér að neðan sérðu lista yfir öll þau störf sem þú skráðir inn í skrefinu á undan. Farðu vel yfir upplýsingarnar til þess að vera viss um að ekkert starf vanti. Þú hefur þegar ákveðið vægi fyrir hvert undirviðmið og fjölda þrepa. Næsta skref er að meta störfin með því að ákveða þrep fyrir hvert þeirra. Stig reiknast sjálfkrafa í samræmi við valin þrep.',
      },
      stigLabel: {
        id: 'doe.sr.application:report.jobClassification.stigLabel',
        defaultMessage: 'Þrep',
      },
      roleScore: {
        id: 'doe.sr.application:report.jobClassification.roleScore',
        defaultMessage: '{score}/{max} stig',
      },
      subCriterionInfo: {
        id: 'doe.sr.application:report.jobClassification.subCriterionInfo',
        defaultMessage: '{description} {weight}% = {max} stig',
      },
      noRolesMessage: {
        id: 'doe.sr.application:report.jobClassification.noRolesMessage',
        defaultMessage:
          'Engin störf til flokkunar. Þessi skjár er fyllt út sjálfkrafa út frá innsendu Excel-skjali — settu inn skjal á fyrsta skrefi til að flokka störf.',
      },
    }),
    employeeClassification: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:report.employeeClassification.sectionTitle',
        defaultMessage: 'Mat á einstaklingsbundinni hæfni starfsfólks',
      },
      title: {
        id: 'doe.sr.application:report.employeeClassification.title',
        defaultMessage: 'Mat á einstaklingsbundinni hæfni starfsfólks',
      },
      intro: {
        id: 'doe.sr.application:report.employeeClassification.intro',
        defaultMessage:
          'Hér að neðan sérðu lista yfir alla þá starfsmenn sem þú skráðir inn í kerfið. Farðu vel yfir upplýsingarnar til þess að vera viss um að engan starfsmann vanti. Þú hefur þegar ákveðið vægi fyrir hvert undirviðmið og fjölda þrepa. Næsta skref er að meta starfsfólk með því að ákveða þrep fyrir hvert þeirra. Stig reiknast sjálfkrafa í samræmi við valin þrep.',
      },
    }),
  },

  // Launagreining
  salaryAnalysis: {
    section: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:salaryAnalysis.section.sectionTitle',
        defaultMessage: 'Launagreining',
      },
    }),
    overview: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:salaryAnalysis.overview.sectionTitle',
        defaultMessage: 'Yfirlit',
      },
      title: {
        id: 'doe.sr.application:salaryAnalysis.overview.title',
        defaultMessage: 'Niðurstöður launagreiningar',
      },
      intro: {
        id: 'doe.sr.application:salaryAnalysis.overview.intro#markdown',
        defaultMessage:
          'Hér að neðan er yfirlit yfir niðurstöður launagreiningar. Launagreiningin byggir á innsetningu gagna og fyrirliggjandi starfsmati og flokkun starfa.',
      },
    }),
    improvementPlan: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:salaryAnalysis.improvementPlan.sectionTitle',
        defaultMessage: 'Úrbótaáætlun',
      },
      title: {
        id: 'doe.sr.application:salaryAnalysis.improvementPlan.title',
        defaultMessage: 'Úrbótaáætlun',
      },
      intro: {
        id: 'doe.sr.application:salaryAnalysis.improvementPlan.intro',
        defaultMessage:
          'Eftirfarandi starfsmenn bera leiðréttan launamun fyrirtækisins. Laun þeirra víkja frá því sem starfsmatsstig þeirra gefa til kynna. ',
      },
    }),
    results: defineMessages({
      analyzeButton: {
        id: 'doe.sr.application:salaryAnalysis.results.analyzeButton',
        defaultMessage: 'Reikna út',
      },
      recalculateButton: {
        id: 'doe.sr.application:salaryAnalysis.results.recalculateButton',
        defaultMessage: 'Reikna aftur',
      },
      reviewDataButton: {
        id: 'doe.sr.application:salaryAnalysis.results.reviewDataButton',
        defaultMessage: 'Yfirfara gögn í viðmóti',
      },
      analyzing: {
        id: 'doe.sr.application:salaryAnalysis.results.analyzing',
        defaultMessage: 'Reikna út launagreiningu...',
      },
      analyzeError: {
        id: 'doe.sr.application:salaryAnalysis.results.analyzeError',
        defaultMessage:
          'Villa kom upp við útreikning. Vinsamlegast reyndu aftur.',
      },
      totalsTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.totalsTitle',
        defaultMessage: 'Meðaltímakaup',
      },

      maleLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.maleLabel',
        defaultMessage: 'Meðaltímakaup karla',
      },
      femaleLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.femaleLabel',
        defaultMessage: 'Meðaltímakaup kvenna',
      },
      // Compliance is oskyrtWithinBenchmark, never the length of the list —
      // the previous copy pair ("frávik fundust" / "engin frávik fundust")
      // encoded exactly that inference and had to go.
      withinBenchmarkTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.withinBenchmarkTitle',
        defaultMessage: 'Leiðréttur launamunur er innan viðmiðs',
      },
      withinBenchmarkMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.withinBenchmarkMessage',
        defaultMessage:
          'Leiðréttur launamunur fyrirtækisins er innan viðmiðsins {benchmark}%.',
      },
      overBenchmarkTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.overBenchmarkTitle',
        defaultMessage: 'Leiðréttur launamunur er yfir viðmiði',
      },
      overBenchmarkMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.overBenchmarkMessage',
        defaultMessage:
          'Leiðréttur launamunur fyrirtækisins er yfir viðmiðinu {benchmark}%. {count, plural, one {# starfsmaður ber muninn og er talinn upp á næsta skrefi, Úrbótaáætlun.} other {# starfsmenn bera muninn og eru taldir upp á næsta skrefi, Úrbótaáætlun.}}',
      },
      overBenchmarkNoListTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.overBenchmarkNoListTitle',
        defaultMessage: 'Leiðréttur launamunur er yfir viðmiði',
      },
      overBenchmarkNoCarriersMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.overBenchmarkNoCarriersMessage',
        defaultMessage:
          'Leiðréttur launamunur fyrirtækisins er yfir viðmiðinu {benchmark}%. Greiningin finnur ekki afmarkaðan hóp starfsmanna sem ber muninn. Farðu vel yfir starfaflokkunina og innslegin gögn.',
      },
      overBenchmarkAllOvershootMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.overBenchmarkAllOvershootMessage',
        defaultMessage:
          'Leiðréttur launamunur fyrirtækisins er yfir viðmiðinu {benchmark}%. Greiningin finnur engan hóp starfsmanna þar sem leiðrétting launa kæmi muninum undir viðmiðið án þess að hann snerist við í hina áttina. Farðu vel yfir starfaflokkunina og innslegin gögn.',
      },
      notComputableTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.notComputableTitle',
        defaultMessage: 'Ekki er hægt að reikna leiðréttan launamun',
      },
      notComputableNoWomenMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.notComputableNoWomenMessage',
        defaultMessage:
          'Leiðréttur launamunur verður aðeins reiknaður þegar bæði kyn eru í gögnunum. Í þessari greiningu eru {male} karlar og engar konur.',
      },
      notComputableNoMenMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.notComputableNoMenMessage',
        defaultMessage:
          'Leiðréttur launamunur verður aðeins reiknaður þegar bæði kyn eru í gögnunum. Í þessari greiningu eru {female} konur og engir karlar.',
      },
      unknownTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.unknownTitle',
        defaultMessage: 'Niðurstaða launagreiningar liggur ekki fyrir',
      },
      unknownMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.unknownMessage',
        defaultMessage:
          'Ekki tókst að reikna leiðréttan launamun út frá þessum gögnum.',
      },
      noAnalysisMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.noAnalysisMessage',
        defaultMessage:
          'Launagreining hefur ekki verið keyrð fyrir þessi gögn.',
      },
      // Group headings for the two card rows.
      meanHourlyWageGroupTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.meanHourlyWageGroupTitle',
        defaultMessage: 'Meðaltímakaup',
      },
      wageGapGroupTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.wageGapGroupTitle',
        defaultMessage: 'Launamunur',
      },
      adjustedGapLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.adjustedGapLabel',
        defaultMessage: 'Leiðréttur launamunur',
      },
      benchmarkFootnote: {
        id: 'doe.sr.application:salaryAnalysis.results.benchmarkFootnote',
        defaultMessage: 'Viðmið: {benchmark}%',
      },
      rawGapSubtext: {
        id: 'doe.sr.application:salaryAnalysis.results.rawGapSubtext',
        defaultMessage: 'Óleiðréttur launamunur: {value}% {direction}.',
      },
      // Deliberately carries no figures: quantifying the shortfall implies the
      // exact pay changes this process never asks for. And it must not say the
      // rest of the gap sits with people the analysis cannot reach — the list
      // covers both sides of the line, so there is no unreachable group.
      overshootTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.overshootTitle',
        defaultMessage:
          'Launamunur helst yfir viðmiði þótt þessir starfsmenn séu skoðaðir',
      },
      overshootMessage: {
        id: 'doe.sr.application:salaryAnalysis.results.overshootMessage',
        defaultMessage:
          'Það nægir ekki að skoða þá starfsmenn sem taldir eru upp hér til að koma launamuninum undir viðmiðið. Skráðu engu að síður ástæður og fyrirhugaðar aðgerðir fyrir þá. Framvinda er metin á fyrirtækinu í heild í næstu skýrslu.',
      },
      // Soft warnings: the figures ARE computed, but shown caveated.
      warningsTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.warningsTitle',
        defaultMessage: 'Athugasemdir við útreikninginn',
      },
      warningRowsExcluded: {
        id: 'doe.sr.application:salaryAnalysis.results.warningRowsExcluded',
        defaultMessage:
          '{excluded} starfsmenn eru undanskildir í útreikningnum þar sem reglulegt tímakaup reiknaðist ekki hærra en núll. Kannaðu greiddar stundir og laun hjá þeim.',
      },
      warningNoScoreOverlap: {
        id: 'doe.sr.application:salaryAnalysis.results.warningNoScoreOverlap',
        defaultMessage:
          'Kynin skarast ekki á starfsmatsstigum, sem gerir samanburðinn óvissari.',
      },
      warningNoScoreVariation: {
        id: 'doe.sr.application:salaryAnalysis.results.warningNoScoreVariation',
        defaultMessage:
          'Starfsmatsstig eru þau sömu hjá öllum starfsmönnum, sem gerir samanburðinn óvissari.',
      },
      gapWithDirection: {
        id: 'doe.sr.application:salaryAnalysis.results.gapWithDirection',
        defaultMessage: '{value}% {direction}',
      },
      directionWomen: {
        id: 'doe.sr.application:salaryAnalysis.results.directionWomen',
        defaultMessage: 'konum í óhag',
      },
      directionMen: {
        id: 'doe.sr.application:salaryAnalysis.results.directionMen',
        defaultMessage: 'körlum í óhag',
      },
      directionNone: {
        id: 'doe.sr.application:salaryAnalysis.results.directionNone',
        defaultMessage: 'enginn munur',
      },
    }),
    chart: defineMessages({
      title: {
        id: 'doe.sr.application:salaryAnalysis.chart.title',
        defaultMessage: 'Dreifing tímakaups eftir starfsmatsstigum',
      },
      intro: {
        id: 'doe.sr.application:salaryAnalysis.chart.intro',
        defaultMessage:
          'Viðmiðunarlínan sýnir vænt tímakaup miðað við heildarstig. Launafrávik eru metin með hliðsjón af stöðu hvers starfsmanns gagnvart línunni. Úrbótaáætlun skal bæði ávarpa þau frávik sem eru yfir og undir uppgefnu viðmiði stjórnvalda frá viðmiðunarlínunni.',
      },
      xAxisLabel: {
        id: 'doe.sr.application:salaryAnalysis.chart.xAxisLabel',
        defaultMessage: 'Starfsmatsstig',
      },
      yAxisLabel: {
        id: 'doe.sr.application:salaryAnalysis.chart.yAxisLabel',
        defaultMessage: 'kr./klst.',
      },
      legendCurve: {
        id: 'doe.sr.application:salaryAnalysis.chart.legendCurve',
        defaultMessage: 'Vænt tímakaup',
      },
      legendMale: {
        id: 'doe.sr.application:salaryAnalysis.chart.legendMale',
        defaultMessage: 'Karlar',
      },
      legendNonMale: {
        id: 'doe.sr.application:salaryAnalysis.chart.legendNonMale',
        defaultMessage: 'Konur',
      },
    }),
    chartRegression: defineMessages({
      note: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.note',
        defaultMessage:
          'Viðmiðslínan sveigist vegna þess að vænt tímakaup hækkar um fast HLUTFALL á hvert stig, ekki fasta krónutölu — og hlutfallshækkun leggst við sjálfa sig. Í krónum verður hvert 100 stiga þrep því stærra en það síðasta.',
      },
      growthLabel: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.growthLabel',
        defaultMessage: 'Hækkun á hver 100 stig',
      },
      growthHint: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.growthHint',
        defaultMessage: 'Hlutfallsleg hækkun á væntanlegu tímakaupi',
      },
      atMeanLabel: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.atMeanLabel',
        defaultMessage: 'Vænt tímakaup við meðalstig',
      },
      atMeanHint: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.atMeanHint',
        defaultMessage: 'Punktur á línunni við meðalstig starfsmanna',
      },
      unavailable: {
        id: 'doe.sr.application:salaryAnalysis.chartRegression.unavailable',
        defaultMessage: 'Viðmiðunarlína ekki reiknanleg fyrir þessi gögn',
      },
    }),
    chartMarkedLegend: defineMessages({
      minimumSet: {
        id: 'doe.sr.application:salaryAnalysis.chartMarkedLegend.minimumSet',
        defaultMessage: 'Frávik',
      },
      abending: {
        id: 'doe.sr.application:salaryAnalysis.chartMarkedLegend.abending',
        defaultMessage: 'Ábending',
      },
    }),
    chartTooltip: defineMessages({
      employee: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.employee',
        defaultMessage: 'Starfsmaður',
      },
      gender: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.gender',
        defaultMessage: 'Kyn',
      },
      score: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.score',
        defaultMessage: 'Starfsmatsstig',
      },
      salary: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.salary',
        defaultMessage: 'Tímakaup',
      },
      expected: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.expected',
        defaultMessage: 'Vænt tímakaup',
      },
      deviation: {
        id: 'doe.sr.application:salaryAnalysis.chartTooltip.deviation',
        defaultMessage: 'Launafrávik',
      },
    }),
    components: defineMessages({
      heading: {
        id: 'doe.sr.application:salaryAnalysis.components.heading',
        defaultMessage: 'Viðbótarlaun og aukagreiðslur',
      },
      description: {
        id: 'doe.sr.application:salaryAnalysis.components.description',
        defaultMessage:
          'Meðaltal viðbótarlauna og aukagreiðslna á mánuði, eftir kyni. Krónur á mánuði — ekki tímakaup, og ekki deilt með greiddum stundum.',
      },
      genderHeader: {
        id: 'doe.sr.application:salaryAnalysis.components.genderHeader',
        defaultMessage: 'Kyn',
      },
      additionalHeader: {
        id: 'doe.sr.application:salaryAnalysis.components.additionalHeader',
        defaultMessage: 'Viðbótarlaun',
      },
      bonusHeader: {
        id: 'doe.sr.application:salaryAnalysis.components.bonusHeader',
        defaultMessage: 'Aukagreiðslur',
      },
      totalHeader: {
        id: 'doe.sr.application:salaryAnalysis.components.totalHeader',
        defaultMessage: 'Samtals',
      },
      male: {
        id: 'doe.sr.application:salaryAnalysis.components.male',
        defaultMessage: 'Karl',
      },
      female: {
        id: 'doe.sr.application:salaryAnalysis.components.female',
        defaultMessage: 'Kona/kynsegin',
      },
      overall: {
        id: 'doe.sr.application:salaryAnalysis.components.overall',
        defaultMessage: 'Allir',
      },
      gapRow: {
        id: 'doe.sr.application:salaryAnalysis.components.gapRow',
        defaultMessage: 'Hlutfallslegur munur',
      },
      empty: {
        id: 'doe.sr.application:salaryAnalysis.components.empty',
        defaultMessage: 'Engar viðbótarlaunagreiðslur skráðar',
      },
      gapHint: {
        id: 'doe.sr.application:salaryAnalysis.components.gapHint',
        defaultMessage:
          'Jákvæð tala merkir að meðaltal karla sé hærra fyrir liðinn. Ekki leiðrétt fyrir starfsmatsstigum og ekki borið við viðmið.',
      },
    }),
    payDispersion: defineMessages({
      heading: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.heading',
        defaultMessage: 'Ábendingar um launadreifingu',
      },
      intro: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.intro',
        defaultMessage:
          'Laun þessara starfsmanna víkja meira frá starfsmatsstigum þeirra en launadreifing fyrirtækisins skýrir.',
      },
      noObligation: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.noObligation',
        defaultMessage:
          'Eftirfarandi frávik skera sig úr og eru yfir eða undir uppgefnu viðmiði stjórnvalda frá viðmiðunarlínu. Þar sem kynbundinn launamunur mælist ekki í launagreiningu er ekki gerð krafa um skýringar eða skráningu. Hins vegar er bent á að launasetning þessa starfsfólks gæti þurft nánari skoðun innanhúss.',
      },
      spreadNote: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.spreadNote',
        defaultMessage:
          'Dæmigerð dreifing um línuna hjá þessu fyrirtæki er {down} til {up}. Hér eru starfsmenn sem víkja {threshold} staðalvik eða meira frá henni.',
      },
      allClear: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.allClear',
        defaultMessage:
          'Engar ábendingar — laun engra starfsmanna víkja meira frá starfsmatsstigum sínum en launadreifing fyrirtækisins skýrir.',
      },
      blockerCohortTooSmall: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.blockerCohortTooSmall',
        defaultMessage:
          'Of fáir starfsmenn til að meta launadreifingu áreiðanlega — það þarf að minnsta kosti 12.',
      },
      blockerNoScoreVariation: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.blockerNoScoreVariation',
        defaultMessage:
          'Öll starfsmatsstig eru eins, því liggur ekkert vænt tímakaup fyrir til að víkja frá.',
      },
      blockerGapNotComputable: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.blockerGapNotComputable',
        defaultMessage:
          'Launadreifing verður ekki metin því ekki var unnt að reikna vænt tímakaup.',
      },
      // Every other column of this table reads its header from the
      // `outlierGroup` namespace, so the two tables cannot be translated apart —
      // see the note in PayDispersionTable. This is the one column the
      // úrbótaáætlun table does not have.
      spreadHeader: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.spreadHeader',
        defaultMessage: 'Staðalvik frá línu',
      },
      genderMale: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.genderMale',
        defaultMessage: 'Karl',
      },
      genderFemale: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.genderFemale',
        defaultMessage: 'Kona',
      },
      genderNeutral: {
        id: 'doe.sr.application:salaryAnalysis.payDispersion.genderNeutral',
        defaultMessage: 'Kynsegin',
      },
    }),
    outlierGroup: defineMessages({
      ordinalColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.ordinalColumn',
        defaultMessage: '#',
      },
      // The bare ordinal only reads as an identifier if the applicant knows it
      // is the same number they saw on the earlier screens and in the workbook.
      employeeColumnTooltip: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.employeeColumnTooltip',
        defaultMessage:
          'Númer starfsmanns (#) samsvarar númeri í einstaklingsmati, innsetningu gagna og eða excel skjali',
      },
      roleColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.roleColumn',
        defaultMessage: 'Starf',
      },
      genderColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.genderColumn',
        defaultMessage: 'Kyn',
      },
      // New id, not a new defaultMessage on the old one: the CMS translation for
      // `scoreColumn` ("Stigaflokkur") wins over whatever is written here, so a
      // renamed header only takes effect under an id Contentful has never seen.
      stigColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.stigColumn',
        defaultMessage: 'Stig',
      },
      hourlyWageColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.hourlyWageColumn',
        defaultMessage: 'Reglulegt tímakaup',
      },
      expectedHourlyWageColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.expectedHourlyWageColumn',
        defaultMessage: 'Vænt tímakaup',
      },
      wageUnitFootnote: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.wageUnitFootnote',
        defaultMessage: 'Tímakaup er sýnt í kr./klst.',
      },
      deviationColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.deviationColumn',
        defaultMessage: 'Frávik',
      },
      deviationCell: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.deviationCell',
        defaultMessage: '{sign}{value}% ({status})',
      },
      payStatusUnderpaid: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.payStatusUnderpaid',
        defaultMessage: 'undir',
      },
      payStatusOverpaid: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.payStatusOverpaid',
        defaultMessage: 'yfir',
      },
      payStatusOnLine: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.payStatusOnLine',
        defaultMessage: 'á línu',
      },
      groupPromptBelow: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupPromptBelow',
        defaultMessage:
          'Laun þessara starfsmanna eru undir því sem starfsmatsstig þeirra gefa til kynna. Skráðu ástæður og fyrirhugaðar aðgerðir.',
      },
      groupPromptAbove: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupPromptAbove',
        defaultMessage:
          'Laun þessara starfsmanna eru yfir því sem starfsmatsstig þeirra gefa til kynna. Skráðu ástæður og fyrirhugaðar aðgerðir. Ef starfsmatið vanmetur störfin er úrbótin að endurskoða matið.',
      },
      groupPromptMixed: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupPromptMixed',
        defaultMessage:
          'Í þessum hópi eru bæði starfsmenn sem eru yfir og starfsmenn sem eru undir því sem starfsmatsstig þeirra gefa til kynna. Skráðu ástæður og fyrirhugaðar aðgerðir.',
      },
      groupPromptNeutral: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupPromptNeutral',
        defaultMessage:
          'Skráðu ástæður og fyrirhugaðar aðgerðir fyrir þennan hóp.',
      },
      postponeCardTitle: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.postponeCardTitle',
        defaultMessage: 'Fresta skilum á úrbótaáætlun',
      },
      postponeCardDescription: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.postponeCardDescription',
        defaultMessage:
          'Hægt er að skila úrbótaáætlun innan þriggja mánaða frá því að skýrslan er send inn.',
      },
      postponeCheckboxLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.postponeCheckboxLabel',
        defaultMessage: 'Ég vil skila úrbótaáætlun innan þriggja mánaða',
      },
      nameLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.nameLabel',
        defaultMessage: 'Heiti hóps',
      },
      reasonLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.reasonLabel',
        defaultMessage: 'Ástæða frávika',
      },
      actionLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.actionLabel',
        defaultMessage: 'Fyrirhugaðar úrbætur',
      },
      remedyDateLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.remedyDateLabel',
        defaultMessage: 'Dagsetning úrbóta',
      },
      // The API rejects a date outside this window, so the bound is stated
      // rather than left for the applicant to discover from a rejected submit.
      remedyDateDescription: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.remedyDateDescription',
        defaultMessage:
          'Dagsetning úrbóta á við um hvenær úrbótum skal vera lokið. Dagsetningin þarf að vera í framtíðinni og ekki meira en þrjú ár fram í tímann.',
      },
      signatureNameLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.signatureNameLabel',
        defaultMessage: 'Nafn ábyrgðaraðila',
      },
      signatureRoleLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.signatureRoleLabel',
        defaultMessage: 'Starfstitill ábyrgðaraðila',
      },
      tableTitle: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.tableTitle',
        defaultMessage: 'Frávikatafla',
      },
      tableText: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.tableText#markdown',
        defaultMessage:
          'Taflan sýnir frávik launagreiningar. Nauðsynlegt er að gera úrbótaáætlun fyrir hvert frávik. Hægt er að velja mörg frávik saman og gera sameiginlega úrbótaáætlun fyrir þann hóp. Einnig er hægt að velja eitt frávik. Þegar frávik hefur verið sett í hóp hverfur það úr töflunni. Athugið að hvert frávik þarf að vera hluti af frávikahópi.',
      },
      createGroupButton: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.createGroupButton',
        defaultMessage: 'Setja í frávikahóp',
      },
      // Only shown once at least one group exists: the button then opens a
      // menu of the existing groups plus this entry, instead of silently
      // always creating a new group.
      assignToNewGroup: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.assignToNewGroup',
        defaultMessage: 'Nýr frávikahópur',
      },
      assignToGroupMenuLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.assignToGroupMenuLabel',
        defaultMessage: 'Veldu frávikahóp',
      },
      // The one select-everything control, replacing the per-page checkbox the
      // table header used to carry. `{count}` is the rows still in the table,
      // so it falls as outliers are assigned into groups and leave it.
      selectAllOutliersButton: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectAllOutliersButton',
        defaultMessage: 'Velja öll ({count})',
      },
      // Same button once everything is selected: it is the only way back from a
      // select-all short of unticking each row.
      deselectAllOutliersButton: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.deselectAllOutliersButton',
        defaultMessage: 'Afvelja öll ({count})',
      },
      // Neuter singular takes "valið", plural "valin" — and Icelandic counts 21
      // and 31 as singular while 11 stays plural, which is exactly CLDR's `one`
      // category for `is`, so ICU gets this right and a manual n === 1 would
      // not.
      selectedOutlierCount: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectedOutlierCount',
        defaultMessage:
          '{count, plural, one {# frávik valið} other {# frávik valin}}',
      },
      // Both select-all controls carry no visible label — the header one is a
      // bare checkbox in its column — so they need an explicit accessible name.
      selectAllLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectAllLabel',
        defaultMessage: 'Velja öll frávik',
      },
      // The per-row checkbox carries no visible label — its column is just a
      // checkbox — so it needs an explicit accessible name.
      selectEmployeeLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectEmployeeLabel',
        defaultMessage: 'Velja starfsmann {employee}',
      },
      groupHeading: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupHeading',
        defaultMessage: 'Frávikahópur',
      },
      defaultGroupName: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.defaultGroupName',
        defaultMessage: 'Sjálfgefinn hópur {index}',
      },
      // New id rather than new copy on `groupMembers`: a CMS translation keyed
      // to the old id would win over whatever is written here, and this line
      // now carries a count instead of the member list — see stigColumn.
      groupMemberCount: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupMemberCount',
        defaultMessage: 'Fjöldi starfsmanna í hópi',
      },
      // New id, not new copy on the retired `groupMembers`: a CMS translation
      // keyed to the old id would win over what is written here.
      groupMembersLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupMembersLabel',
        defaultMessage: 'Starfsmenn í hópi',
      },
      removeMemberLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.removeMemberLabel',
        defaultMessage: 'Taka starfsmann {employee} úr hópnum',
      },
      removeGroupButton: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.removeGroupButton',
        defaultMessage: 'Fjarlægja hóp',
      },
      unassignedWarning: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.unassignedWarning',
        defaultMessage:
          'Öll frávik þurfa að vera hluti af frávikahópi til að halda áfram.',
      },
      incompleteGroupWarning: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.incompleteGroupWarning',
        defaultMessage:
          'Fylla þarf út allar upplýsingar fyrir hvern frávikahóp til að halda áfram.',
      },
      // Shown on the review screens in place of the submit button, which
      // ScreenFooter drops entirely when its action condition is false — with
      // no explanation of its own.
      reviewIncompleteTitle: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.reviewIncompleteTitle',
        defaultMessage: 'Úrbótaáætlun er ekki tilbúin til innsendingar',
      },
      reviewIncompleteMessage: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.reviewIncompleteMessage',
        defaultMessage:
          'Öll frávik þurfa að tilheyra frávikahópi og fylla þarf út allar upplýsingar fyrir hvern hóp. Farðu aftur á skrefið Úrbótaáætlun til að ljúka við hana.',
      },
    }),
  },

  overview: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit',
    },
    title: {
      id: 'doe.sr.application:overview.title',
      defaultMessage: 'Yfirlit skýrslugjafar',
    },
    intro: {
      id: 'doe.sr.application:overview.intro',
      defaultMessage:
        'Hér að neðan sérðu yfirlit yfir skýrslugjöfina sem þú hefur fyllt út. Vinsamlegast farðu vel yfir gögnin og athugaðu hvort þau séu rétt áður en þú sendir inn skýrsluna.',
    },
    chiefExecutiveJobTitleLabel: {
      id: 'doe.sr.application:overview.chiefExecutiveJobTitleLabel',
      defaultMessage: 'Starfstitill æðsta stjórnanda',
    },
    periodLabel: {
      id: 'doe.sr.application:overview.periodLabel',
      defaultMessage: 'Tímabil launagreiningar',
    },
    companyInfo: {
      id: 'doe.sr.application:overview.companyInfo',
      defaultMessage: 'Fyrirtæki',
    },
    chiefExecutive: {
      id: 'doe.sr.application:overview.chiefExecutive',
      defaultMessage: 'Æðsti stjórnandi',
    },
    contactPerson: {
      id: 'doe.sr.application:overview.contactPerson',
      defaultMessage: 'Tengiliður',
    },
    salaryAnalysisTitle: {
      id: 'doe.sr.application:overview.salaryAnalysisTitle',
      defaultMessage: 'Launagreining',
    },
    adjustedGapLabel: {
      id: 'doe.sr.application:overview.adjustedGapLabel',
      defaultMessage: 'Leiðréttur launamunur',
    },
    // The direction word is selected inside the message rather than composed
    // from results.directionWomen/Men: an overview `items` callback gets no
    // formatMessage, so a nested descriptor could not be resolved there.
    adjustedGapValue: {
      id: 'doe.sr.application:overview.adjustedGapValue',
      defaultMessage:
        '{value}% {direction, select, FEMALE {í óhag kvenna} MALE {í óhag karla} other {enginn munur}}',
    },
    improvementPlanNeededLabel: {
      id: 'doe.sr.application:overview.improvementPlanNeededLabel',
      defaultMessage: 'Er úrbótaáætlunar þörf?',
    },
    withinBenchmarkLabel: {
      id: 'doe.sr.application:overview.withinBenchmarkLabel',
      defaultMessage: 'Er launamunur undir viðmiði?',
    },
    // Neither Já nor Nei: a single-gender workforce has no measurable gap, and
    // an absent analysis has no verdict at all — see WageGapState.
    withinBenchmarkNotComputable: {
      id: 'doe.sr.application:overview.withinBenchmarkNotComputable',
      defaultMessage: 'Ekki reiknanlegt',
    },
    withinBenchmarkUnknown: {
      id: 'doe.sr.application:overview.withinBenchmarkUnknown',
      defaultMessage: 'Liggur ekki fyrir',
    },
    outlierPlanTitle: {
      id: 'doe.sr.application:overview.outlierPlanTitle',
      defaultMessage: 'Yfirlit úrbótaáætlunar',
    },
    postponeLabel: {
      id: 'doe.sr.application:overview.postponeLabel',
      defaultMessage: 'Fresta úrbótaáætlun?',
    },
    submitButton: {
      id: 'doe.sr.application:overview.submitButton',
      defaultMessage: 'Senda inn',
    },
  }),

  inReview: defineMessages({
    tagLabel: {
      id: 'doe.sr.application:inReview.tagLabel',
      defaultMessage: 'Í vinnslu hjá ritstjórn',
    },
    sectionTitle: {
      id: 'doe.sr.application:inReview.sectionTitle',
      defaultMessage: 'Innsending móttekin',
    },
    formTitle: {
      id: 'doe.sr.application:inReview.formTitle',
      defaultMessage: 'Takk fyrir innsendinguna',
    },
    alertTitle: {
      id: 'doe.sr.application:inReview.alertTitle',
      defaultMessage:
        'Jafnréttisstofa hefur móttekið skýrslugjöf um kynbundinn launamun með úrbótaáætlun.',
    },
    expandableIntro: {
      id: 'doe.sr.application:inReview.expandableIntro',
      defaultMessage: 'Úrbótaáætlunin er háð samþykki Jafnréttisstofu.',
    },
    expandableDescription: {
      id: 'doe.sr.application:inReview.expandableDescription#markdown',
      defaultMessage:
        '* Fyrirliggjandi úrbótaáætlun verður yfirfarin af Jafnréttisstofu.\n* Athugasemdir og ábendingar eru sendar í gegnum tölvupóst.\n* Næsta skýrslugjöf fer fram að þrem árum liðnum og þarf þá úrbótaáætlun að vera að fullu framkvæmd.\n* Þú færð áminningu frá okkur þegar sex mánuður eru í næstu skil.\n\nSkýrslugjöfin tryggir upplýstar, gagnsæjar og ábyrgar launaákvarðanir.',
    },
    // Used when the analysis listed no outliers, so no úrbótaáætlun was
    // required — the three strings above all speak of a plan that does not
    // exist in that case. Deliberately does not claim the gap was within the
    // benchmark: an empty outlier list does not mean compliance (see
    // WageGapState), only that there was nothing to explain.
    alertTitleNoPlan: {
      id: 'doe.sr.application:inReview.alertTitleNoPlan',
      defaultMessage:
        'Jafnréttisstofa hefur móttekið skýrslugjöf um kynbundinn launamun.',
    },
    expandableIntroNoPlan: {
      id: 'doe.sr.application:inReview.expandableIntroNoPlan',
      defaultMessage: 'Skýrslan verður yfirfarin af Jafnréttisstofu.',
    },
    expandableDescriptionNoPlan: {
      id: 'doe.sr.application:inReview.expandableDescriptionNoPlan#markdown',
      defaultMessage:
        '* Ekki var þörf á úrbótaáætlun í þessari skýrslugjöf.\n* Athugasemdir og ábendingar eru sendar í gegnum tölvupóst.\n* Næsta skýrslugjöf fer fram að þrem árum liðnum.\n* Þú færð áminningu frá okkur þegar sex mánuðir eru í næstu skil.\n\nSkýrslugjöfin tryggir upplýstar, gagnsæjar og ábyrgar launaákvarðanir.',
    },
    sentHistoryLog: {
      id: 'doe.sr.application:inReview.sentHistoryLog',
      defaultMessage: 'Launagreiningarskýrsla innsend',
    },
    approvedHistoryLog: {
      id: 'doe.sr.application:inReview.approvedHistoryLog',
      defaultMessage: 'Launagreiningarskýrsla samþykkt',
    },
    rejectedHistoryLog: {
      id: 'doe.sr.application:inReview.rejectedHistoryLog',
      defaultMessage: 'Launagreiningarskýrsla hafnað',
    },
    editHistoryLog: {
      id: 'doe.sr.application:inReview.editHistoryLog',
      defaultMessage: 'Athugasemd frá Jafnréttisstofu',
    },
  }),

  comments: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:comments.sectionTitle',
      defaultMessage: 'Athugasemdir',
    },
    title: {
      id: 'doe.sr.application:comments.title',
      defaultMessage: 'Athugasemdir',
    },
    emptyState: {
      id: 'doe.sr.application:comments.emptyState',
      defaultMessage: 'Engar athugasemdir hafa verið sendar.',
    },
    textareaLabel: {
      id: 'doe.sr.application:comments.textareaLabel',
      defaultMessage: 'Athugasemd',
    },
    placeholder: {
      id: 'doe.sr.application:comments.placeholder',
      defaultMessage: 'Bættu við athugasemd',
    },
    replyButton: {
      id: 'doe.sr.application:comments.replyButton',
      defaultMessage: 'Svara athugasemd',
    },
    sendButton: {
      id: 'doe.sr.application:comments.sendButton',
      defaultMessage: 'Senda athugasemd',
    },
    cancelButton: {
      id: 'doe.sr.application:comments.cancelButton',
      defaultMessage: 'Hætta við',
    },
    seeAllComments: {
      id: 'doe.sr.application:comments.seeAllComments',
      defaultMessage: 'Sjá allar athugasemdir',
    },
    registersComment: {
      id: 'doe.sr.application:comments.registersComment',
      defaultMessage: 'skráir athugasemd',
    },
    reviewerLabel: {
      id: 'doe.sr.application:comments.reviewerLabel',
      defaultMessage: 'Jafnréttisstofa',
    },
    companyLabel: {
      id: 'doe.sr.application:comments.companyLabel',
      defaultMessage: 'Þú',
    },
    today: {
      id: 'doe.sr.application:comments.today',
      defaultMessage: 'Í dag',
    },
    yesterday: {
      id: 'doe.sr.application:comments.yesterday',
      defaultMessage: 'Í gær',
    },
    daysAgo: {
      id: 'doe.sr.application:comments.daysAgo',
      defaultMessage: 'f. {days} dögum',
    },
    sendError: {
      id: 'doe.sr.application:comments.sendError',
      defaultMessage: 'Ekki tókst að senda athugasemd, reyndu aftur.',
    },
    loadError: {
      id: 'doe.sr.application:comments.loadError',
      defaultMessage: 'Ekki tókst að sækja athugasemdir, reyndu aftur.',
    },
  }),

  rejected: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:rejected.sectionTitle',
      defaultMessage: 'Hafnað',
    },
    formTitle: {
      id: 'doe.sr.application:rejected.formTitle',
      defaultMessage: 'Skýrslugjöf hafnað',
    },
    title: {
      id: 'doe.sr.application:rejected.title',
      defaultMessage: 'Skýrslugjöf hafnað',
    },
    description: {
      id: 'doe.sr.application:rejected.description',
      defaultMessage: 'Skýrslugjöfinni þinni hefur verið hafnað.',
    },
  }),

  postponed: defineMessages({
    tagLabel: {
      id: 'doe.sr.application:postponed.tagLabel',
      defaultMessage: 'Úrbótaáætlun frestað',
    },
    introSectionTitle: {
      id: 'doe.sr.application:postponed.introSectionTitle',
      defaultMessage: 'Innsending móttekin',
    },
    introTitle: {
      id: 'doe.sr.application:postponed.introTitle',
      defaultMessage: 'Takk fyrir innsendinguna',
    },
    introDescription: {
      id: 'doe.sr.application:postponed.introDescription',
      defaultMessage:
        'Takk fyrir að skila launaskýrslunni til Jafnréttisstofu. Þú valdir að fresta útskýringu á launamun sem greindist í frávikum. Þú hefur þrjá mánuði frá því að skýrslan var send inn til að skila úrbótaáætlun.',
    },
    alertTitle: {
      id: 'doe.sr.application:postponed.alertTitle',
      defaultMessage: 'Úrbótaáætlun frestað',
    },
    expandableHeader: {
      id: 'doe.sr.application:postponed.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
    },
    expandableIntro: {
      id: 'doe.sr.application:postponed.expandableIntro',
      defaultMessage:
        'Málið verður tekið til afgreiðslu þegar úrbótaáætlun berst.',
    },
    expandableDescription: {
      id: 'doe.sr.application:postponed.expandableDescription#markdown',
      defaultMessage:
        '* Veittir eru þrír mánuðir til þess að skila úrbótaáætlun.\n* Úrbótaáætlun er háð samþykki Jafnréttisstofu.\n* Næsta skýrslugjöf fer fram að þremur árum liðnum frá þessum skilum og þarf þá úrbótaáætlun að vera að fullu framkvæmd.\n\nUpplýsingar og leiðbeiningar við gerð úrbótaáætlana er að finna á heimasíðu Jafnréttisstofu: https://jafnretti.is',
    },
    reportSummarySectionTitle: {
      id: 'doe.sr.application:postponed.reportSummarySectionTitle',
      defaultMessage: 'Skýrsla',
    },
    reportSummaryTitle: {
      id: 'doe.sr.application:postponed.reportSummaryTitle',
      defaultMessage: 'Yfirlit innsendrar skýrslu',
    },
    reviewTitle: {
      id: 'doe.sr.application:postponed.reviewTitle',
      defaultMessage: 'Yfirlit úrbótaáætlunar',
    },
    intro: {
      id: 'doe.sr.application:postponed.intro',
      defaultMessage:
        'Staðfestu að úrbótaáætlunin sé rétt útfyllt og sendu hana inn til Jafnréttisstofu.',
    },
    submitButton: {
      id: 'doe.sr.application:postponed.submitButton',
      defaultMessage: 'Senda inn úrbótaáætlun',
    },
    pendingActionTitle: {
      id: 'doe.sr.application:postponed.pendingActionTitle',
      defaultMessage: 'Beðið er eftir úrbótaáætlun',
    },
    pendingActionContent: {
      id: 'doe.sr.application:postponed.pendingActionContent',
      defaultMessage:
        'Farðu yfir frávikin og skilaðu úrbótaáætlun til Jafnréttisstofu.',
    },
    pendingActionButton: {
      id: 'doe.sr.application:postponed.pendingActionButton',
      defaultMessage: 'Halda áfram',
    },
  }),

  draftRetry: defineMessages({
    tagLabel: {
      id: 'doe.sr.application:draftRetry.tagLabel',
      defaultMessage: 'Þín bíða athugasemdir',
    },
    aboutTheCompanySectionTitle: {
      id: 'doe.sr.application:draftRetry.aboutTheCompanySectionTitle',
      defaultMessage: 'Upplýsingar um fyrirtækið',
    },
    reportSectionTitle: {
      id: 'doe.sr.application:draftRetry.reportSectionTitle',
      defaultMessage: 'Skýrsla',
    },
    reportSummarySectionTitle: {
      id: 'doe.sr.application:draftRetry.reportSummarySectionTitle',
      defaultMessage: 'Yfirlit skýrslu',
    },
    reportSummaryTitle: {
      id: 'doe.sr.application:draftRetry.reportSummaryTitle',
      defaultMessage: 'Yfirlit innsendrar skýrslu',
    },
    submitButton: {
      id: 'doe.sr.application:draftRetry.submitButton',
      defaultMessage: 'Senda inn aftur',
    },
    pendingActionTitle: {
      id: 'doe.sr.application:draftRetry.pendingActionTitle',
      defaultMessage: 'Beðið er eftir lagfæringu',
    },
    pendingActionContent: {
      id: 'doe.sr.application:draftRetry.pendingActionContent',
      defaultMessage:
        'Farðu yfir athugasemdir frá Jafnréttisstofu og lagfærðu úrbótaáætlunina.',
    },
    pendingActionButton: {
      id: 'doe.sr.application:draftRetry.pendingActionButton',
      defaultMessage: 'Halda áfram',
    },
  }),

  historyLogs: defineMessages({
    postponed: {
      id: 'doe.sr.application:historyLogs.postponed',
      defaultMessage: 'Úrbótaáætlun frestað',
    },
    draftRetry: {
      id: 'doe.sr.application:historyLogs.draftRetry',
      defaultMessage: 'Úrbótaáætlun lagfærð og send aftur',
    },
  }),
}
