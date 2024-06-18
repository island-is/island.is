import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicense } from './GenericLicense.dto'
import { GenericLicenseFetch } from './GenericLicenseFetch.dto'
import { Payload } from './Payload.dto'
import { CreateBarcodeResult } from './CreateBarcodeResult.dto'

@ObjectType()
export class GenericUserLicense {
  @Field({
    description: 'National ID of license owner',
  })
  nationalId!: string

  @Field({
    defaultValue: false,
    nullable: true,
    description: 'Is license owner child of user',
  })
  isOwnerChildOfUser?: boolean

  @Field(() => GenericLicense, { description: 'License info' })
  license!: GenericLicense

  @Field(() => GenericLicenseFetch, {
    deprecationReason: 'Unnecessary',
    nullable: true,
    description: 'Info about license fetch',
  })
  fetch?: GenericLicenseFetch

  @Field(() => Payload, {
    nullable: true,
    description: 'Potential payload of license, both parsed and raw',
  })
  payload?: Payload

  @Field(() => CreateBarcodeResult, {
    nullable: true,
  })
  barcode?: CreateBarcodeResult
}
