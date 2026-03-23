import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ValidationUnemploymentApplication')
export class ValidationUnemploymentApplication {
  @Field(() => Boolean, { nullable: true })
  isValid?: boolean

  @Field(() => String, { nullable: true })
  userMessageIS?: string | null

  @Field(() => String, { nullable: true })
  userMessageEN?: string | null
}
