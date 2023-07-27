import { PdfTypes } from '@island.is/application/types'
import { KeyMapping } from './types'

export const PdfConstants = {
  BOLD_FONT: 'Helvetica-Bold',
  NORMAL_FONT: 'Helvetica',
  HEADER_FONT_SIZE: 26,
  SMALL_FONT_SIZE: 8,
  VALUE_FONT_SIZE: 12,
  SUB_HEADER_FONT_SIZE: 14,
  NO_LINE_GAP: 0,
  SMALL_LINE_GAP: 4,
  NORMAL_LINE_GAP: 8,
  LARGE_LINE_GAP: 24,
  HORIZONTAL_MARGIN: 48,
  VERTICAL_MARGIN: 48,
  IMAGE_WIDTH: 126,
  IMAGE_HEIGHT: 40,
  PAGE_SIZE: 'A4',
}

export const BucketTypePrefix: KeyMapping<PdfTypes, string> = {
  ChildrenResidenceChange: 'children-residence-change',
  ChildrenResidenceChangeV2: 'children-residence-change',
}

export const DokobitFileName: KeyMapping<PdfTypes, string> = {
  ChildrenResidenceChange: 'Logheimilisbreyting-barns.pdf',
  ChildrenResidenceChangeV2: 'Logheimilisbreyting-barns.pdf',
}

export const DokobitErrorCodes = {
  UserCancelled: 7023,
  TimeOut: 99999,
  SessionExpired: 6005,
  NoMobileSignature: 6001,
}
