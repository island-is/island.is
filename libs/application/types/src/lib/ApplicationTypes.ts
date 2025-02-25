export enum ApplicationTypes {
  EXAMPLE = 'ExampleForm',
  PASSPORT = 'Passport',
  PASSPORT_ANNULMENT = 'PassportAnnulment',
  DRIVING_LEARNERS_PERMIT = 'DrivingLearnersPermit',
  DRIVING_LICENSE = 'DrivingLicense',
  DRIVING_ASSESSMENT_APPROVAL = 'DrivingAssessmentApproval',
  PARENTAL_LEAVE = 'ParentalLeave',
  DOCUMENT_PROVIDER_ONBOARDING = 'DocumentProviderOnboarding',
  HEALTH_INSURANCE = 'HealthInsurance',
  CHILDREN_RESIDENCE_CHANGE_V2 = 'ChildrenResidenceChangeV2',
  DATA_PROTECTION_AUTHORITY_COMPLAINT = 'DataProtectionAuthorityComplaint',
  LOGIN_SERVICE = 'LoginService',
  INHERITANCE_REPORT = 'InheritanceReport',
  INSTITUTION_COLLABORATION = 'InstitutionCollaboration',
  FUNDING_GOVERNMENT_PROJECTS = 'FundingGovernmentProjects',
  PUBLIC_DEBT_PAYMENT_PLAN = 'PublicDebtPaymentPlan',
  COMPLAINTS_TO_ALTHINGI_OMBUDSMAN = 'ComplaintsToAlthingiOmbudsman',
  ACCIDENT_NOTIFICATION = 'AccidentNotification',
  GENERAL_PETITION = 'GeneralPetitionService',
  GENERAL_FISHING_LICENSE = 'GeneralFishingLicense',
  P_SIGN = 'PSign',
  ANNOUNCEMENT_OF_DEATH = 'AnnouncementOfDeath',
  CRIMINAL_RECORD = 'CriminalRecord',
  FINANCIAL_AID = 'FinancialAid',
  DRIVING_INSTRUCTOR_REGISTRATIONS = 'DrivingInstructorRegistrations',
  EXAMPLE_PAYMENT = 'ExamplePayment',
  DRIVING_SCHOOL_CONFIRMATION = 'DrivingSchoolConfirmation',
  MORTGAGE_CERTIFICATE = 'MortgageCertificate',
  MARRIAGE_CONDITIONS = 'MarriageConditions',
  NO_DEBT_CERTIFICATE = 'NoDebtCertificate',
  FINANCIAL_STATEMENT_CEMETERY = 'FinancialStatementCemetery',
  FINANCIAL_STATEMENTS_INAO = 'FinancialStatementsInao',
  FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION = 'FinancialStatementIndividualElection',
  FINANCIAL_STATEMENT_POLITICAL_PARTY = 'FinancialStatementPoliticalParty',
  OPERATING_LICENSE = 'OperatingLicense',
  ESTATE = 'Estate',
  DRIVING_LICENSE_DUPLICATE = 'DrivingLicenseDuplicate',
  ANONYMITY_IN_VEHICLE_REGISTRY = 'AnonymityInVehicleRegistry',
  CHANGE_CO_OWNER_OF_VEHICLE = 'ChangeCoOwnerOfVehicle',
  CHANGE_OPERATOR_OF_VEHICLE = 'ChangeOperatorOfVehicle',
  DIGITAL_TACHOGRAPH_DRIVERS_CARD = 'DigitalTachographDriversCard',
  LICENSE_PLATE_RENEWAL = 'LicensePlateRenewal',
  ORDER_VEHICLE_LICENSE_PLATE = 'OrderVehicleLicensePlate',
  ORDER_VEHICLE_REGISTRATION_CERTIFICATE = 'OrderVehicleRegistrationCertificate',
  TRANSFER_OF_VEHICLE_OWNERSHIP = 'TransferOfVehicleOwnership',
  DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR = 'DrivingLicenseBookUpdateInstructor',
  ALCOHOL_TAX_REDEMPTION = 'AlcoholTaxRedemption',
  EUROPEAN_HEALTH_INSURANCE_CARD = 'EuropeanHealthInsuranceCard',
  OLD_AGE_PENSION = 'OldAgePension',
  HOUSEHOLD_SUPPLEMENT = 'HouseholdSupplement',
  CAR_RECYCLING = 'CarRecycling',
  PRESIDENTIAL_LIST_CREATION = 'PresidentialListCreation',
  PRESIDENTIAL_LIST_SIGNING = 'PresidentialListSigning',
  PARLIAMENTARY_LIST_CREATION = 'ParliamentaryListCreation',
  PARLIAMENTARY_LIST_SIGNING = 'ParliamentaryListSigning',
  CITIZENSHIP = 'Citizenship',
  ADDITIONAL_SUPPORT_FOR_THE_ELDERLY = 'AdditionalSupportForTheElderly',
  ENERGY_FUNDS = 'EnergyFunds',
  HEALTHCARE_LICENSE_CERTIFICATE = 'HealthcareLicenseCertificate',
  HEALTHCARE_WORK_PERMIT = 'HealthcareWorkPermit',
  PENSION_SUPPLEMENT = 'PensionSupplement',
  TRANSFER_OF_MACHINE_OWNERSHIP = 'TransferOfMachineOwnership',
  DEATH_BENEFITS = 'DeathBenefits',
  UNIVERSITY = 'University',
  HOME_SUPPORT = 'HomeSupport',
  CHANGE_MACHINE_SUPERVISOR = 'ChangeMachineSupervisor',
  DEREGISTER_MACHINE = 'DeregisterMachine',
  GRINDAVIK_HOUSING_BUYOUT = 'GrindavikHousingBuyout',
  REQUEST_INSPECTION_FOR_MACHINE = 'RequestInspectionForMachine',
  OFFICIAL_JOURNAL_OF_ICELAND = 'OfficialJournalOfIceland',
  ID_CARD = 'IdCard',
  HEALTH_INSURANCE_DECLARATION = 'HealthInsuranceDeclaration',
  STREET_REGISTRATION = 'StreetRegistration',
  INCOME_PLAN = 'IncomePlan',
  NEW_PRIMARY_SCHOOL = 'NewPrimarySchool',
  WORK_ACCIDENT_NOTIFICATION = 'WorkAccidentNotification',
  MACHINE_REGISTRATION = 'MachineRegistration',
  SECONDARY_SCHOOL = 'SecondarySchool',
}

