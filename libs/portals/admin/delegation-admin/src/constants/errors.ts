import { m } from '../lib/messages'
import { ErrorCodes } from '@island.is/shared/utils'

export const FORM_ERRORS = {
  [ErrorCodes.ZENDESK_NATIONAL_IDS_MISMATCH]: m.nationalIdsMismatchError,
  [ErrorCodes.ZENDESK_CUSTOM_FIELDS_MISSING]: m.zendeskCustomFieldsMissingError,
  [ErrorCodes.ZENDESK_TAG_MISSING]: m.zendeskMissingTagError,
  [ErrorCodes.ZENDESK_STATUS]: m.zendeskCaseNotSolvedError,
  [ErrorCodes.INPUT_VALIDATION_SAME_NATIONAL_ID]: m.sameNationalIdError,
  [ErrorCodes.INPUT_VALIDATION_INVALID_PERSON]: m.validPersonError,
}
