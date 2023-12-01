import { ApplicationTypes } from './ApplicationTypes'
import { InstitutionTypes } from './InstitutionTypes'

export const institutionMapper = {
  [ApplicationTypes.EXAMPLE]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.PASSPORT]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.PASSPORT_ANNULMENT]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]:
    InstitutionTypes.RIKISLOGREGLUSTJORI,
  [ApplicationTypes.DRIVING_LICENSE]: InstitutionTypes.RIKISLOGREGLUSTJORI,
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.PARENTAL_LEAVE]: InstitutionTypes.VINNUMALASTOFNUN,
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]:
    InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.HEALTH_INSURANCE]:
    InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]:
    InstitutionTypes.PERSONUVERND,
  [ApplicationTypes.LOGIN_SERVICE]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.INSTITUTION_COLLABORATION]:
    InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.INHERITANCE_REPORT]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]:
    InstitutionTypes.FJARMALA_EFNAHAGSRADUNEYTID,
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: InstitutionTypes.INNHEIMTUMADUR,
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]:
    InstitutionTypes.UMBODSMADUR_ALTHINGIS,
  [ApplicationTypes.ACCIDENT_NOTIFICATION]:
    InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]:
    InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  [ApplicationTypes.GENERAL_PETITION]: InstitutionTypes.THJODSKRA,
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: InstitutionTypes.FISKISTOFA,
  [ApplicationTypes.P_SIGN]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.CRIMINAL_RECORD]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.FINANCIAL_AID]: InstitutionTypes.SAMBAND_SVEITARFELAGA,
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.EXAMPLE_PAYMENT]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: InstitutionTypes.FJARSYSLA_RIKISINS,
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]:
    InstitutionTypes.RIKISENDURSKODUN,
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.OPERATING_LCENSE]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.MARRIAGE_CONDITIONS]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.ESTATE]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]:
    InstitutionTypes.RIKISLOGREGLUSTJORI,
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.SIGNATURE_LIST_CREATION]: InstitutionTypes.THJODSKRA,
  [ApplicationTypes.SIGNATURE_LIST_SIGNING]: InstitutionTypes.THJODSKRA,
  [ApplicationTypes.CITIZENSHIP]: InstitutionTypes.UTLENDINGASTOFNUN,
  [ApplicationTypes.UNIVERSITY]: InstitutionTypes.HASKOLARADUNEYTI,
}
