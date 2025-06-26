import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralEducationalInstitutions')
export class EducationalInstitutions {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string
}
