import { Field, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'
import { Union } from './union.model'
import { EducationalInstitution } from './educationalInstitution.model'
import { EducationLevel } from './educationLevel.model'
import { GenericKeyValueNumberObject } from './genericKeyValueNumberObject.model'
import { GenericKeyValueStringObject } from './genericKeyValueStringObject.model'

@ObjectType('SocialInsuranceGeneral')
export class General {
  @Field(() => [Union], { nullable: true })
  unions?: Array<Union>

  @Field(() => [Country], { nullable: true })
  countries?: Array<Country>

  @Field(() => [GenericKeyValueStringObject], { nullable: true })
  languages?: Array<GenericKeyValueStringObject>

  @Field(() => [EducationalInstitution], { nullable: true })
  educationalInstitutions?: Array<EducationalInstitution>

  @Field(() => [EducationLevel], { nullable: true })
  educationLevels?: Array<EducationLevel>

  @Field(() => [String], { nullable: true })
  currencies?: Array<string>

  @Field(() => [GenericKeyValueNumberObject], { nullable: true })
  maritalStatuses?: Array<GenericKeyValueNumberObject>

  @Field(() => [GenericKeyValueNumberObject], { nullable: true })
  housingTypes?: Array<GenericKeyValueNumberObject>

  @Field(() => [GenericKeyValueStringObject], { nullable: true })
  employmentStatuses?: Array<GenericKeyValueStringObject>

  @Field(() => [GenericKeyValueStringObject], { nullable: true })
  professions?: Array<GenericKeyValueStringObject>

  @Field(() => [GenericKeyValueStringObject], { nullable: true })
  professionActivities?: Array<GenericKeyValueStringObject>
}
