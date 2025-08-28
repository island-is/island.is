export type NotApplicable = typeof NOT_APPLICABLE
export const NOT_APPLICABLE = 'notApplicable'

export enum SelfAssessmentCurrentEmploymentStatus {
  NEVER_HAD_A_PAID_JOB = 'neverHadAPaidJob', // I have never had a paid job
  SELF_EMPLOYED = 'selfEmployed', // Self-employed
  FULL_TIME_WORKER = 'fullTimeWorker', // Full-time worker
  PART_TIME_WORKER = 'partTimeWorker', // Part-time worker
  CURRENTLY_STUDYING = 'currentlyStudying', // I am currently studying
  JOB_SEARCH_REGISTERED = 'jobSearchRegistered', // In job search (registered with VMST)
  JOB_SEARCH_NOT_REGISTERED = 'jobSearchNotRegistered', // In job search (not registered with VMST)
  VOLOUNTEER_OR_TEST_WORK = 'volunteerOrTestWork', // In volunteer work/test work
  NO_PARTICIPATION = 'noParticipation', // No participation in the labour market due to illness or disability
  OTHER = 'other', // Other
}

export enum EligibleReasonCodes {
  APPLICANT_AGE_OUT_OF_RANGE = 'APPLICANT_AGE_OUT_OF_RANGE',
  BASE_CERT_NOT_FOUND = 'BASE_CERT_NOT_FOUND',
  BASE_CERT_DATE_INVALID = 'BASE_CERT_DATE_INVALID',
  BASE_CERT_OLDER_THAN_7YEARS = 'BASE_CERT_OLDER_THAN_7YEARS',
  BASE_CERT_OLDER_THAN_6MONTHS = 'BASE_CERT_OLDER_THAN_6MONTHS',
}

export enum MedicalAndRehabilitationPaymentsApplicationType {
  SG1 = 'SJUKRAGREIDSLUR_FYRSTA',
  SG2 = 'SJUKRAGREIDSLUR_FRAMHALDS',
  EH1 = 'ENDURHAEFINGARGREIDSLUR_FYRSTA',
  EH2 = 'ENDURHAEFINGARGREIDSLUR_FRAMHALDS',
}

export enum MedicalAndRehabilitationPaymentsConfirmationType {
  BID_EFTIR_URRAEDI = 'BID_EFTIR_URRAEDI',
  ENDURHAEFING = 'ENDURHAEFING',
  HEILSUBRESTUR = 'HEILSUBRESTUR',
  VIDURKENND_MEDFERD = 'VIDURKENND_MEDFERD',
}
