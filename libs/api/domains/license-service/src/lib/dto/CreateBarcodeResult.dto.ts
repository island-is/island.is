import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('CreateBarcodeResult')
export class CreateBarcodeResult {
  @Field({
    description: 'Barcode token',
  })
  token!: string

  @Field(() => Date, {
    description: 'Barcode expiration date',
  })
  exp!: Date
}
