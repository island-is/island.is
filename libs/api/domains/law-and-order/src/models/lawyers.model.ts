import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderLawyersData')
export class Data {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  practice?: string
}

@ObjectType('LawAndOrderLawyers')
export class Lawyers {
  @Field(() => [Data], { nullable: true })
  items?: Array<Data>
}
