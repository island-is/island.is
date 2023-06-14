export enum ApplicationTypes {
  EXAMPLE = 'ExampleForm',
  PASSPORT = 'Passport',
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
    translation: 'pl.application',
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    slug: 'skjalaveita',
    translation: 'dpo.application',
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    slug: 'sjukratryggingar',
    translation: 'hi.application',
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: {
    slug: 'breytt-logheimili-barns',
    translation: 'crc.application',
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    slug: 'breytt-logheimili-barns-v2',
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
    translation: 'ctao.application',
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
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: {
    slug: 'skilarsreikninga',
    translation: 'fsn.application',
  },
  [ApplicationTypes.OPERATING_LCENSE]: {
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
  [ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD]: {
    slug: 'okuritakort-fyrirtaekjakort',
    translation: 'ta.dtcc.application',
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: {
    slug: 'okuritakort-okumannskort',
    translation: 'ta.dtdc.application',
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD]: {
    slug: 'okuritakort-verkstaediskort',
    translation: 'ta.dtwc.application',
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
}