export const ApplicationConfigurations = {
  [ApplicationTypes.EXAMPLE]: {
    slug: 'example',
    translation: 'example.application',
  },
  [ApplicationTypes.PASSPORT]: {
    slug: 'vegabref',
    translation: 'pa.application',
  },
  [ApplicationTypes.PASSPORT_ANNULMENT]: {
    slug: 'tilkynna-vegabref',
    translation: 'paa.application',
  },
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: {
    slug: 'aefingaakstur',
    translation: 'dlp.application',
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    slug: 'okuskirteini',
    translation: 'dl.application',
  },
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: {
    slug: 'akstursmat',
    translation: 'dla.application',
  },
  [ApplicationTypes.PARENTAL_LEAVE]: {
    slug: 'faedingarorlof',
    translation: ['pl.application', 'uiForms.application'],
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    slug: 'skjalaveita',
    translation: 'dpo.application',
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    slug: 'sjukratryggingar',
    translation: 'hi.application',
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    slug: 'breytt-logheimili-barns',
    translation: 'crc.application',
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    slug: 'kvortun-til-personuverndar',
    translation: 'dpac.application',
  },
  [ApplicationTypes.LOGIN_SERVICE]: {
    slug: 'innskraningarthjonusta',
    translation: 'ls.application',
  },
  [ApplicationTypes.INHERITANCE_REPORT]: {
    slug: 'erfdafjarskyrsla',
    translation: 'ir.application',
  },
  [ApplicationTypes.INSTITUTION_COLLABORATION]: {
    slug: 'samstarf',
    translation: 'ia.application',
  },
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: {
    slug: 'fjarmognun-rikisverkefni',
    translation: 'affgp.application',
  },
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: {
    slug: 'greidsluaaetlun',
    translation: 'pdpp.application',
  },
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: {
    slug: 'kvortun-til-umbodsmanns-althingis',
    translation: ['ctao.application', 'uiForms.application'],
  },
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: {
    slug: 'slysatilkynning',
    translation: 'an.application',
  },
  [ApplicationTypes.GENERAL_PETITION]: {
    slug: 'undirskriftalisti',
    translation: 'gpl.application',
  },
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: {
    slug: 'veidileyfi',
    translation: 'gfl.application',
  },
  [ApplicationTypes.P_SIGN]: {
    slug: 'p-merki',
    translation: 'ps.application',
  },
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: {
    slug: 'andlatstilkynningar',
    translation: 'aod.application',
  },
  [ApplicationTypes.CRIMINAL_RECORD]: {
    slug: 'sakavottord',
    translation: 'cr.application',
  },
  [ApplicationTypes.FINANCIAL_AID]: {
    slug: 'fjarhagsadstod',
    translation: 'fa.application',
  },
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: {
    slug: 'okutimar',
    translation: 'dir.application',
  },
  [ApplicationTypes.EXAMPLE_PAYMENT]: {
    slug: 'greida',
    translation: 'ep.application',
  },
  [ApplicationTypes.ESTATE]: {
    slug: 'danarbu',
    translation: 'es.application',
  },
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: {
    slug: 'okuskoli',
    translation: 'dsc.application',
  },
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: {
    slug: 'vedbokarvottord',
    translation: 'mc.application',
  },
  [ApplicationTypes.MARRIAGE_CONDITIONS]: {
    slug: 'hjonavigsla',
    translation: 'mac.application',
  },
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: {
    slug: 'skuldleysisvottord',
    translation: 'ndc.application',
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY]: {
    slug: 'skil-arsreikninga-kirkjugardar',
    translation: 'fsc.application',
  },
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: {
    slug: 'skilarsreikninga',
    translation: 'fsn.application',
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION]: {
    slug: 'skil-arsreikninga-einstaklingsframbod',
    translation: 'fsie.application',
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY]: {
    slug: 'skil-arsreikninga-stjornmalaflokkar',
    translation: 'fspp.application',
  },
  [ApplicationTypes.OPERATING_LICENSE]: {
    slug: 'rekstrarleyfi',
    translation: 'ol.application',
  },
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]: {
    slug: 'samrit',
    translation: 'dld.application',
  },
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: {
    slug: 'nafnleynd-i-okutaekjaskra',
    translation: 'ta.avr.application',
  },
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: {
    slug: 'medeigandi-okutaekis',
    translation: 'ta.ccov.application',
  },
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: {
    slug: 'umradamadur-okutaekis',
    translation: 'ta.cov.application',
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: {
    slug: 'okuritakort-okumannskort',
    translation: 'ta.dtdc.application',
  },
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: {
    slug: 'endurnyja-einkanumer',
    translation: 'ta.lpr.application',
  },
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: {
    slug: 'panta-numeraplotu',
    translation: 'ta.ovlp.application',
  },
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: {
    slug: 'panta-skraningarskirteini',
    translation: 'ta.ovrc.application',
  },
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]: {
    slug: 'eigendaskipti-okutaekis',
    translation: 'ta.tvo.application',
  },
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]: {
    slug: 'okunam-okukennari',
    translation: 'dlbui.application',
  },
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: {
    slug: 'endugreidsla-afengisutgjalda',
    translation: 'atr.application',
  },
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]: {
    slug: 'evropska-sjukratryggingakortid',
    translation: 'ehic.application',
  },
  [ApplicationTypes.OLD_AGE_PENSION]: {
    slug: 'ellilifeyrir',
    translation: ['oap.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.HOUSEHOLD_SUPPLEMENT]: {
    slug: 'heimilisuppbot',
    translation: ['hs.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.CAR_RECYCLING]: {
    slug: 'skilavottord',
    translation: 'rf.cr.application',
  },
  [ApplicationTypes.PRESIDENTIAL_LIST_CREATION]: {
    slug: 'medmaelasofnun',
    translation: 'slc.application',
  },
  [ApplicationTypes.PRESIDENTIAL_LIST_SIGNING]: {
    slug: 'maela-med-frambodi',
    translation: 'sls.application',
  },
  [ApplicationTypes.PARLIAMENTARY_LIST_CREATION]: {
    slug: 'althingis-medmaelasofnun',
    translation: 'plc.application',
  },
  [ApplicationTypes.PARLIAMENTARY_LIST_SIGNING]: {
    slug: 'maela-med-althingisframbodi',
    translation: 'pls.application',
  },
  [ApplicationTypes.CITIZENSHIP]: {
    slug: 'rikisborgararettur',
    translation: ['doi.cs.application', 'uiForms.application'],
  },
  [ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY]: {
    slug: 'felagslegur-vidbotarstudningur',
    translation: [
      'asfte.application',
      'sia.application',
      'uiForms.application',
    ],
  },
  [ApplicationTypes.ENERGY_FUNDS]: {
    slug: 'rafbila-styrkur',
    translation: 'ef.application',
  },
  [ApplicationTypes.HEALTHCARE_LICENSE_CERTIFICATE]: {
    slug: 'starfsleyfis-vottord',
    translation: 'hlc.application',
  },
  [ApplicationTypes.HEALTHCARE_WORK_PERMIT]: {
    slug: 'starfsleyfis-umsokn',
    translation: 'hwp.application',
  },
  [ApplicationTypes.PENSION_SUPPLEMENT]: {
    slug: 'uppbot-a-lifeyri',
    translation: ['ul.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP]: {
    slug: 'eigendaskipti-taekis',
    translation: 'aosh.tmo.application',
  },
  [ApplicationTypes.DEATH_BENEFITS]: {
    slug: 'danarbaetur',
    translation: ['db.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.HOME_SUPPORT]: {
    slug: 'heimastudningur',
    translation: ['hst.application', 'uiForms.application'],
  },
  [ApplicationTypes.CHANGE_MACHINE_SUPERVISOR]: {
    slug: 'umradaskipti-taekis',
    translation: 'aosh.cms.application',
  },
  [ApplicationTypes.UNIVERSITY]: {
    slug: 'haskolanam',
    translation: 'uni.application',
  },
  [ApplicationTypes.DEREGISTER_MACHINE]: {
    slug: 'afskraning-taekis',
    translation: 'aosh.drm.application',
  },
  [ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT]: {
    slug: 'kaup-a-ibudarhusnaedi-i-grindavik',
    translation: ['ghb.application', 'uiForms.application'],
  },
  [ApplicationTypes.REQUEST_INSPECTION_FOR_MACHINE]: {
    slug: 'beidni-um-skodun-taekis',
    translation: 'aosh.rifm.application',
  },
  [ApplicationTypes.WORK_ACCIDENT_NOTIFICATION]: {
    slug: 'tilkynning-um-vinnuslys',
    translation: 'aosh.wan.application',
  },
  [ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND]: {
    slug: 'stjornartidindi',
    translation: 'ojoi.application',
  },
  [ApplicationTypes.ID_CARD]: {
    slug: 'nafnskirteini',
    translation: 'id.application',
  },
  [ApplicationTypes.HEALTH_INSURANCE_DECLARATION]: {
    slug: 'tryggingaryfirlysing',
    translation: ['hid.application', 'uiForms.application'],
  },
  [ApplicationTypes.STREET_REGISTRATION]: {
    slug: 'gotuskraning-taekis',
    translation: 'aosh.sr.application',
  },
  [ApplicationTypes.INCOME_PLAN]: {
    slug: 'tekjuaaetlun',
    translation: ['ip.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.NEW_PRIMARY_SCHOOL]: {
    slug: 'nyr-grunnskoli',
    translation: ['nps.application', 'uiForms.application'],
  },
  [ApplicationTypes.MACHINE_REGISTRATION]: {
    slug: 'nyskraning-taekis',
    translation: ['aosh.rnm.application'],
  },
  [ApplicationTypes.SECONDARY_SCHOOL]: {
    slug: 'framhaldsskoli',
    translation: 'ss.application',
  },
}
