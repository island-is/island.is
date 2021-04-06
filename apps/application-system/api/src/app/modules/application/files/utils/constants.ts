import { PdfTypes } from '@island.is/application/core'
import { KeyMapping } from './types'

export const PdfConstants = {
  BOLD_FONT: 'Helvetica-Bold',
  NORMAL_FONT: 'Helvetica',
  PERMANENT: 'permanent',
  TEMPORARY: 'temporary',
  HEADER_FONT_SIZE: 26,
  SUB_HEADER_FONT_SIZE: 14,
  VALUE_FONT_SIZE: 12,
  LARGE_LINE_GAP: 24,
  NORMAL_LINE_GAP: 8,
  NO_LINE_GAP: 0,
  HORIZONTAL_MARGIN: 48,
  VERTICAL_MARGIN: 48,
  IMAGE_WIDTH: 126,
  IMAGE_HEIGHT: 40,
  PAGE_SIZE: 'A4',
}

export const BucketTypePrefix: KeyMapping<PdfTypes, string> = {
  ChildrenResidenceChange: 'children-residence-change',
}

export const DokobitFileName: KeyMapping<PdfTypes, string> = {
  ChildrenResidenceChange: 'Lögheimilisbreyting-barns.pdf',
}

export const DokobitErrorCodes = {
  UserCancelled: 7023,
  TimeOut: 99999,
  SessionExpired: 6005,
  NoMobileSignature: 6001,
}
