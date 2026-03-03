export enum ApplicationTypes {
  EXAMPLE_AUTH_DELEGATION = 'ExampleAuthDelegation',
  EXAMPLE_COMMON_ACTIONS = 'ExampleCommonActions',
  EXAMPLE_FOLDER_STRUCTURE_AND_CONVENTIONS = 'ExampleFolderStructureAndConventions',
  EXAMPLE_INPUTS = 'ExampleInputs',
  EXAMPLE_NO_INPUTS = 'ExampleNoInputs',
  EXAMPLE_PAYMENT = 'ExamplePayment',
  EXAMPLE_STATE_TRANSFERS = 'ExampleStateTransfers',
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
  DRIVING_SCHOOL_CONFIRMATION = 'DrivingSchoolConfirmation',
  MORTGAGE_CERTIFICATE = 'MortgageCertificate',
  MARRIAGE_CONDITIONS = 'MarriageConditions',
  NO_DEBT_CERTIFICATE = 'NoDebtCertificate',
  FINANCIAL_STATEMENT_CEMETERY = 'FinancialStatementCemetery',
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
  DISABILITY_PENSION = 'DisabilityPension',
  HOUSEHOLD_SUPPLEMENT = 'HouseholdSupplement',
  CAR_RECYCLING = 'CarRecycling',
  PRESIDENTIAL_LIST_CREATION = 'PresidentialListCreation',
  PRESIDENTIAL_LIST_SIGNING = 'PresidentialListSigning',
  PARLIAMENTARY_LIST_CREATION = 'ParliamentaryListCreation',
  PARLIAMENTARY_LIST_SIGNING = 'ParliamentaryListSigning',
  MUNICIPAL_LIST_CREATION = 'MunicipalListCreation',
  MUNICIPAL_LIST_SIGNING = 'MunicipalListSigning',
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
  PRACTICAL_EXAM = 'PracticalExam',
  RENTAL_AGREEMENT = 'RentalAgreement',
  TERMINATE_RENTAL_AGREEMENT = 'TerminateRentalAgreement',
  SEMINAR_REGISTRATION = 'SeminarRegistration',
  TRAINING_LICENSE_ON_A_WORK_MACHINE = 'TrainingLicenseOnAWorkMachine',
  SECONDARY_SCHOOL = 'SecondarySchool',
  UNEMPLOYMENT_BENEFITS = 'UnemploymentBenefits',
  ACTIVATION_ALLOWANCE = 'ActivationAllowance',
  CAR_RENTAL_FEE_CATEGORY = 'CarRentalFeeCategory',
  CAR_RENTAL_DAYRATE_RETURNS = 'CarRentalDayrateReturns',
  MEDICAL_AND_REHABILITATION_PAYMENTS = 'MedicalAndRehabilitationPayments',
  FIRE_COMPENSATION_APPRAISAL = 'FireCompensationAppraisal',
  LEGAL_GAZETTE = 'LegalGazette',
  EXEMPTION_FOR_TRANSPORTATION = 'ExemptionForTransportation',
  REGISTRATION_OF_NEW_PROPERTY_NUMBERS = 'RegistrationOfNewPropertyNumbers',
  MILE_CAR = 'MileCar',
  HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID = 'HeilsugaeslaHofudborgarsvaedisinsNamskeid',
}

