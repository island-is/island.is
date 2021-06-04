import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Provider {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  organisationId?: string

  @Field(() => String, { nullable: true })
  endpoint?: string

  @Field(() => String, { nullable: true })
  endpointType?: string

  @Field(() => String, { nullable: true })
  apiScope?: string

  @Field(() => Boolean, { nullable: true })
  xroad?: boolean

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date
}
