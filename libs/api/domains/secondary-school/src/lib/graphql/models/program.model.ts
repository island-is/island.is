import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolProgram')
export class SecondarySchoolProgram {
  @Field(() => String)
  id!: string

  @Field(() => String)
  nameIs!: string

  @Field(() => String)
  nameEn!: string

  @Field(() => Date)
  registrationEndDate!: Date

  @Field(() => Boolean)
  isSpecialNeedsProgram!: boolean

  @Field(() => String, { nullable: true })
  programApplicationMessageIs?: string

  @Field(() => String, { nullable: true })
  programApplicationMessageEn?: string
}
