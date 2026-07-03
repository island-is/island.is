import { defineMessages } from 'react-intl'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export const messages = {
  errors: defineMessages({
    required: {
      id: 'salaryReport.application:errors.required',
      defaultMessage: 'Þessi reitur má ekki vera tómur',
    },
    invalidEmail: {
      id: 'salaryReport.application:errors.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
    },
    invalidNonNegativeNumber: {
      id: 'salaryReport.application:errors.invalidNonNegativeNumber',
      defaultMessage: 'Talan verður að vera 0 eða hærri',
    },
    duplicateSubsidiary: {
      id: 'salaryReport.application:errors.duplicateSubsidiary',
      defaultMessage: 'Þetta dótturfélag er þegar á listanum',
    },
  }),

  general: defineMessages({
    applicationName: {
      id: 'salaryReport.application:general.applicationName',
      defaultMessage: 'Skýrslugjöf',
    },
    institution: {
      id: 'salaryReport.application:general.institution',
      defaultMessage: 'Jafnréttisstofa',
    },
  }),

  notAllowed: defineMessages({
    title: {
      id: 'salaryReport.application:notAllowed.title',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    description: {
      id: 'salaryReport.application:notAllowed.description',
      defaultMessage:
        'Þú þarft að vera með gilda jafnréttisáætlun til þess að senda inn launagreiningu.',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'salaryReport.application:approved.sectionTitle',
      defaultMessage: 'Samþykkt',
    },
    title: {
      id: 'salaryReport.application:approved.title',
      defaultMessage: 'Umsókn samþykkt',
    },
    description: {
      id: 'salaryReport.application:approved.description',
      defaultMessage: 'Umsókn þín hefur verið samþykkt.',
    },
  }),

  // Forsendur
  prerequisites: {
    errors: defineMessages({
      approveExternalData: {
        id: 'salaryReport.application:prerequisites.errors.approveExternalData',
        defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      },
    }),
    section: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:prerequisites.section.sectionTitle',
        defaultMessage: 'Forsendur',
      },
      title: {
        id: 'salaryReport.application:prerequisites.section.title',
        defaultMessage: 'Gagnaöflun',
      },
      intro: {
        id: 'salaryReport.application:prerequisites.section.intro',
        defaultMessage: lorem,
      },
      checkboxLabel: {
        id: 'salaryReport.application:prerequisites.section.checkboxLabel',
        defaultMessage:
          'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      },
    }),
    activeEqualityReport: defineMessages({
      title: {
        id: 'salaryReport.application:prerequisites.activeEqualityReport.title',
        defaultMessage: 'Upplýsingar frá Jafnréttisstofu',
      },
      intro: {
        id: 'salaryReport.application:prerequisites.activeEqualityReport.intro',
        defaultMessage:
          'Við sækjum upplýsingar um þína stöðu hjá Jafnréttisstofu.',
      },
    }),
    companyRegistry: defineMessages({
      title: {
        id: 'salaryReport.application:prerequisites.companyRegistry.title',
        defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
      },
      intro: {
        id: 'salaryReport.application:prerequisites.companyRegistry.intro',
        defaultMessage:
          'Nafn fyrirtækis, kennitala, heimilisfang og fleiri upplýsingar.',
      },
    }),
    userProfile: defineMessages({
      title: {
        id: 'salaryReport.application:prerequisites.userProfile.title',
        defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      },
      intro: {
        id: 'salaryReport.application:prerequisites.userProfile.intro',
        defaultMessage:
          'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
      },
    }),
    nationalRegistry: defineMessages({
      title: {
        id: 'salaryReport.application:prerequisites.nationalRegistry.title',
        defaultMessage: 'Upplýsingar úr Þjóðskrá',
      },
      intro: {
        id: 'salaryReport.application:prerequisites.nationalRegistry.intro',
        defaultMessage:
          'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      },
    }),
  },

  // Upplýsingar um fyrirtækið
  aboutTheCompany: {
    section: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.section.sectionTitle',
        defaultMessage: 'Upplýsingar um fyrirtækið',
      },
    }),
    generalInformation: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.sectionTitle',
        defaultMessage: 'Almennar upplýsingar',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.title',
        defaultMessage: 'Almennar upplýsingar',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.intro',
        defaultMessage:
          'Eftirfarandi upplýsingar eru sóttar sjálfkrafa frá fyrirtækjaskrá Skattsins og úr kerfum Jafnréttisstofu. Ef upplýsingar um fjölda starfsmanna vantar, verður fjöldi útreiknaður útfrá skilum á þessari skýrslu.',
      },
      companyName: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.companyName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      nationalId: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.nationalId',
        defaultMessage: 'Kennitala',
      },
      address: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.address',
        defaultMessage: 'Heimilisfang',
      },
      postalCode: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.postalCode',
        defaultMessage: 'Póstnúmer',
      },
      municipality: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.municipality',
        defaultMessage: 'Sveitarfélag',
      },
      numberOfEmployees: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.numberOfEmployees',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      isatClassification: {
        id: 'salaryReport.application:aboutTheCompany.generalInformation.isatClassification',
        defaultMessage: 'ÍSAT atvinnugreinarflokkun',
      },
    }),
    chiefExecutive: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.sectionTitle',
        defaultMessage: 'Æðsti stjórnandi',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.title',
        defaultMessage: 'Æðsti stjórnandi',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.intro',
        defaultMessage:
          'Óskað er sérstaklega eftir upplýsingum um kyn æðsta stjórnanda til að fylgjast með kynjaskiptingu í æðstu stjórnendastöðum á vinnumarkaði. Þá er hægt að greina þróun yfir tíma, bera saman atvinnugreinar og meta hvort markmið jafnréttislaga um að jafna stöðu kynjanna séu að nást.',
      },
      name: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.namePlaceholder',
        defaultMessage: 'Nafn æðsta stjórnanda',
      },
      email: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.emailPlaceholder',
        defaultMessage: 'Netfang æðsta stjórnanda',
      },
      jobTitle: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.jobTitle',
        defaultMessage: 'Starfstitill',
      },
      jobTitlePlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.jobTitlePlaceholder',
        defaultMessage: 'Starfstitill æðsta stjórnanda',
      },
      gender: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.gender',
        defaultMessage: 'Kyn',
      },
      genderMale: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.genderMale',
        defaultMessage: 'Karl',
      },
      genderFemale: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.genderFemale',
        defaultMessage: 'Kona',
      },
      genderNonBinary: {
        id: 'salaryReport.application:aboutTheCompany.chiefExecutive.genderNonBinary',
        defaultMessage: 'Hlutlæg skráning kyns í þjóðskrá',
      },
    }),
    contactPerson: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.sectionTitle',
        defaultMessage: 'Tengiliður',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.title',
        defaultMessage: 'Tengiliður',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.intro',
        defaultMessage:
          'Tengiliður er sá aðili sem ber ábyrgð á skýrslugjöfinni auk stjórnanda. Við höfum samskipti við tengiliðinn svo mikilvægt er að hann sé með á nótunum.',
      },
      contactInfoTitle: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.contactInfoTitle',
        defaultMessage: 'Upplýsingar um tengilið',
      },
      name: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.name',
        defaultMessage: 'Nafn',
      },
      namePlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.namePlaceholder',
        defaultMessage: 'Nafn tengiliðs',
      },
      email: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.email',
        defaultMessage: 'Netfang',
      },
      emailPlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.emailPlaceholder',
        defaultMessage: 'Netfang tengiliðs',
      },
      phone: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.phone',
        defaultMessage: 'Símanúmer',
      },
      phonePlaceholder: {
        id: 'salaryReport.application:aboutTheCompany.contactPerson.phonePlaceholder',
        defaultMessage: 'Símanúmer tengiliðs',
      },
    }),
    employeeCount: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.sectionTitle',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Fjöldi starfsmanna',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.intro',
        defaultMessage:
          'Forskráðar upplýsingar um starfsmannafjölda koma frá Skattinum í janúar ár hvert. Hér að neðan er hins vegar beðið um upplýsingar um þann fjölda starfsmanna sem skýrslugjöfin nær utan um, þ.e. þann fjölda sem fékk útborguð laun á tímabili launagreiningar.',
      },
      women: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.women',
        defaultMessage: 'Konur',
      },
      men: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.men',
        defaultMessage: 'Karlar',
      },
      nonBinary: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.nonBinary',
        defaultMessage: 'Hlutlæg skráning kyns í þjóðskrá',
      },
    }),
    subsidiaries: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.sectionTitle',
        defaultMessage: 'Dótturfyrirtæki',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.title',
        defaultMessage: 'Dótturfyrirtæki',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.intro',
        defaultMessage:
          'Hægt er að skila inn einni áætlun fyrir móður- og dótturfyrirtæki.',
      },
      includesSubsidiariesTitle: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.includesSubsidiariesTitle',
        defaultMessage: 'Nær launaskýrsla einnig til dótturfyrirtækja?',
      },
      yes: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.yes',
        defaultMessage: 'Já',
      },
      no: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.no',
        defaultMessage: 'Nei',
      },
      tableFormTitle: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableFormTitle',
        defaultMessage: 'Upplýsingar um dótturfyrirtæki',
      },
      tableAddButton: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableAddButton',
        defaultMessage: 'Bæta við dótturfyrirtæki',
      },
      tableSaveButton: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableSaveButton',
        defaultMessage: 'Vista dótturfyrirtæki',
      },
      tableRemoveButton: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableRemoveButton',
        defaultMessage: 'Eyða dótturfyrirtæki',
      },
      tableEditButton: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableEditButton',
        defaultMessage: 'Breyta dótturfyrirtæki',
      },
      tableHeaderName: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableHeaderName',
        defaultMessage: 'Nafn fyrirtækis',
      },
      tableHeaderNationalId: {
        id: 'salaryReport.application:aboutTheCompany.subsidiaries.tableHeaderNationalId',
        defaultMessage: 'Kennitala',
      },
    }),
    period: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:aboutTheCompany.period.sectionTitle',
        defaultMessage: 'Tímabil launagreiningar',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.period.title',
        defaultMessage: 'Tímabil launagreiningar',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.period.intro',
        defaultMessage:
          'Launagreining felur í sér að gefa þarf upp greidd laun fyrir ákveðið tímabil.',
      },
      label: {
        id: 'salaryReport.application:aboutTheCompany.period.label',
        defaultMessage: 'Veldu tímabil launagreiningar',
      },
      medium12months: {
        id: 'salaryReport.application:aboutTheCompany.period.medium12months',
        defaultMessage: 'Meðaltal á tólf mánaða tímabili',
      },
      oneMonth: {
        id: 'salaryReport.application:aboutTheCompany.period.oneMonth',
        defaultMessage:
          'Einn mánuður undangenginna tólf mánaða (mælt er með því að velja mánuð þar sem ekki var mikið um óhefðbundin laun, t.d. leiðréttingar, uppgjör vegna starfsloka eða slíks)',
      },
    }),
  },

  report: {
    section: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.section.sectionTitle',
        defaultMessage: 'Skýrsla',
      },
    }),
    personalData: defineMessages({
      title: {
        id: 'salaryReport.application:report.personalData.title',
        defaultMessage: 'Meðferð persónuupplýsinga',
      },
      intro: {
        id: 'salaryReport.application:report.personalData.intro',
        defaultMessage:
          'Vefsvæðið er öruggt og vinnur aðeins með auðkenni starfsmanna en ekki persónugreinanlegar upplýsingar, svo sem nöfn eða kennitölur. Skipulag vinnunnar skiptir því miklu máli og nauðsynlegt er að halda vel utan um öll gögn sem henni tengjast, auðkenni starfsmanna o.s.frv.. Ef það kemur til dæmis í ljós að þú þurfir að leiðrétta laun starfsmanns með auðkennið 10, þá viltu vita á auðveldan hátt hvaða starfsmann um ræðir.',
      },
    }),
    dataEntry: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.dataEntry.sectionTitle',
        defaultMessage: 'Innsláttur gagna',
      },
      title: {
        id: 'salaryReport.application:report.dataEntry.title',
        defaultMessage: 'Innsláttur gagna',
      },
      // This should be added when a third party connection is ready
      // Mælt er með því að stærri aðilar nýti Thirdparty eða sæki excel sniðmát.
      intro: {
        id: 'salaryReport.application:report.dataEntry.intro',
        defaultMessage:
          'Nú ertu í skýrslugjafarhluta kerfisins. Hér fyrir neðan velurðu þá leið sem þú vilt fara til að skila inn starfaflokkun. Óháð því hvaða leið þú velur þá er góður undirbúningur grundvallaratriði starfaflokkunar. ',
      },
      instructions: {
        id: 'salaryReport.application:report.dataEntry.instructions',
        defaultMessage:
          'Í fullkomnum heimi fylgir launasetningin stigagjöf, þannig að hæstu stig gefa hæstu launin. Þegar launasetningin er gerð eftir ákveðnu kerfi þá er dregið úr hættu á mismunun. Öll störf eru metin eftir sömu þáttum og þá sjást hugsanleg frávik sem gætu falið í sér kynbundinn launamun og þarfnast leiðréttingar.',
      },
      downloadTemplateButton: {
        id: 'salaryReport.application:report.dataEntry.downloadTemplateButton',
        defaultMessage: 'Sækja sniðmát',
      },
      uploadButtonLabel: {
        id: 'salaryReport.application:report.dataEntry.uploadButtonLabel',
        defaultMessage: 'Hlaða upp skjali',
      },
      uploadCardTitle: {
        id: 'salaryReport.application:report.dataEntry.uploadCardTitle',
        defaultMessage: 'Excel skjal',
      },
      uploadCardIntro: {
        id: 'salaryReport.application:report.dataEntry.uploadCardIntro',
        defaultMessage:
          'Sæktu sniðmátið, fylltu út gögnin og hlaðið skjalinu aftur upp hér svo þau flytjist sjálfkrafa inn í umsóknina.',
      },
      manualEntryCardTitle: {
        id: 'salaryReport.application:report.dataEntry.manualEntryCardTitle',
        defaultMessage: 'Handvirkur innsláttur',
      },
      manualEntryCardIntro: {
        id: 'salaryReport.application:report.dataEntry.manualEntryCardIntro',
        defaultMessage:
          'Skráðu gögnin beint í næstu skrefum umsóknarinnar án þess að nota Excel-skjal.',
      },
      manualEntryButtonLabel: {
        id: 'salaryReport.application:report.dataEntry.manualEntryButtonLabel',
        defaultMessage: 'Byrja innslátt',
      },
      importingLabel: {
        id: 'salaryReport.application:report.dataEntry.importingLabel',
        defaultMessage: 'Flyt inn skjal...',
      },
      importSuccess: {
        id: 'salaryReport.application:report.dataEntry.importSuccess',
        defaultMessage: 'Skráin var flutt inn.',
      },
      importError: {
        id: 'salaryReport.application:report.dataEntry.importError',
        defaultMessage:
          'Villa kom upp við innflutning. Vinsamlegast reyndu aftur.',
      },
    }),
    criteria: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.criteria.sectionTitle',
        defaultMessage: 'Yfirviðmið',
      },
      title: {
        id: 'salaryReport.application:report.criteria.title',
        defaultMessage: 'Yfirviðmið',
      },
      intro: {
        id: 'salaryReport.application:report.criteria.intro',
        defaultMessage:
          'Veldu vægi fyrir hvert yfirviðmið þar sem lagt er mat á þær kröfur sem störf gera til starfsfólks.',
      },
      jobFactorTitle: {
        id: 'salaryReport.application:report.criteria.jobFactorTitle',
        defaultMessage: 'Starfsbundin yfirviðmið',
      },
      jobFactorIntro: {
        id: 'salaryReport.application:report.criteria.jobFactorIntro',
        defaultMessage:
          'Mikilvægt að viðmiðin fyrir störf og vægi þeirra meti raunverulegar kröfur starfsins en endurspegli ekki hefðbundnar hugmyndir um „kvennastörf“ eða „karlastörf”. Gott er því að hafa í huga hve miklu máli hinir ólíku þættir skipta til þess að hægt sé að gegna starfinu og forðast persónueiginlega þeirra sem sinna því á hverjum tíma eða staðalímyndir um störf. Einungis skal horfa til starfsins en ekki starfsmannsins sem gegnir því.',
      },
      personalFactorTitle: {
        id: 'salaryReport.application:report.criteria.personalFactorTitle',
        defaultMessage: 'Einstaklingsbundin viðmið',
      },
      personalFactorIntro: {
        id: 'salaryReport.application:report.criteria.personalFactorIntro',
        defaultMessage:
          'Veldu yfirviðmið ef við á og veldu vægi fyrir hvert þeirra þar sem fram kemur hvaða einstaklingsbundna hæfni starfsfólks er metin til launa. Þú getur bætt við yfirviðmiðum fyrir einstaklingsbundna þætti eftir því sem við á.',
      },
      personalFactorInstructions: {
        id: 'salaryReport.application:report.criteria.personalFactorInstructions',
        defaultMessage:
          'Viðmiðin fyrir einstaklingsbundna hæfni endurspegla það sem starfsfólki er sérstaklega umbunað fyrir í launum án þess að starfið geri kröfur um það. Svo sem menntun eða starfsreynsla umfram þær kröfur sem þarf til að sinna starfinu. Einfaldasta útskýringin er að yfirmaður kann að meta ákveðna þætti sem einstaklingurinn kemur með sér og hækkir því laun viðkomandi eftir ákveðnu kerfi. Allt starfsfólk situr hér við sama borð.',
      },
      weightLabel: {
        id: 'salaryReport.application:report.criteria.weightLabel',
        defaultMessage: 'Vægi',
      },
      criterionNameLabel: {
        id: 'salaryReport.application:report.criteria.criterionNameLabel',
        defaultMessage: 'Viðmið',
      },
      descriptionLabel: {
        id: 'salaryReport.application:report.criteria.descriptionLabel',
        defaultMessage: 'Lýsing',
      },
      deleteButton: {
        id: 'salaryReport.application:report.criteria.deleteButton',
        defaultMessage: 'Eyða',
      },
      addCriterionButton: {
        id: 'salaryReport.application:report.criteria.addCriterionButton',
        defaultMessage: 'Bæta við viðmiði',
      },
      weightSumError: {
        id: 'salaryReport.application:report.criteria.weightSumError',
        defaultMessage:
          'Vægi allra viðmiða verður að vera samtals 100% (núverandi: {total}%)',
      },
    }),
    subCriteria: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.subCriteria.sectionTitle',
        defaultMessage: 'Undirviðmið',
      },
      title: {
        id: 'salaryReport.application:report.subCriteria.title',
        defaultMessage: 'Undirviðmið',
      },
      intro: {
        id: 'salaryReport.application:report.subCriteria.intro',
        defaultMessage:
          'Nú er komið að því að velja undirviðmið fyrir starfs- og einstaklingsbundna þætti.\n\nHér að neðan færðu dæmi um valkvæð undirviðmið sem eru algeng á vinnumarkaði en þú getur bætt við eigin viðmiðum eftir því sem við á. Öll viðmiðin sem valin eru þurfa að vera málefnaleg og í samræmi við starfsemina sem um ræðir.\n\nEinnig þarf að ákveða hve mörg þrep eru í boði fyrir hvert þeirra undirviðmiða sem valin eru. Velja þarf þrep fyrir bæði starfsbundin og einstaklingsbundin undirviðmið.\n\n Við val á fjölda þrepa er gott að horfa yfir sviðið og velta því fyrir sér hve mikil dreifing á hinum völdu þáttum er nauðsynleg til að gegna störfunum og ná fram markmiðunum með kjarnastarfseminni. Ef til dæmis undirviðmiðið menntun hefur verið valið undir hæfni, þá er gott að hugsa á hvaða skala menntunin þarf að vera.\n\n**Dæmi 1:** frá grunnskólaprófi og upp í doktorsgráðu.\n\n**Dæmi 2:** frá stúdentsprófi og til iðnmenntunar/grunnháskólagráðu.',
      },
      criterionWeightLabel: {
        id: 'salaryReport.application:report.subCriteria.criterionWeightLabel',
        defaultMessage: 'Vægi yfirviðmiðs: {weight}%',
      },
      nameLabel: {
        id: 'salaryReport.application:report.subCriteria.nameLabel',
        defaultMessage: 'Undirviðmið',
      },
      definitionLabel: {
        id: 'salaryReport.application:report.subCriteria.definitionLabel',
        defaultMessage: 'Skilgreining',
      },
      weightLabel: {
        id: 'salaryReport.application:report.subCriteria.weightLabel',
        defaultMessage: 'Vægi',
      },
      stepCountLabel: {
        id: 'salaryReport.application:report.subCriteria.stepCountLabel',
        defaultMessage: 'Fjöldi þrepa',
      },
      stepsLabel: {
        id: 'salaryReport.application:report.subCriteria.stepsLabel',
        defaultMessage: 'Þrep',
      },
      stepLabel: {
        id: 'salaryReport.application:report.subCriteria.stepLabel',
        defaultMessage: '{index}. þrep',
      },
      deleteButton: {
        id: 'salaryReport.application:report.subCriteria.deleteButton',
        defaultMessage: 'Eyða',
      },
      addButton: {
        id: 'salaryReport.application:report.subCriteria.addButton',
        defaultMessage: 'Bæta við undirviðmiði',
      },
      jobFactorGroupTitle: {
        id: 'salaryReport.application:report.subCriteria.jobFactorGroupTitle',
        defaultMessage: 'Starfsbundin undirviðmið',
      },
      jobFactorGroupIntro: {
        id: 'salaryReport.application:report.subCriteria.jobFactorGroupIntro',
        defaultMessage:
          'Gott er að gæta þess að jafnvægi sé milli ólíkra hæfniþátta þar sem við á; til dæmis að meta andlegt álag ef líkamlegt álag er metið. Mat á ábyrgð getur að sama skapi reynst snúið en störf í umönnun eða þjónustu geta til að mynda falið í sér vanmetna ábyrgð ef eingöngu er horft til ábyrgðar á fjármunum.',
      },
      personalFactorGroupTitle: {
        id: 'salaryReport.application:report.subCriteria.personalFactorGroupTitle',
        defaultMessage: 'Einstaklingsbundin undirviðmið',
      },
      personalFactorGroupIntro: {
        id: 'salaryReport.application:report.subCriteria.personalFactorGroupIntro',
        defaultMessage:
          'Mikilvægt er að einstaklingsbundnu viðmiðin séu hlutlæg, gagnsæ og sanngjörn. Illa skilgreind viðmið geta leitt til ómeðvitaðrar mismununar og óútskýrðs launamunar. Gott er að velja fá og skýr viðmið sem byggð eru á sannreynanlegum þáttum sem styðja markmið um jafnræði og samræmi í ákvörðunum um laun.',
      },
    }),
    employees: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.employees.sectionTitle',
        defaultMessage: 'Starfsmenn',
      },
      title: {
        id: 'salaryReport.application:report.employees.title',
        defaultMessage: 'Starfsmenn',
      },
      intro: {
        id: 'salaryReport.application:report.employees.intro',
        defaultMessage:
          'Hér þarf að fylla inn upplýsingar um starfsmenn fyrirtækisins sem skýrslugjöfin nær yfir. Athugið að fjöldi starfsmanna sem skráðir eru hér þarf að vera í samræmi við fjölda starfsmanna sem gefinn er upp í fyrra skrefi umsóknarinnar.',
      },
      nameColumn: {
        id: 'salaryReport.application:report.employees.nameColumn',
        defaultMessage: 'Nafn',
      },
      roleColumn: {
        id: 'salaryReport.application:report.employees.roleColumn',
        defaultMessage: 'Starf',
      },
      genderColumn: {
        id: 'salaryReport.application:report.employees.genderColumn',
        defaultMessage: 'Kyn',
      },
      identifierLabel: {
        id: 'salaryReport.application:report.employees.identifierLabel',
        defaultMessage: 'Kennitala',
      },
      educationLabel: {
        id: 'salaryReport.application:report.employees.educationLabel',
        defaultMessage: 'Menntun',
      },
      fieldLabel: {
        id: 'salaryReport.application:report.employees.fieldLabel',
        defaultMessage: 'Svið',
      },
      departmentLabel: {
        id: 'salaryReport.application:report.employees.departmentLabel',
        defaultMessage: 'Deild',
      },
      startDateLabel: {
        id: 'salaryReport.application:report.employees.startDateLabel',
        defaultMessage: 'Starfstímabil',
      },
      workRatioLabel: {
        id: 'salaryReport.application:report.employees.workRatioLabel',
        defaultMessage: 'Starfshlutfall',
      },
      baseSalaryLabel: {
        id: 'salaryReport.application:report.employees.baseSalaryLabel',
        defaultMessage: 'Grunnlaun',
      },
      additionalSalaryLabel: {
        id: 'salaryReport.application:report.employees.additionalSalaryLabel',
        defaultMessage: 'Viðbótarlaun',
      },
      bonusSalaryLabel: {
        id: 'salaryReport.application:report.employees.bonusSalaryLabel',
        defaultMessage: 'Hlunnindi',
      },
      addButton: {
        id: 'salaryReport.application:report.employees.addButton',
        defaultMessage: 'Bæta við starfsmanni',
      },
      removeButton: {
        id: 'salaryReport.application:report.employees.removeButton',
        defaultMessage: 'Fjarlægja starfsmann',
      },
      addFormTitle: {
        id: 'salaryReport.application:report.employees.addFormTitle',
        defaultMessage: 'Nýr starfsmaður',
      },
      genderInputLabel: {
        id: 'salaryReport.application:report.employees.genderInputLabel',
        defaultMessage: 'Kyn',
      },
      roleInputLabel: {
        id: 'salaryReport.application:report.employees.roleInputLabel',
        defaultMessage: 'Starf',
      },
      workRatioInputLabel: {
        id: 'salaryReport.application:report.employees.workRatioInputLabel',
        defaultMessage: 'Starfshlutfall (%)',
      },
      saveButton: {
        id: 'salaryReport.application:report.employees.saveButton',
        defaultMessage: 'Vista starfsmann',
      },
      cancelButton: {
        id: 'salaryReport.application:report.employees.cancelButton',
        defaultMessage: 'Hætta við',
      },
    }),
    jobClassification: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.jobClassification.sectionTitle',
        defaultMessage: 'Flokkun starfa',
      },
      title: {
        id: 'salaryReport.application:report.jobClassification.title',
        defaultMessage: 'Flokkun starfa',
      },
      intro: {
        id: 'salaryReport.application:report.jobClassification.intro',
        defaultMessage:
          'Hér að neðan þarf að skilgreina stig fyrir hvert starf (ekki starfsmann). Farðu vel yfir upplýsingarnar til þess að vera viss um að ekkert starf vanti.\n\n Hvert undirviðmið hefur vægi (%) sem breytist í stig. Veldu næst þrep fyrir hvert undirviðmið fyrir öll störf og stig verða reiknuð sjálfkrafa. ',
      },
      stigLabel: {
        id: 'salaryReport.application:report.jobClassification.stigLabel',
        defaultMessage: 'Stig',
      },
      roleScore: {
        id: 'salaryReport.application:report.jobClassification.roleScore',
        defaultMessage: '{score}/{max} stig',
      },
      subCriterionInfo: {
        id: 'salaryReport.application:report.jobClassification.subCriterionInfo',
        defaultMessage: '{description} {weight}% = {max} stig',
      },
    }),
    employeeClassification: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.employeeClassification.sectionTitle',
        defaultMessage: 'Flokkun starfsmanna',
      },
      title: {
        id: 'salaryReport.application:report.employeeClassification.title',
        defaultMessage: 'Flokkun starfsmanna',
      },
      intro: {
        id: 'salaryReport.application:report.employeeClassification.intro',
        defaultMessage:
          'Hér að neðan þarf að skilgreina stig fyrir hvern starfsmann útfrá einstaklingsbundnum þáttum. Veldu næst þrep fyrir hvert undirviðmið fyrir alla starfsmenn og stig verða reiknuð sjálfkrafa.',
      },
    }),
  },

  // Launagreining
  salaryAnalysis: {
    section: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:salaryAnalysis.section.sectionTitle',
        defaultMessage: 'Launagreining',
      },
    }),
    overview: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:salaryAnalysis.overview.sectionTitle',
        defaultMessage: 'Yfirlit',
      },
      title: {
        id: 'salaryReport.application:salaryAnalysis.overview.title',
        defaultMessage: 'Yfirlit',
      },
      intro: {
        id: 'salaryReport.application:salaryAnalysis.overview.intro',
        defaultMessage:
          'Hér að neðan sérðu launagreiningu byggða á starfaflokkun og launaupplýsingum.',
      },
    }),
    improvementPlan: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:salaryAnalysis.improvementPlan.sectionTitle',
        defaultMessage: 'Úrbótaáætlun',
      },
      title: {
        id: 'salaryReport.application:salaryAnalysis.improvementPlan.title',
        defaultMessage: 'Úrbótaáætlun',
      },
      intro: {
        id: 'salaryReport.application:salaryAnalysis.improvementPlan.intro',
        defaultMessage:
          'Hér fyrir neðan færðu lista yfir frávik sem eru yfir útgefið viðmið Hagstofunnar.\n\nNú er tækifærið til að fara vel yfir starfaflokkunina og að öll innslegin gögn til þess að kanna hvort þú þurfir að breyta einhverju.',
      },
    }),
  },

  overview: defineMessages({
    sectionTitle: {
      id: 'salaryReport.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit',
    },
    title: {
      id: 'salaryReport.application:overview.title',
      defaultMessage: 'Yfirlit',
    },
    intro: {
      id: 'salaryReport.application:overview.intro',
      defaultMessage:
        'Hér að neðan sérðu yfirlit yfir skýrslugjöfina sem þú hefur fyllt út. Vinsamlegast farðu vel yfir gögnin og athugaðu hvort þau séu rétt áður en þú sendir inn skýrsluna.',
    },
    chiefExecutiveJobTitleLabel: {
      id: 'salaryReport.application:overview.chiefExecutiveJobTitleLabel',
      defaultMessage: 'Starfstitill æðsta stjórnanda',
    },
    periodLabel: {
      id: 'salaryReport.application:overview.periodLabel',
      defaultMessage: 'Tímabil launagreiningar',
    },
  }),
}
