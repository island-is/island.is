import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralEducationalInstitution')
export class EducationalInstitution {
  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string
}
