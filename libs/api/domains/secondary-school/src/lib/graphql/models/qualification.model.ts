import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolLevel } from './level.model'

@ObjectType('SecondarySchoolQualification')
export class SecondarySchoolQualification {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Int, { nullable: true })
  uniqueIdentifier?: number

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => SecondarySchoolLevel, { nullable: true })
  level?: SecondarySchoolLevel
}
