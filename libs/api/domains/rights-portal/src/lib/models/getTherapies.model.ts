import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
class State {
  @Field(() => String)
  display!: string

  @Field(() => String)
  code!: string
}

@ObjectType()
class Sessions {
  @Field(() => Number)
  available!: number

  @Field(() => Number)
  used!: number
}

@ObjectType()
class Periods {
  @Field(() => Date)
  from!: Date

  @Field(() => Sessions)
  sessions!: Sessions

  @Field(() => Date)
  to!: Date
}

@ObjectType()
export class Therapies {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field({ nullable: true })
  postStation?: string

  @Field(() => [Periods], { nullable: true })
  periods?: Periods[]

  @Field(() => State, { nullable: true })
  state?: State
}
