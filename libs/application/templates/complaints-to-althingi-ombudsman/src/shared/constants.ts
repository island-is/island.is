export enum OmbudsmanComplaintTypeEnum {
  PROCEEDINGS = 'proceedings',
  DECISION = 'decision',
}

export enum ComplaineeTypes {
  GOVERNMENT = 'government',
  OTHER = 'other',
}

export enum ComplainedForTypes {
  MYSELF = 'myself',
  SOMEONEELSE = 'someoneelse',
}

export enum GenderAnswerOptions {
  MAlE = 'male',
  FEMALE = 'female',
  NONBINARY = 'nonBinary',
  OTHER = 'other',
  DECLINED = 'declinedToAnswer'
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const UPLOAD_ACCEPT =
  '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic, .xlsx, .xls'
