import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('CreateBarcodeResult')
export class CreateBarcodeResult {
  @Field({
    description: 'Barcode token',
  })
  token!: string

  @Field(() => Number, {
    description: 'Barcode expire time in seconds',
  })
  expiresIn!: number
}
