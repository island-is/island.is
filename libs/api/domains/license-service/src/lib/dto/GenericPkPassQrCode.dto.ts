import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericPkPassQrCode {
  @Field()
  pkpassQRCode!: string
}
