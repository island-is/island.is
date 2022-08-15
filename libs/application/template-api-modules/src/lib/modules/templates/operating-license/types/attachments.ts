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
]

export type ApplicationAttachments = {
  [key: string]: string
}

export type File = {
  key: string
  name: string
}

export type AttachmentData = {
    name: string,
    content: string
}
