import { AttachmentPath } from './types/attachments'

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

export const BANNED_BANKRUPTCY_STATUSES = ['3', '0']
