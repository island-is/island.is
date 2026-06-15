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
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
        defaultMessage: 'Hlutlægt',
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
        defaultMessage: lorem,
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
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      title: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.title',
        defaultMessage: 'Meðalfjöldi starfsmanna',
      },
      intro: {
        id: 'salaryReport.application:aboutTheCompany.employeeCount.intro',
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
  },

  report: {
    section: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.section.sectionTitle',
        defaultMessage: 'Skýrsla',
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
      intro: {
        id: 'salaryReport.application:report.dataEntry.intro',
        defaultMessage: lorem,
      },
      downloadTemplateButton: {
        id: 'salaryReport.application:report.dataEntry.downloadTemplateButton',
        defaultMessage: 'Sækja sniðmát',
      },
      uploadButtonLabel: {
        id: 'salaryReport.application:report.dataEntry.uploadButtonLabel',
        defaultMessage: 'Hlaða upp skjali',
      },
      importSuccess: {
        id: 'salaryReport.application:report.dataEntry.importSuccess',
        defaultMessage: 'Skráin var flutt inn.',
      },
      importError: {
        id: 'salaryReport.application:report.dataEntry.importError',
        defaultMessage: 'Villa kom upp við innflutning. Vinsamlegast reyndu aftur.',
      },
    }),
    criteria: defineMessages({
      sectionTitle: {
        id: 'salaryReport.application:report.criteria.sectionTitle',
        defaultMessage: 'Viðmið',
      },
      title: {
        id: 'salaryReport.application:report.criteria.title',
        defaultMessage: 'Viðmið',
      },
      intro: {
        id: 'salaryReport.application:report.criteria.intro',
        defaultMessage:
          'Viðmið fyrir starfsbundinn þátt eru grunnurinn að flokkun starfa og eru óbreytanleg. Stilltu vægi fyrir hvert viðmið. Þessi viðmið eru grunninn að flokkun starfa og verða að samtals vera 100%',
      },
      jobFactorTitle: {
        id: 'salaryReport.application:report.criteria.jobFactorTitle',
        defaultMessage: 'Starfsbundinn þáttur',
      },
      jobFactorIntro: {
        id: 'salaryReport.application:report.criteria.jobFactorIntro',
        defaultMessage:
          'Viðmið fyrir starfsbundinn þátt eru grunnurinn að flokkun starfa og eru óbreytanleg. Stilltu vægi fyrir hvert viðmið. Þessi viðmið eru grunninn að flokkun starfa og verða að samtals 100%',
      },
      personalFactorTitle: {
        id: 'salaryReport.application:report.criteria.personalFactorTitle',
        defaultMessage: 'Persónubundinn þáttur',
      },
      personalFactorIntro: {
        id: 'salaryReport.application:report.criteria.personalFactorIntro',
        defaultMessage:
          'Búðu til eigin viðmið og stilltu vægi þeirra. Þessi viðmið eru grunninn að flokkun starfsmanna.',
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
        defaultMessage: 'Vægi allra viðmiða verður að vera samtals 100% (núverandi: {total}%)',
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
        defaultMessage: lorem,
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
        defaultMessage: 'Starfsbundinn þáttur',
      },
      jobFactorGroupIntro: {
        id: 'salaryReport.application:report.subCriteria.jobFactorGroupIntro',
        defaultMessage: lorem,
      },
      personalFactorGroupTitle: {
        id: 'salaryReport.application:report.subCriteria.personalFactorGroupTitle',
        defaultMessage: 'Persónubundinn þáttur',
      },
      personalFactorGroupIntro: {
        id: 'salaryReport.application:report.subCriteria.personalFactorGroupIntro',
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
        defaultMessage: lorem,
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
      defaultMessage: lorem,
    },
  }),
}
