import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BillReceiptModel {
  @Field(() => [BillReceiptItem])
  documentsList!: BillReceiptItem[]
}

@ObjectType()
export class BillReceiptItem {
  @Field()
  id!: string

  @Field()
  date!: string

  @Field()
  type!: string

  @Field(() => String, { nullable: true })
  note?: string | null

  @Field()
  sender!: string

  @Field()
  dateOpen!: string

  @Field()
  amount!: number
}
