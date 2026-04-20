import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolLevel')
export class SecondarySchoolLevel {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  shortDescription?: string | null
}
