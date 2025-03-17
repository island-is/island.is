import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CaseRepresentative {
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String)
  readonly name!: string

  @Field(() => String)
  readonly title!: string
}
