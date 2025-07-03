import { Field, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'
import { Union } from './union.model'
import { EducationalInstitution } from './educationalInstitution.model'

@ObjectType('SocialInsuranceGeneral')
export class General {
  @Field(() => [Union], { nullable: true })
  unions?: Array<Union>

  @Field(() => [Country], { nullable: true })
  countries?: Array<Country>

  @Field(() => [EducationalInstitution], { nullable: true })
  educationalInstitutions?: Array<EducationalInstitution>
}
