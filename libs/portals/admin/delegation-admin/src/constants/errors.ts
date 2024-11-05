import { MessageDescriptor } from 'react-intl'

import { ErrorCodes } from '@island.is/shared/utils'

import { m } from '../lib/messages'

export const FORM_ERRORS: Record<ErrorCodes, MessageDescriptor> = {
  [ErrorCodes.ZENDESK_NATIONAL_IDS_MISMATCH]: m.nationalIdsMismatchError,
  [ErrorCodes.ZENDESK_CUSTOM_FIELDS_MISSING]: m.zendeskCustomFieldsMissingError,
  [ErrorCodes.ZENDESK_TAG_MISSING]: m.zendeskMissingTagError,
  [ErrorCodes.ZENDESK_STATUS]: m.zendeskCaseNotSolvedError,
  [ErrorCodes.INPUT_VALIDATION_SAME_NATIONAL_ID]: m.sameNationalIdError,
  [ErrorCodes.INPUT_VALIDATION_INVALID_PERSON]: m.validPersonError,
  [ErrorCodes.INVALID_DATE_FORMAT]: m.invalidDateFormatError,
  [ErrorCodes.COULD_NOT_CREATE_DELEGATION]: m.couldNotCreateDelegationError,
  [ErrorCodes.REFERENCE_ID_ALREADY_EXISTS]: m.referenceIdAlreadyExistsError,
}
