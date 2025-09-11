import {
  AddApplicationAttachmentTypeEnum,
  GetApplicationAttachmentsTypeEnum,
  GetPresignedUrlTypeEnum,
  TemplateType as TemplateTypeDto,
} from '@island.is/clients/official-journal-of-iceland/application'
import { TemplateType } from '../models/applicationAdvertTemplate.response'

export const mapTemplateTypeLiteralToEnum = (
  typeLiteral: TemplateTypeDto,
): TemplateType => {
  switch (typeLiteral) {
    case 'auglysing':
      return TemplateType.AUGLYSING
    case 'gjaldskra':
      return TemplateType.GJALDSKRA
    case 'reglugerd':
      return TemplateType.REGLUGERD
    default:
      return TemplateType.UNKNOWN
  }
}

export const mapTemplateTypeEnumToLiteral = (
  typeEnum: TemplateType,
): TemplateTypeDto | undefined => {
  switch (typeEnum) {
    case TemplateType.AUGLYSING:
      return 'auglysing'
    case TemplateType.GJALDSKRA:
      return 'gjaldskra'
    case TemplateType.REGLUGERD:
      return 'reglugerd'
    default:
      return
  }
}

export const mapAttachmentType = (
  val: any,
): AddApplicationAttachmentTypeEnum => {
  switch (val) {
    case AddApplicationAttachmentTypeEnum.Frumrit:
    case GetPresignedUrlTypeEnum.Frumrit:
      return AddApplicationAttachmentTypeEnum.Frumrit
    case AddApplicationAttachmentTypeEnum.Fylgigogn:
    case GetPresignedUrlTypeEnum.Fylgigogn:
      return AddApplicationAttachmentTypeEnum.Fylgigogn
    case AddApplicationAttachmentTypeEnum.Fylgiskjol:
    case GetPresignedUrlTypeEnum.Fylgiskjol:
      return AddApplicationAttachmentTypeEnum.Fylgiskjol
    default:
      return AddApplicationAttachmentTypeEnum.Fylgiskjol
  }
}

export const mapPresignedUrlType = (val: any): GetPresignedUrlTypeEnum => {
  switch (val) {
    case GetPresignedUrlTypeEnum.Frumrit:
      return GetPresignedUrlTypeEnum.Frumrit
    case GetPresignedUrlTypeEnum.Fylgiskjol:
      return GetPresignedUrlTypeEnum.Fylgiskjol
    case GetPresignedUrlTypeEnum.Assets:
      return GetPresignedUrlTypeEnum.Assets
    default:
      return GetPresignedUrlTypeEnum.Fylgiskjol
  }
}

export const mapGetAttachmentType = (
  val: any,
): GetApplicationAttachmentsTypeEnum => {
  switch (val) {
    case GetApplicationAttachmentsTypeEnum.Frumrit:
      return GetApplicationAttachmentsTypeEnum.Frumrit
    case GetApplicationAttachmentsTypeEnum.Fylgiskjol:
      return GetApplicationAttachmentsTypeEnum.Fylgiskjol
    case GetApplicationAttachmentsTypeEnum.Fylgigogn:
      return GetApplicationAttachmentsTypeEnum.Fylgigogn
    default:
      return GetApplicationAttachmentsTypeEnum.Fylgiskjol
  }
}

type EnumType = { [s: string | number]: string }

export const safeEnumMapper = <T extends EnumType>(
  val: unknown,
  enumType: T,
): T[keyof T] | null => {
  const found = Object.values(enumType).find((enumVal) => enumVal === val)

  return found ? (found as T[keyof T]) : null
}
