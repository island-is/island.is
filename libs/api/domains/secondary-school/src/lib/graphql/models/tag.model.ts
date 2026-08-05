import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolTag')
export class SecondarySchoolTag {
  @Field(() => String, { nullable: true })
  value?: string | null
}
