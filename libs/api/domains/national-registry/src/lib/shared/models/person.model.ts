import { Field, ObjectType } from '@nestjs/graphql'
import { Gender } from '../types'
import { Birthplace } from './birthplace.model'
import { ChildCustody } from './childCustody.model'
import { Citizenship } from './citizenship.model'
import { Spouse } from './spouse.model'
import { Housing } from './housing.model'
import { Custodian } from '../../shared/models/custodian.model'
import { PersonBase } from './personBase.model'

@ObjectType('NationalRegistryPerson')
export class Person extends PersonBase {
  @Field(() => String, { nullable: true })
  firstName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => String, { nullable: true })
  legalResidence?: string | null

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => String, { nullable: true })
  religion?: string | null

  @Field(() => [Custodian], { nullable: true })
  custodians?: Array<Custodian> | null

  @Field(() => [PersonBase], { nullable: true })
  birthParents?: Array<PersonBase> | null

  @Field(() => [ChildCustody], { nullable: true })
  childCustody?: Array<ChildCustody> | null

  @Field(() => Birthplace, { nullable: true })
  birthplace?: Birthplace | null

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship | null

  @Field(() => Housing, { nullable: true })
  housing?: Housing | null

  @Field(() => Spouse, { nullable: true })
  spouse?: Spouse | null
}
