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
  MALE = 'Karl/Karlkyns',
  FEMALE = 'Kona/Kvenkyns',
  NONBINARY = 'Kvár/Kynsegin',
  OTHER = 'Annað',
  DECLINED = 'Vil ekki svara',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const UPLOAD_ACCEPT =
  '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic, .xlsx, .xls'
