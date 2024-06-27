import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('LicenseServiceV2CreateBarcodeResult')
export class CreateBarcodeResult {
  @Field({
    description: 'Barcode token',
  })
  token!: string

  @Field(() => Int, {
    description: 'Barcode expire time in seconds',
  })
  expiresIn!: number
}
