import { ApplicationTypes } from '../types/ApplicationTypes'
import { FormatMessage } from '../types/external'
import { coreInstitutionMessages } from './messages'

export const getInstitutionMapper = (formatMessage: FormatMessage) => {
  const institutionMapper = {
    [ApplicationTypes.EXAMPLE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.EXAMPLE],
    ),
    [ApplicationTypes.PASSPORT]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.PASSPORT],
    ),
    [ApplicationTypes.DRIVING_LICENSE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.DRIVING_LICENSE],
    ),
    [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL],
    ),
    [ApplicationTypes.PARENTAL_LEAVE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.PARENTAL_LEAVE],
    ),
    [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING],
    ),
    [ApplicationTypes.HEALTH_INSURANCE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.HEALTH_INSURANCE],
    ),
    [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.CHILDREN_RESIDENCE_CHANGE],
    ),
    [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: formatMessage(
      coreInstitutionMessages[
        ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT
      ],
    ),
    [ApplicationTypes.LOGIN_SERVICE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.LOGIN_SERVICE],
    ),
    [ApplicationTypes.INSTITUTION_COLLABORATION]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.INSTITUTION_COLLABORATION],
    ),
    [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS],
    ),
    [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN],
    ),
    [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: formatMessage(
      coreInstitutionMessages[
        ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN
      ],
    ),
    [ApplicationTypes.ACCIDENT_NOTIFICATION]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.ACCIDENT_NOTIFICATION],
    ),
    [ApplicationTypes.GENERAL_PETITION]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.GENERAL_PETITION],
    ),
    [ApplicationTypes.GENERAL_FISHING_LICENSE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.GENERAL_FISHING_LICENSE],
    ),
    [ApplicationTypes.P_SIGN]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.P_SIGN],
    ),
    [ApplicationTypes.CRIMINAL_RECORD]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.CRIMINAL_RECORD],
    ),
    [ApplicationTypes.FINANCIAL_AID]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.FINANCIAL_AID],
    ),
    [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: formatMessage(
      coreInstitutionMessages[
        ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS
      ],
    ),
    [ApplicationTypes.EXAMPLE_PAYMENT]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.EXAMPLE_PAYMENT],
    ),
    [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION],
    ),
    [ApplicationTypes.MORTGAGE_CERTIFICATE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.MORTGAGE_CERTIFICATE],
    ),
    [ApplicationTypes.NO_DEBT_CERTIFICATE]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.NO_DEBT_CERTIFICATE],
    ),
    [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: formatMessage(
      coreInstitutionMessages[ApplicationTypes.FINANCIAL_STATEMENTS_INAO],
    ),
  }

  return institutionMapper
}
