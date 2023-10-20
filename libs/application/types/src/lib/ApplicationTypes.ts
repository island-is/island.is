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
  CHILDREN_RESIDENCE_CHANGE = 'ChildrenResidenceChange',
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
  FINANCIAL_STATEMENTS_INAO = 'FinancialStatementsInao',
  OPERATING_LCENSE = 'OperatingLicense',
  ESTATE = 'Estate',
  DRIVING_LICENSE_DUPLICATE = 'DrivingLicenseDuplicate',
  ANONYMITY_IN_VEHICLE_REGISTRY = 'AnonymityInVehicleRegistry',
  CHANGE_CO_OWNER_OF_VEHICLE = 'ChangeCoOwnerOfVehicle',
  CHANGE_OPERATOR_OF_VEHICLE = 'ChangeOperatorOfVehicle',
  DIGITAL_TACHOGRAPH_COMPANY_CARD = 'DigitalTachographCompanyCard',
  DIGITAL_TACHOGRAPH_DRIVERS_CARD = 'DigitalTachographDriversCard',
  DIGITAL_TACHOGRAPH_WORKSHOP_CARD = 'DigitalTachographWorkshopCard',
  LICENSE_PLATE_RENEWAL = 'LicensePlateRenewal',
  ORDER_VEHICLE_LICENSE_PLATE = 'OrderVehicleLicensePlate',
  ORDER_VEHICLE_REGISTRATION_CERTIFICATE = 'OrderVehicleRegistrationCertificate',
  TRANSFER_OF_VEHICLE_OWNERSHIP = 'TransferOfVehicleOwnership',
  DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR = 'DrivingLicenseBookUpdateInstructor',
  ALCOHOL_TAX_REDEMPTION = 'AlcoholTaxRedemption',
  EUROPEAN_HEALTH_INSURANCE_CARD = 'EuropeanHealthInsuranceCard',
  NEW_TYPE_OF_APPLICATION = 'NewTypeOfApplication',
  CARAMEL = 'Caramel',
}

export enum ApplicationFormTypes {
  DYNAMIC = 'dynamic',
  STATIC = 'static',
}

interface ApplicationConfiguration {
  slug: string
  translation: string
  formType: ApplicationFormTypes
}

export const ApplicationConfigurations: Record<
  ApplicationTypes,
  ApplicationConfiguration
> = {
  [ApplicationTypes.CARAMEL]: {
    slug: 'caramel',
    translation: 'caramel.application',
    formType: ApplicationFormTypes.DYNAMIC,
  },
  [ApplicationTypes.EXAMPLE]: {
    slug: 'example',
    translation: 'example.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.PASSPORT]: {
    slug: 'vegabref',
    translation: 'pa.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.PASSPORT_ANNULMENT]: {
    slug: 'tilkynna-vegabref',
    translation: 'paa.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: {
    slug: 'aefingaakstur',
    translation: 'dlp.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    slug: 'okuskirteini',
    translation: 'dl.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: {
    slug: 'akstursmat',
    translation: 'dla.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.PARENTAL_LEAVE]: {
    slug: 'faedingarorlof',
    translation: 'pl.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    slug: 'skjalaveita',
    translation: 'dpo.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    slug: 'sjukratryggingar',
    translation: 'hi.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: {
    slug: 'breytt-logheimili-barns',
    translation: 'crc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    slug: 'breytt-logheimili-barns-v2',
    translation: 'crc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    slug: 'kvortun-til-personuverndar',
    translation: 'dpac.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.LOGIN_SERVICE]: {
    slug: 'innskraningarthjonusta',
    translation: 'ls.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.INHERITANCE_REPORT]: {
    slug: 'erfdafjarskyrsla',
    translation: 'ir.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.INSTITUTION_COLLABORATION]: {
    slug: 'samstarf',
    translation: 'ia.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: {
    slug: 'fjarmognun-rikisverkefni',
    translation: 'affgp.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: {
    slug: 'greidsluaaetlun',
    translation: 'pdpp.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: {
    slug: 'kvortun-til-umbodsmanns-althingis',
    translation: 'ctao.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: {
    slug: 'slysatilkynning',
    translation: 'an.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.GENERAL_PETITION]: {
    slug: 'undirskriftalisti',
    translation: 'gpl.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: {
    slug: 'veidileyfi',
    translation: 'gfl.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.P_SIGN]: {
    slug: 'p-merki',
    translation: 'ps.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: {
    slug: 'andlatstilkynningar',
    translation: 'aod.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.CRIMINAL_RECORD]: {
    slug: 'sakavottord',
    translation: 'cr.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.FINANCIAL_AID]: {
    slug: 'fjarhagsadstod',
    translation: 'fa.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: {
    slug: 'okutimar',
    translation: 'dir.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.EXAMPLE_PAYMENT]: {
    slug: 'greida',
    translation: 'ep.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ESTATE]: {
    slug: 'danarbu',
    translation: 'es.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: {
    slug: 'okuskoli',
    translation: 'dsc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: {
    slug: 'vedbokarvottord',
    translation: 'mc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.MARRIAGE_CONDITIONS]: {
    slug: 'hjonavigsla',
    translation: 'mac.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: {
    slug: 'skuldleysisvottord',
    translation: 'ndc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: {
    slug: 'skilarsreikninga',
    translation: 'fsn.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.OPERATING_LCENSE]: {
    slug: 'rekstrarleyfi',
    translation: 'ol.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]: {
    slug: 'samrit',
    translation: 'dld.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: {
    slug: 'nafnleynd-i-okutaekjaskra',
    translation: 'ta.avr.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: {
    slug: 'medeigandi-okutaekis',
    translation: 'ta.ccov.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: {
    slug: 'umradamadur-okutaekis',
    translation: 'ta.cov.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD]: {
    slug: 'okuritakort-fyrirtaekjakort',
    translation: 'ta.dtcc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: {
    slug: 'okuritakort-okumannskort',
    translation: 'ta.dtdc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD]: {
    slug: 'okuritakort-verkstaediskort',
    translation: 'ta.dtwc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: {
    slug: 'endurnyja-einkanumer',
    translation: 'ta.lpr.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: {
    slug: 'panta-numeraplotu',
    translation: 'ta.ovlp.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: {
    slug: 'panta-skraningarskirteini',
    translation: 'ta.ovrc.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]: {
    slug: 'eigendaskipti-okutaekis',
    translation: 'ta.tvo.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]: {
    slug: 'okunam-okukennari',
    translation: 'dlbui.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: {
    slug: 'endugreidsla-afengisutgjalda',
    translation: 'atr.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]: {
    slug: 'evropska-sjukratryggingakortid',
    translation: 'ehic.application',
    formType: ApplicationFormTypes.STATIC,
  },
  [ApplicationTypes.NEW_TYPE_OF_APPLICATION]: {
    slug: 'ny-umsoknartegund',
    translation: 'ntoa.application',
    formType: ApplicationFormTypes.DYNAMIC,
  },
}
