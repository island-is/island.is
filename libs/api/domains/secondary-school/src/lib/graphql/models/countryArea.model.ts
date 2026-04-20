import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolCountryArea')
export class SecondarySchoolCountryArea {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null
}
