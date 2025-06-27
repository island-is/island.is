import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralEducationalInstitution')
export class EducationalInstitution {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string
}
