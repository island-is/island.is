import { ApplicationTypes } from './ApplicationTypes'
import {
  InstitutionContentfulIds,
  InstitutionNationalIds,
  InstitutionTypes,
} from './Institution'

export const institutionMapper = {
  [ApplicationTypes.EXAMPLE_AUTH_DELEGATION]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_COMMON_ACTIONS]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_FOLDER_STRUCTURE_AND_CONVENTIONS]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_INPUTS]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_NO_INPUTS]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_PAYMENT]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.EXAMPLE_STATE_TRANSFERS]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.PASSPORT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.PASSPORT_ANNULMENT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
    contentfulId: InstitutionContentfulIds.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
    contentfulId: InstitutionContentfulIds.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.PARENTAL_LEAVE]: {
    nationalId: InstitutionNationalIds.VINNUMALASTOFNUN,
    slug: InstitutionTypes.VINNUMALASTOFNUN,
    contentfulId: InstitutionContentfulIds.VINNUMALASTOFNUN,
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
    contentfulId: InstitutionContentfulIds.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    nationalId: InstitutionNationalIds.PERSONUVERND,
    slug: InstitutionTypes.PERSONUVERND,
    contentfulId: InstitutionContentfulIds.PERSONUVERND,
  },
  [ApplicationTypes.LOGIN_SERVICE]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.INSTITUTION_COLLABORATION]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.INHERITANCE_REPORT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: {
    nationalId: InstitutionNationalIds.FJARMALA_EFNAHAGSRADUNEYTID,
    slug: InstitutionTypes.FJARMALA_EFNAHAGSRADUNEYTID,
    contentfulId: InstitutionContentfulIds.FJARMALA_EFNAHAGSRADUNEYTID,
  },
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: {
    nationalId: InstitutionNationalIds.INNHEIMTUMADUR,
    slug: InstitutionTypes.INNHEIMTUMADUR,
    contentfulId: InstitutionContentfulIds.INNHEIMTUMADUR,
  },
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: {
    nationalId: InstitutionNationalIds.UMBODSMADUR_ALTHINGIS,
    slug: InstitutionTypes.UMBODSMADUR_ALTHINGIS,
    contentfulId: InstitutionContentfulIds.UMBODSMADUR_ALTHINGIS,
  },
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
    contentfulId: InstitutionContentfulIds.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
    contentfulId: InstitutionContentfulIds.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.GENERAL_PETITION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: {
    nationalId: InstitutionNationalIds.FISKISTOFA,
    slug: InstitutionTypes.FISKISTOFA,
    contentfulId: InstitutionContentfulIds.FISKISTOFA,
  },
  [ApplicationTypes.P_SIGN]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.CRIMINAL_RECORD]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.FINANCIAL_AID]: {
    nationalId: InstitutionNationalIds.SAMBAND_SVEITARFELAGA,
    slug: InstitutionTypes.SAMBAND_SVEITARFELAGA,
    contentfulId: InstitutionContentfulIds.SAMBAND_SVEITARFELAGA,
  },
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.FJARSYSLA_RIKISINS,
    slug: InstitutionTypes.FJARSYSLA_RIKISINS,
    contentfulId: InstitutionContentfulIds.FJARSYSLA_RIKISINS,
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY]: {
    nationalId: InstitutionNationalIds.RIKISENDURSKODUN,
    slug: InstitutionTypes.RIKISENDURSKODUN,
    contentfulId: InstitutionContentfulIds.RIKISENDURSKODUN,
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION]: {
    nationalId: InstitutionNationalIds.RIKISENDURSKODUN,
    slug: InstitutionTypes.RIKISENDURSKODUN,
    contentfulId: InstitutionContentfulIds.RIKISENDURSKODUN,
  },
  [ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY]: {
    nationalId: InstitutionNationalIds.RIKISENDURSKODUN,
    slug: InstitutionTypes.RIKISENDURSKODUN,
    contentfulId: InstitutionContentfulIds.RIKISENDURSKODUN,
  },
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.OPERATING_LICENSE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.MARRIAGE_CONDITIONS]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.ESTATE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
    contentfulId: InstitutionContentfulIds.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
    contentfulId: InstitutionContentfulIds.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.OLD_AGE_PENSION]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.DISABILITY_PENSION]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.HOUSEHOLD_SUPPLEMENT]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.CAR_RECYCLING]: {
    nationalId: InstitutionNationalIds.URVINNSLUSJODUR,
    slug: InstitutionTypes.URVINNSLUSJODUR,
    contentfulId: InstitutionContentfulIds.URVINNSLUSJODUR,
  },
  [ApplicationTypes.PRESIDENTIAL_LIST_CREATION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.PRESIDENTIAL_LIST_SIGNING]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.PARLIAMENTARY_LIST_CREATION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.PARLIAMENTARY_LIST_SIGNING]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.MUNICIPAL_LIST_CREATION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.MUNICIPAL_LIST_SIGNING]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
    contentfulId: InstitutionContentfulIds.THJODSKRA,
  },
  [ApplicationTypes.CITIZENSHIP]: {
    nationalId: InstitutionNationalIds.UTLENDINGASTOFNUN,
    slug: InstitutionTypes.UTLENDINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.UTLENDINGASTOFNUN,
  },
  [ApplicationTypes.ENERGY_FUNDS]: {
    nationalId: InstitutionNationalIds.ORKUSTOFNUN,
    slug: InstitutionTypes.ORKUSTOFNUN,
    contentfulId: InstitutionContentfulIds.ORKUSTOFNUN,
  },
  [ApplicationTypes.HEALTHCARE_LICENSE_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    slug: InstitutionTypes.EMBAETTI_LANDLAEKNIS,
    contentfulId: InstitutionContentfulIds.EMBAETTI_LANDLAEKNIS,
  },
  [ApplicationTypes.HEALTHCARE_WORK_PERMIT]: {
    nationalId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    slug: InstitutionTypes.EMBAETTI_LANDLAEKNIS,
    contentfulId: InstitutionContentfulIds.EMBAETTI_LANDLAEKNIS,
  },
  [ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.PENSION_SUPPLEMENT]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.DEATH_BENEFITS]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.CHANGE_MACHINE_SUPERVISOR]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.HOME_SUPPORT]: {
    nationalId: InstitutionNationalIds.SAMBAND_SVEITARFELAGA,
    slug: InstitutionTypes.SAMBAND_SVEITARFELAGA,
    contentfulId: InstitutionContentfulIds.SAMBAND_SVEITARFELAGA,
  },
  [ApplicationTypes.UNIVERSITY]: {
    nationalId: InstitutionNationalIds.HASKOLARADUNEYTI,
    slug: InstitutionTypes.HASKOLARADUNEYTI,
    contentfulId: InstitutionContentfulIds.HASKOLARADUNEYTI,
  },
  [ApplicationTypes.DEREGISTER_MACHINE]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.REQUEST_INSPECTION_FOR_MACHINE]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND]: {
    nationalId: InstitutionNationalIds.DOMSMALA_RADUNEYTID,
    slug: InstitutionTypes.DOMSMALARADUNEYTID,
    contentfulId: InstitutionContentfulIds.DOMSMALARADUNEYTID,
  },
  [ApplicationTypes.ID_CARD]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
    contentfulId: InstitutionContentfulIds.SYSLUMENN,
  },
  [ApplicationTypes.HEALTH_INSURANCE_DECLARATION]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
    contentfulId: InstitutionContentfulIds.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.STREET_REGISTRATION]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.INCOME_PLAN]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.NEW_PRIMARY_SCHOOL]: {
    nationalId: InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
    slug: InstitutionTypes.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
    contentfulId: InstitutionContentfulIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
  },
  [ApplicationTypes.MACHINE_REGISTRATION]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.RENTAL_AGREEMENT]: {
    nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    slug: InstitutionTypes.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    contentfulId: InstitutionContentfulIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  },
  [ApplicationTypes.TERMINATE_RENTAL_AGREEMENT]: {
    nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    slug: InstitutionTypes.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    contentfulId: InstitutionContentfulIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  },
  [ApplicationTypes.FIRE_COMPENSATION_APPRAISAL]: {
    nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    slug: InstitutionTypes.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    contentfulId: InstitutionContentfulIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  },
  [ApplicationTypes.WORK_ACCIDENT_NOTIFICATION]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.PRACTICAL_EXAM]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.SEMINAR_REGISTRATION]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.TRAINING_LICENSE_ON_A_WORK_MACHINE]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
    contentfulId: InstitutionContentfulIds.VINNUEFTIRLITID,
  },
  [ApplicationTypes.SECONDARY_SCHOOL]: {
    nationalId: InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
    slug: InstitutionTypes.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
    contentfulId: InstitutionContentfulIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
  },
  [ApplicationTypes.UNEMPLOYMENT_BENEFITS]: {
    nationalId: InstitutionNationalIds.VINNUMALASTOFNUN,
    slug: InstitutionTypes.VINNUMALASTOFNUN,
    contentfulId: InstitutionContentfulIds.VINNUMALASTOFNUN,
  },
  [ApplicationTypes.ACTIVATION_ALLOWANCE]: {
    nationalId: InstitutionNationalIds.VINNUMALASTOFNUN,
    slug: InstitutionTypes.VINNUMALASTOFNUN,
    contentfulId: InstitutionContentfulIds.VINNUMALASTOFNUN,
  },
  [ApplicationTypes.CAR_RENTAL_FEE_CATEGORY]: {
    nationalId: InstitutionNationalIds.INNHEIMTUMADUR,
    slug: InstitutionTypes.INNHEIMTUMADUR,
    contentfulId: InstitutionContentfulIds.INNHEIMTUMADUR,
  },
  [ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
    contentfulId: InstitutionContentfulIds.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.LEGAL_GAZETTE]: {
    nationalId: InstitutionNationalIds.DOMSMALA_RADUNEYTID,
    slug: InstitutionTypes.DOMSMALARADUNEYTID,
    contentfulId: InstitutionContentfulIds.DOMSMALARADUNEYTID,
  },
  [ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
    contentfulId: InstitutionContentfulIds.SAMGONGUSTOFA,
  },
  [ApplicationTypes.REGISTRATION_OF_NEW_PROPERTY_NUMBERS]: {
    nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    slug: InstitutionTypes.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    contentfulId: InstitutionContentfulIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  },
  [ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID]: {
    nationalId: InstitutionNationalIds.HEILSUGAESLA_HOFUDBORDARSVAEDISINS,
    slug: InstitutionTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS,
    contentfulId: InstitutionContentfulIds.HEILSUGAESLA_HOFUDBORDARSVAEDISINS,
  },
}