export const ApplicationConfigurations = {
  [ApplicationTypes.EXAMPLE_COMMON_ACTIONS]: {
    slug: 'example-common-actions',
    translation: 'eca.application',
  },
  [ApplicationTypes.EXAMPLE_FOLDER_STRUCTURE_AND_CONVENTIONS]: {
    slug: 'example-folder-structure-and-conventions',
    translation: 'exfsc.application',
  },
  [ApplicationTypes.EXAMPLE_INPUTS]: {
    slug: 'example-inputs',
    translation: ['exi.application', 'uiForms.application'],
  },
  [ApplicationTypes.EXAMPLE_NO_INPUTS]: {
    slug: 'example-no-inputs',
    translation: 'eni.application',
  },
  [ApplicationTypes.EXAMPLE_PAYMENT]: {
    slug: 'example-payment',
    translation: 'ep.application',
  },
  [ApplicationTypes.EXAMPLE_AUTH_DELEGATION]: {
    slug: 'example-auth-delegation',
    translation: 'exad.application',
  },
  [ApplicationTypes.EXAMPLE_STATE_TRANSFERS]: {
    slug: 'example-state-transfers',
    translation: 'ets.application',
  },
  [ApplicationTypes.PASSPORT]: {
    slug: 'vegabref',
    translation: 'pa.application',
  },
  [ApplicationTypes.PASSPORT_ANNULMENT]: {
    slug: 'tilkynna-vegabref',
    translation: ['paa.application', 'uiForms.application'],
  },
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: {
    slug: 'aefingaakstur',
    translation: 'dlp.application',
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    slug: 'okuskirteini',
    translation: ['dl.application', 'uiForms.application'],
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
    translation: ['hi.application', 'uiForms.application'],
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    slug: 'breytt-logheimili-barns',
    translation: 'crc.application',
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    slug: 'kvortun-til-personuverndar',
    translation: ['dpac.application', 'uiForms.application'],
  },
  [ApplicationTypes.LOGIN_SERVICE]: {
    slug: 'innskraningarthjonusta',
    translation: ['ls.application', 'uiForms.application'],
  },
  [ApplicationTypes.INHERITANCE_REPORT]: {
    slug: 'erfdafjarskyrsla',
    translation: ['ir.application', 'uiForms.application'],
  },
  [ApplicationTypes.INSTITUTION_COLLABORATION]: {
    slug: 'samstarf',
    translation: ['ia.application', 'uiForms.application'],
  },
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: {
    slug: 'fjarmognun-rikisverkefni',
    translation: ['affgp.application', 'uiForms.application'],
  },
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: {
    slug: 'greidsluaaetlun',
    translation: ['pdpp.application', 'uiForms.application'],
  },
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: {
    slug: 'kvortun-til-umbodsmanns-althingis',
    translation: ['ctao.application', 'uiForms.application'],
  },
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: {
    slug: 'slysatilkynning',
    translation: ['an.application', 'uiForms.application'],
  },
  [ApplicationTypes.GENERAL_PETITION]: {
    slug: 'undirskriftalisti',
    translation: 'gpl.application',
  },
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: {
    slug: 'veidileyfi',
    translation: ['gfl.application', 'uiForms.application'],
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
    translation: ['cr.application', 'uiForms.application'],
  },
  [ApplicationTypes.FINANCIAL_AID]: {
    slug: 'fjarhagsadstod',
    translation: 'fa.application',
  },
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: {
    slug: 'okutimar',
    translation: 'dir.application',
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
    translation: ['mc.application', 'uiForms.application'],
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
    translation: ['dld.application', 'uiForms.application'],
  },
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: {
    slug: 'nafnleynd-i-okutaekjaskra',
    translation: ['ta.avr.application', 'uiForms.application'],
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
    translation: ['ta.dtdc.application', 'uiForms.application'],
  },
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: {
    slug: 'endurnyja-einkanumer',
    translation: ['ta.lpr.application', 'uiForms.application'],
  },
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: {
    slug: 'panta-numeraplotu',
    translation: ['ta.ovlp.application', 'uiForms.application'],
  },
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: {
    slug: 'panta-skraningarskirteini',
    translation: ['ta.ovrc.application', 'uiForms.application'],
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
    translation: ['ehic.application', 'uiForms.application'],
  },
  [ApplicationTypes.OLD_AGE_PENSION]: {
    slug: 'ellilifeyrir',
    translation: ['oap.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.DISABILITY_PENSION]: {
    slug: 'ororkulifeyrir',
    translation: ['dp.application', 'sia.application', 'uiForms.application'],
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
  [ApplicationTypes.MUNICIPAL_LIST_CREATION]: {
    slug: 'sveitarstjornar-medmaelasofnun',
    translation: 'mlc.application',
  },
  [ApplicationTypes.MUNICIPAL_LIST_SIGNING]: {
    slug: 'maela-med-sveitarstjornarframbodi',
    translation: 'mls.application',
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
    translation: ['hlc.application', 'uiForms.application'],
  },
  [ApplicationTypes.HEALTHCARE_WORK_PERMIT]: {
    slug: 'starfsleyfis-umsokn',
    translation: ['hwp.application', 'uiForms.application'],
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
    translation: ['uni.application', 'uiForms.application'],
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
    translation: ['ojoi.application', 'uiForms.application'],
  },
  [ApplicationTypes.ID_CARD]: {
    slug: 'nafnskirteini',
    translation: ['id.application', 'uiForms.application'],
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
    slug: 'grunnskoli',
    translation: ['nps.application', 'uiForms.application'],
  },
  [ApplicationTypes.MACHINE_REGISTRATION]: {
    slug: 'nyskraning-taekis',
    translation: ['aosh.rnm.application', 'uiForms.application'],
  },
  [ApplicationTypes.PRACTICAL_EXAM]: {
    slug: 'verklegt-prof',
    translation: ['aosh.pe.application', 'uiForms.application'],
  },
  [ApplicationTypes.RENTAL_AGREEMENT]: {
    slug: 'leigusamningur',
    translation: ['ra.application', 'uiForms.application'],
  },
  [ApplicationTypes.TERMINATE_RENTAL_AGREEMENT]: {
    slug: 'uppsogn-eda-riftun-leigusamnings',
    translation: ['tra.application', 'uiForms.application'],
  },
  [ApplicationTypes.SEMINAR_REGISTRATION]: {
    slug: 'vinnueftirlitid-namskeid',
    translation: ['aosh.sem.application', 'uiForms.application'],
  },
  [ApplicationTypes.TRAINING_LICENSE_ON_A_WORK_MACHINE]: {
    slug: 'kennslurettindi-a-vinnuvel',
    translation: ['aosh.tlwm.application', 'uiForms.application'],
  },
  [ApplicationTypes.SECONDARY_SCHOOL]: {
    slug: 'framhaldsskoli',
    translation: ['ss.application', 'uiForms.application'],
  },
  [ApplicationTypes.UNEMPLOYMENT_BENEFITS]: {
    slug: 'atvinnuleysisbaetur',
    translation: ['vmst.ub.application', 'uiForms.application'],
  },
  [ApplicationTypes.ACTIVATION_ALLOWANCE]: {
    slug: 'virknistyrkur',
    translation: ['aa.application', 'uiForms.application'],
  },
  [ApplicationTypes.CAR_RENTAL_FEE_CATEGORY]: {
    slug: 'bilaleigu-gjaldflokkur',
    translation: ['rsk.crfc.application', 'uiForms.application'],
  },
  [ApplicationTypes.CAR_RENTAL_DAYRATE_RETURNS]: {
    slug: 'skilagrein-daggjalds-utleigudagar',
    translation: ['rsk.crdr.application', 'uiForms.application'],
  },
  [ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS]: {
    slug: 'sjukra-og-endurhaefingargreidslur',
    translation: ['marp.application', 'sia.application', 'uiForms.application'],
  },
  [ApplicationTypes.FIRE_COMPENSATION_APPRAISAL]: {
    slug: 'endurmat-brunabotamats',
    translation: ['fca.application', 'uiForms.application'],
  },
  [ApplicationTypes.LEGAL_GAZETTE]: {
    slug: 'logbirtingarblad',
    translation: 'lg.application',
  },
  [ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION]: {
    slug: 'undanthaga-vegna-flutnings',
    translation: ['ta.eft.application', 'uiForms.application'],
  },
  [ApplicationTypes.REGISTRATION_OF_NEW_PROPERTY_NUMBERS]: {
    slug: 'skraning-fasteignanumera',
    translation: ['ronp.application', 'uiForms.application'],
  },
  [ApplicationTypes.MILE_CAR]: {
    slug: 'skraning-milubila',
    translation: ['mcar.application', 'uiForms.application'],
  },
  [ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID]: {
    slug: 'hh-namskeid',
    translation: ['hh.courses.application', 'uiForms.application'],
  },
}
