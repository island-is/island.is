import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PartTimeJobValidationResult')
export class PartTimeJobValidationResult {
  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  message?: string | null

  @Field(() => [String], { nullable: true })
  invalidValidationIds?: string[] | null
}
