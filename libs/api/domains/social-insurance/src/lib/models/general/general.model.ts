import { Field, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'
import { Union } from './union.model'
import { EducationalInstitution } from './educationalInstitution.model'
import { EducationLevel } from './educationLevel.model'
import { Language } from './language.model'
import { MaritalStatus } from './maritalStatus.model'
import { HousingType } from './housingType.model'
import { EmploymentStatus } from './employmentStatus.model'
import { Profession } from './profession.model'
import { ProfessionActivity } from './professionActivity.model'

@ObjectType('SocialInsuranceGeneral')
export class General {
  @Field(() => [Union], { nullable: true })
  unions?: Array<Union>

  @Field(() => [Country], { nullable: true })
  countries?: Array<Country>

  @Field(() => [Language], { nullable: true })
  languages?: Array<Language>

  @Field(() => [EducationalInstitution], { nullable: true })
  educationalInstitutions?: Array<EducationalInstitution>

  @Field(() => [EducationLevel], { nullable: true })
  educationLevels?: Array<EducationLevel>

  @Field(() => [String], { nullable: true })
  currencies?: Array<string>

  @Field(() => [MaritalStatus], { nullable: true })
  maritalStatuses?: Array<MaritalStatus>

  @Field(() => [HousingType], { nullable: true })
  housingTypes?: Array<HousingType>

  @Field(() => [EmploymentStatus], { nullable: true })
  employmentStatuses?: Array<EmploymentStatus>

  @Field(() => [Profession], { nullable: true })
  professions?: Array<Profession>

  @Field(() => [ProfessionActivity], { nullable: true })
  professionActivities?: Array<ProfessionActivity>
}
