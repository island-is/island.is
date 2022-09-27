import {
  ApplicationTypes,
  InstitutionTypes,
} from '@island.is/application/types'

export const institutionMapper = {
  [ApplicationTypes.EXAMPLE]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.PASSPORT]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.DRIVING_LICENSE]: InstitutionTypes.RIKISLOGREGLUSTJORI,
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]:
    InstitutionTypes.SAMGONGUSTOFA,
  [ApplicationTypes.PARENTAL_LEAVE]: InstitutionTypes.VINNUMALASTOFNUN,
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]:
    InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.HEALTH_INSURANCE]:
    InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: InstitutionTypes.SYSLUMENN,
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]:
    InstitutionTypes.PERSONUVERND,
  [ApplicationTypes.LOGIN_SERVICE]: InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.INSTITUTION_COLLABORATION]:
    InstitutionTypes.STAFRAENT_ISLAND,
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]:
    InstitutionTypes.FJARMALA_EFNAHAGSRADUNEYTID,
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: InstitutionTypes.INNHEIMTUMADUR,
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]:
    InstitutionTypes.UMBODSMADUR_ALTHINGIS,
  [ApplicationTypes.ACCIDENT_NOTIFICATION]:
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
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]:
    InstitutionTypes.RIKISLOGREGLUSTJORI,
}
