import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LicenseServiceV2GenericPkPassQrCode')
export class GenericPkPassQrCode {
  @Field()
  pkpassQRCode!: string
}
