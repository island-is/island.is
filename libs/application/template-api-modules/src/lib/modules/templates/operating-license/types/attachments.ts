export type AttachmentPath = {
  path: string
  prefix: string
}

export const AttachmentPaths: AttachmentPath[] = [
  {
    path: 'attachments.healthLicense.file',
    prefix: 'starfsleyfi_heilbridisnefndar',
  },
  {
    path: 'attachments.formerLicenseHolderConfirmation.file',
    prefix: 'stadfesting_fyrri_leyfishafa',
  },
  {
    path: 'attachments.houseBlueprints.file',
    prefix: 'teikning_husnaedi',
  },
  {
    path: 'attachments.outsideBlueprints.file',
    prefix: 'teikning_utisvaedi',
  },
  {
    path: 'attachments.otherFiles.file',
    prefix: 'onnur_gogn',
  },
]

export type ApplicationAttachments = {
  [key: string]: string
}

export type File = {
  key: string
  name: string
}

export interface CriminalRecord {
  contentBase64: string
}

export interface DebtLessCertificateResult {
  debtLess: boolean
  certificate?: {
    type: string
    document: string
  }
}
