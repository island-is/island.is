import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralEducationLevel')
export class EducationLevel {
  @Field()
  code!: string

  @Field()
  description!: string
}
