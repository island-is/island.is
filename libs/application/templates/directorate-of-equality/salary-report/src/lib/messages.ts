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
    invalidNonNegativeNumber: {
      id: 'doe.sr.application:errors.invalidNonNegativeNumber',
      defaultMessage: 'Talan verður að vera 0 eða hærri',
    },
    duplicateSubsidiary: {
      id: 'doe.sr.application:errors.duplicateSubsidiary',
      defaultMessage: 'Þetta dótturfélag er þegar á listanum',
    },
    duplicateCriterionTitle: {
      id: 'doe.sr.application:errors.duplicateCriterionTitle',
      defaultMessage: 'Þáttur með þessu heiti er þegar á listanum',
    },
    duplicateSubCriterionTitle: {
      id: 'doe.sr.application:errors.duplicateSubCriterionTitle',
      defaultMessage: 'Undirþáttur með þessu heiti er þegar á listanum',
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
  }),

  general: defineMessages({
    applicationName: {
      id: 'doe.sr.application:general.applicationName',
      defaultMessage: 'Skýrslugjöf',
    },
    institution: {
      id: 'doe.sr.application:general.institution',
      defaultMessage: 'Jafnréttisstofa',
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
        'Þú þarft að vera með gilda jafnréttisáætlun til þess að senda inn launagreiningu.',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:approved.sectionTitle',
      defaultMessage: 'Samþykkt',
    },
    title: {
      id: 'doe.sr.application:approved.title',
      defaultMessage: 'Umsókn samþykkt',
    },
    description: {
      id: 'doe.sr.application:approved.description',
      defaultMessage: 'Umsókn þín hefur verið samþykkt.',
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
          'Nafn fyrirtækis, kennitala, heimilisfang og fleiri upplýsingar.',
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
          'Tengiliður er sá aðili sem ber ábyrgð á skýrslugjöfinni auk stjórnanda. Við höfum samskipti við tengiliðinn svo mikilvægt er að hann sé með á nótunum.',
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
    employeeCount: defineMessages({
      sectionTitle: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.sectionTitle',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      title: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      intro: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.intro',
        defaultMessage:
          'Forskráðar upplýsingar um starfsmannafjölda koma frá Skattinum í janúar ár hvert. Hér að neðan er hins vegar beðið um upplýsingar um þann fjölda starfsmanna sem skýrslugjöfin nær utan um, þ.e. þann fjölda sem fékk útborguð laun á tímabili launagreiningar.',
      },
      women: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.women',
        defaultMessage: 'Konur',
      },
      men: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.men',
        defaultMessage: 'Karlar',
      },
      nonBinary: {
        id: 'doe.sr.application:aboutTheCompany.employeeCount.nonBinary',
        defaultMessage: 'Kynsegin',
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
          'Hægt er að skila inn einni áætlun fyrir móður- og dótturfyrirtæki.',
      },
      includesSubsidiariesTitle: {
        id: 'doe.sr.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
        defaultMessage: 'Nær launaskýrsla einnig til dótturfyrirtækja?',
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
        defaultMessage:
          'Einn mánuður undangenginna tólf mánaða (mælt er með því að velja mánuð þar sem ekki var mikið um óhefðbundin laun, t.d. leiðréttingar, uppgjör vegna starfsloka eða slíks)',
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
        defaultMessage: 'Innsláttur gagna',
      },
      title: {
        id: 'doe.sr.application:report.dataEntry.title',
        defaultMessage: 'Innsláttur gagna',
      },
      // This should be added when a third party connection is ready
      // Mælt er með því að stærri aðilar nýti Thirdparty eða sæki excel sniðmát.
      intro: {
        id: 'doe.sr.application:report.dataEntry.intro',
        defaultMessage:
          'Nú ertu í skýrslugjafarhluta kerfisins. Hér fyrir neðan velurðu þá leið sem þú vilt fara til að skila inn starfaflokkun. Óháð því hvaða leið þú velur þá er góður undirbúningur grundvallaratriði starfaflokkunar. ',
      },
      instructions: {
        id: 'doe.sr.application:report.dataEntry.instructions',
        defaultMessage:
          'Í fullkomnum heimi fylgir launasetningin stigagjöf, þannig að hæstu stig gefa hæstu launin. Þegar launasetningin er gerð eftir ákveðnu kerfi þá er dregið úr hættu á mismunun. Öll störf eru metin eftir sömu þáttum og þá sjást hugsanleg frávik sem gætu falið í sér kynbundinn launamun og þarfnast leiðréttingar.',
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
          'Sæktu sniðmátið, fylltu út gögnin og hlaðið skjalinu aftur upp hér svo þau flytjist sjálfkrafa inn í umsóknina.',
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
        defaultMessage: 'Skráin var flutt inn.',
      },
      importError: {
        id: 'doe.sr.application:report.dataEntry.importError',
        defaultMessage:
          'Villa kom upp við innflutning. Vinsamlegast reyndu aftur.',
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
        id: 'doe.sr.application:report.criteria.intro',
        defaultMessage:
          'Veldu vægi fyrir hvert yfirviðmið þar sem lagt er mat á þær kröfur sem störf gera til starfsfólks.',
      },
      jobFactorTitle: {
        id: 'doe.sr.application:report.criteria.jobFactorTitle',
        defaultMessage: 'Starfsbundin yfirviðmið',
      },
      jobFactorIntro: {
        id: 'doe.sr.application:report.criteria.jobFactorIntro',
        defaultMessage:
          'Mikilvægt að viðmiðin fyrir störf og vægi þeirra meti raunverulegar kröfur starfsins en endurspegli ekki hefðbundnar hugmyndir um „kvennastörf“ eða „karlastörf”. Gott er því að hafa í huga hve miklu máli hinir ólíku þættir skipta til þess að hægt sé að gegna starfinu og forðast persónueiginlega þeirra sem sinna því á hverjum tíma eða staðalímyndir um störf. Einungis skal horfa til starfsins en ekki starfsmannsins sem gegnir því.',
      },
      personalFactorTitle: {
        id: 'doe.sr.application:report.criteria.personalFactorTitle',
        defaultMessage: 'Einstaklingsbundin viðmið',
      },
      personalFactorIntro: {
        id: 'doe.sr.application:report.criteria.personalFactorIntro',
        defaultMessage:
          'Veldu yfirviðmið ef við á og veldu vægi fyrir hvert þeirra þar sem fram kemur hvaða einstaklingsbundna hæfni starfsfólks er metin til launa. Þú getur bætt við yfirviðmiðum fyrir einstaklingsbundna þætti eftir því sem við á.',
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
        id: 'doe.sr.application:report.subCriteria.intro',
        defaultMessage:
          'Nú er komið að því að velja undirviðmið fyrir starfs- og einstaklingsbundna þætti.\n\nHér að neðan færðu dæmi um valkvæð undirviðmið sem eru algeng á vinnumarkaði en þú getur bætt við eigin viðmiðum eftir því sem við á. Öll viðmiðin sem valin eru þurfa að vera málefnaleg og í samræmi við starfsemina sem um ræðir.\n\nEinnig þarf að ákveða hve mörg þrep eru í boði fyrir hvert þeirra undirviðmiða sem valin eru. Velja þarf þrep fyrir bæði starfsbundin og einstaklingsbundin undirviðmið.\n\n Við val á fjölda þrepa er gott að horfa yfir sviðið og velta því fyrir sér hve mikil dreifing á hinum völdu þáttum er nauðsynleg til að gegna störfunum og ná fram markmiðunum með kjarnastarfseminni. Ef til dæmis undirviðmiðið menntun hefur verið valið undir hæfni, þá er gott að hugsa á hvaða skala menntunin þarf að vera.\n\n**Dæmi 1:** frá grunnskólaprófi og upp í doktorsgráðu.\n\n**Dæmi 2:** frá stúdentsprófi og til iðnmenntunar/grunnháskólagráðu.',
      },
      criterionWeightLabel: {
        id: 'doe.sr.application:report.subCriteria.criterionWeightLabel',
        defaultMessage: 'Vægi yfirviðmiðs: {weight}%',
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
        defaultMessage: 'Starfsbundin undirviðmið',
      },
      jobFactorGroupIntro: {
        id: 'doe.sr.application:report.subCriteria.jobFactorGroupIntro',
        defaultMessage:
          'Gott er að gæta þess að jafnvægi sé milli ólíkra hæfniþátta þar sem við á; til dæmis að meta andlegt álag ef líkamlegt álag er metið. Mat á ábyrgð getur að sama skapi reynst snúið en störf í umönnun eða þjónustu geta til að mynda falið í sér vanmetna ábyrgð ef eingöngu er horft til ábyrgðar á fjármunum.',
      },
      personalFactorGroupTitle: {
        id: 'doe.sr.application:report.subCriteria.personalFactorGroupTitle',
        defaultMessage: 'Einstaklingsbundin undirviðmið',
      },
      personalFactorGroupIntro: {
        id: 'doe.sr.application:report.subCriteria.personalFactorGroupIntro',
        defaultMessage:
          'Mikilvægt er að einstaklingsbundnu viðmiðin séu hlutlæg, gagnsæ og sanngjörn. Illa skilgreind viðmið geta leitt til ómeðvitaðrar mismununar og óútskýrðs launamunar. Gott er að velja fá og skýr viðmið sem byggð eru á sannreynanlegum þáttum sem styðja markmið um jafnræði og samræmi í ákvörðunum um laun.',
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
        defaultMessage: 'Launagögn',
      },
      title: {
        id: 'doe.sr.application:report.employees.title',
        defaultMessage: 'Launagögn',
      },
      intro: {
        id: 'doe.sr.application:report.employees.intro',
        defaultMessage:
          'Hér þarf að fylla inn upplýsingar um starfsmenn fyrirtækisins sem skýrslugjöfin nær yfir. Athugið að fjöldi starfsmanna sem skráðir eru hér þarf að vera í samræmi við fjölda starfsmanna sem gefinn er upp í fyrra skrefi umsóknarinnar.',
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
      identifierLabel: {
        id: 'doe.sr.application:report.employees.identifierLabel',
        defaultMessage: 'Auðkenni',
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
      workRatioLabel: {
        id: 'doe.sr.application:report.employees.workRatioLabel',
        defaultMessage: 'Starfshlutfall',
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
      workRatioInputLabel: {
        id: 'doe.sr.application:report.employees.workRatioInputLabel',
        defaultMessage: 'Starfshlutfall (%)',
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
        defaultMessage: 'Flokkun starfa',
      },
      title: {
        id: 'doe.sr.application:report.jobClassification.title',
        defaultMessage: 'Flokkun starfa',
      },
      intro: {
        id: 'doe.sr.application:report.jobClassification.intro',
        defaultMessage:
          'Hér að neðan þarf að skilgreina stig fyrir hvert starf (ekki starfsmann). Farðu vel yfir upplýsingarnar til þess að vera viss um að ekkert starf vanti.\n\n Hvert undirviðmið hefur vægi (%) sem breytist í stig. Veldu næst þrep fyrir hvert undirviðmið fyrir öll störf og stig verða reiknuð sjálfkrafa. ',
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
        defaultMessage: 'Mat á einstaklingsbundnum þáttum',
      },
      title: {
        id: 'doe.sr.application:report.employeeClassification.title',
        defaultMessage: 'Mat á einstaklingsbundnum þáttum',
      },
      intro: {
        id: 'doe.sr.application:report.employeeClassification.intro',
        defaultMessage:
          'Hér að neðan þarf að velja þrep fyrir hvern starfsmann útfrá einstaklingsbundnum þáttum. Veldu þrep fyrir hvert undirviðmið og stig verða reiknuð sjálfkrafa.',
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
        defaultMessage: 'Yfirlit',
      },
      intro: {
        id: 'doe.sr.application:salaryAnalysis.overview.intro',
        defaultMessage:
          'Hér að neðan sérðu launagreiningu byggða á starfaflokkun og launaupplýsingum.',
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
          'Hér fyrir neðan færðu lista yfir frávik sem eru yfir útgefið viðmið Hagstofunnar.\n\nNú er tækifærið til að fara vel yfir starfaflokkunina og að öll innslegin gögn til þess að kanna hvort þú þurfir að breyta einhverju.',
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
        defaultMessage: 'Meðaltal grunnlauna',
      },

      maleLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.maleLabel',
        defaultMessage: 'Meðallaun karla',
      },
      femaleLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.femaleLabel',
        defaultMessage: 'Meðallaun kvenna',
      },
      wageGapLabel: {
        id: 'doe.sr.application:salaryAnalysis.results.wageGapLabel',
        defaultMessage: 'Launamunur',
      },
      outliersFoundTitle: {
        id: 'doe.sr.application:salaryAnalysis.results.outliersFoundTitle',
        defaultMessage: '{count} frávik fundust',
      },
      outliersFoundDescription: {
        id: 'doe.sr.application:salaryAnalysis.results.outliersFoundDescription',
        defaultMessage:
          'Farið er nánar yfir frávikin og skýringar á næsta skrefi, Úrbótaáætlun.',
      },
      noOutliersFound: {
        id: 'doe.sr.application:salaryAnalysis.results.noOutliersFound',
        defaultMessage: 'Engin frávik fundust í launagreiningunni.',
      },
    }),
    outlierGroup: defineMessages({
      employeeColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.employeeColumn',
        defaultMessage: 'Auðkenni',
      },
      differenceColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.differenceColumn',
        defaultMessage: 'Launamunur',
      },
      scoreColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.scoreColumn',
        defaultMessage: 'Stigaflokkur',
      },
      salaryColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.salaryColumn',
        defaultMessage: 'Laun',
      },
      medianSalaryColumn: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.medianSalaryColumn',
        defaultMessage: 'Miðgildi launa í stigaflokki',
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
        defaultMessage: 'Ég vil skila úrbótaáætlun seinna',
      },
      reasonLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.reasonLabel',
        defaultMessage: 'Ástæða frávika',
      },
      actionLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.actionLabel',
        defaultMessage: 'Fyrirhugaðar úrbætur',
      },
      signatureNameLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.signatureNameLabel',
        defaultMessage: 'Nafn ábyrgðaraðila',
      },
      signatureRoleLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.signatureRoleLabel',
        defaultMessage: 'Starfstitill ábyrgðaraðila',
      },
      createGroupButton: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.createGroupButton',
        defaultMessage: 'Setja í frávikahóp',
      },
      // The two selection checkboxes carry no visible label (the column is
      // just a checkbox), so they need an explicit accessible name.
      selectAllLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectAllLabel',
        defaultMessage: 'Velja alla starfsmenn á þessari síðu',
      },
      selectEmployeeLabel: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.selectEmployeeLabel',
        defaultMessage: 'Velja starfsmann {employee}',
      },
      groupHeading: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupHeading',
        defaultMessage: 'Frávikahópur',
      },
      groupMembers: {
        id: 'doe.sr.application:salaryAnalysis.outlierGroup.groupMembers',
        defaultMessage: 'Starfsmenn í hóp',
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
    }),
  },

  overview: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit',
    },
    title: {
      id: 'doe.sr.application:overview.title',
      defaultMessage: 'Yfirlit',
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
    employeeCount: {
      id: 'doe.sr.application:overview.employeeCount',
      defaultMessage: 'Fjöldi starfsmanna',
    },
    submitButton: {
      id: 'doe.sr.application:overview.submitButton',
      defaultMessage: 'Senda inn umsókn',
    },
  }),

  inReview: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:inReview.sectionTitle',
      defaultMessage: 'Umsókn móttekin',
    },
    alertTitle: {
      id: 'doe.sr.application:inReview.alertTitle',
      defaultMessage: 'Umsókn hefur verið send til Jafnréttisstofu',
    },
    alertDescription: {
      id: 'doe.sr.application:inReview.alertDescription',
      defaultMessage:
        'Við höfum móttekið launagreiningarskýrsluna þína og hún verður yfirfarin af Jafnréttisstofu. Þú færð senda staðfestingu þegar yfirferð er lokið. Ef frekari upplýsingar vantar mun Jafnréttisstofa hafa samband við þig.',
    },
  }),

  rejected: defineMessages({
    sectionTitle: {
      id: 'doe.sr.application:rejected.sectionTitle',
      defaultMessage: 'Hafnað',
    },
    title: {
      id: 'doe.sr.application:rejected.title',
      defaultMessage: 'Umsókn hafnað',
    },
    description: {
      id: 'doe.sr.application:rejected.description',
      defaultMessage: 'Umsókn þinni hefur verið hafnað.',
    },
  }),

  postponed: defineMessages({
    tagLabel: {
      id: 'doe.sr.application:postponed.tagLabel',
      defaultMessage: 'Úrbótaáætlun frestað',
    },
    introSectionTitle: {
      id: 'doe.sr.application:postponed.introSectionTitle',
      defaultMessage: 'Umsókn móttekin',
    },
    introTitle: {
      id: 'doe.sr.application:postponed.introTitle',
      defaultMessage: 'Launaskýrslu hefur verið skilað',
    },
    introDescription: {
      id: 'doe.sr.application:postponed.introDescription',
      defaultMessage:
        'Takk fyrir að skila launaskýrslunni til Jafnréttisstofu. Þú valdir að fresta útskýringu á launamun sem greindist í frávikum. Þú hefur þrjá mánuði frá því að skýrslan var send inn til að skila úrbótaáætlun.',
    },
    reportSummarySectionTitle: {
      id: 'doe.sr.application:postponed.reportSummarySectionTitle',
      defaultMessage: 'Skýrsla',
    },
    reportSummaryTitle: {
      id: 'doe.sr.application:postponed.reportSummaryTitle',
      defaultMessage: 'Yfirlit innsendrar skýrslu',
    },
    sectionTitle: {
      id: 'doe.sr.application:postponed.sectionTitle',
      defaultMessage: 'Úrbótaáætlun',
    },
    title: {
      id: 'doe.sr.application:postponed.title',
      defaultMessage: 'Úrbótaáætlun',
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
  }),

  historyLogs: defineMessages({
    postponed: {
      id: 'doe.sr.application:historyLogs.postponed',
      defaultMessage: 'Salary report outliers postponed',
    },
  }),
}
