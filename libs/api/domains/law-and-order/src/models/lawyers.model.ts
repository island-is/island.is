import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderLawyersData')
export class Data {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType('LawAndOrderLawyers')
export class Lawyers {
  @Field(() => [Data], { nullable: true })
  items?: Array<Data>
}
