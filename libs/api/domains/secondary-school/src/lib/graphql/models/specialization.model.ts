import { Field, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolTag } from './tag.model'

@ObjectType('SecondarySchoolSpecialization')
export class SecondarySchoolSpecialization {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => [SecondarySchoolTag], { nullable: true })
  tags?: SecondarySchoolTag[] | null
}
