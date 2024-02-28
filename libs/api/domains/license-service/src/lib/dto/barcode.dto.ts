import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Barcode')
export class Barcode {
  @Field(() => String)
  token!: string
}
