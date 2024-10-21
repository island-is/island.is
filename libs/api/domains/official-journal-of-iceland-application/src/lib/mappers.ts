import {
  AddApplicationAttachmentTypeEnum,
  GetApplicationAttachmentsTypeEnum,
  GetPresignedUrlTypeEnum,
} from '@island.is/clients/official-journal-of-iceland/application'

export const mapAttachmentType = (
  val: any,
): AddApplicationAttachmentTypeEnum => {
  switch (val) {
    case AddApplicationAttachmentTypeEnum.Frumrit:
    case GetPresignedUrlTypeEnum.Frumrit:
      return AddApplicationAttachmentTypeEnum.Frumrit
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
