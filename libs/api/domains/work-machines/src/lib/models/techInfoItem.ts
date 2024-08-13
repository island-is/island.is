import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class TechInfoItem {
  @Field(() => String, { nullable: true })
  variableName?: string | null

  @Field(() => String, { nullable: true })
  label?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Boolean, { nullable: true })
  required?: boolean | null

  @Field(() => String, { nullable: true })
  maxLength?: string | null

  @Field(() => [String], { nullable: true })
  values?: Array<string> | null
}
