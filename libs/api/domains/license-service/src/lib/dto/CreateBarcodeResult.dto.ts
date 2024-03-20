import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicense } from './GenericLicense.dto'
import { GenericLicenseFetch } from './GenericLicenseFetch.dto'
import { Payload } from './Payload.dto'

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
