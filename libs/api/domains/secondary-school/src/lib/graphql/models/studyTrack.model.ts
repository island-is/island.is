import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolStudyTrack')
export class SecondarySchoolStudyTrack {
  @Field(() => String, { nullable: true })
  isced?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
