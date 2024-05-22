import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderLawyersData')
export class Data {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  practice?: string
}

@ObjectType('LawAndOrderLawyers')
export class Lawyers {
  @Field(() => [Data], { nullable: true })
  items?: Array<Data>
}
