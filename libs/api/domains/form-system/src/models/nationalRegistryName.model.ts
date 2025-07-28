import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FormSystemNameByNationalId {
  @Field(() => String, { nullable: true })
  eiginNafn?: string | null

  @Field(() => String, { nullable: true })
  milliNafn?: string | null

  @Field(() => String, { nullable: true })
  kenniNafn?: string | null

  @Field(() => String, { nullable: true })
  fulltNafn?: string | null

  @Field(() => String, { nullable: true })
  nafnStadfest?: string | null

  @Field(() => String, { nullable: true })
  birtNafn?: string | null
}
