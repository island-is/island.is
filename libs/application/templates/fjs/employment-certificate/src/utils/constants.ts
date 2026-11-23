import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMISSION_FAILED = 'submissionFailed',
  COMPLETED = 'completed',
  PROCESSING = 'processing',
  CLOSED = 'closed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export const YES = 'yes'

export const ELIGIBILITY_ID = 'employmentEligibility'
export const PREVIEW_ID = 'employmentHistoryPreview'
export const SUBMIT_RESULT_ID = 'submitApplication'

export const PREVIEW_VERSION_ANSWER = 'previewVersion'
export const INSTITUTION_IDS_ANSWER = 'institutionIds'
export const INCLUDE_UNION_ANSWER = 'includeUnion'
export const COMMENT_ANSWER = 'comment'

/** Fjársýsla ríkisins' limit, after trimming. */
export const COMMENT_MAX_LENGTH = 4000

export const MAILBOX_PATH = '/minarsidur/postholf'
export const MY_PAGES_PATH = '/minarsidur'

/** Fjársýsla ríkisins' support address for certificates; it must confirm it. */
export const SUPPORT_EMAIL_LINK = 'mailto:starfsvottord@fjs.is'
