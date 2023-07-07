import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyTrademarkCollectionEntry')
export class TrademarkCollectionEntry {
  @Field(() => String, { nullable: true })
  text?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => Date, { nullable: true })
  applicationDate?: Date | null

  @Field(() => String, { nullable: true })
  vmId?: string | null
}
