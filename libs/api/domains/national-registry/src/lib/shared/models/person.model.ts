import { Field, ObjectType } from '@nestjs/graphql'
import { Gender, MaritalStatus } from '../types'
import { Birthplace } from './birthplace.model'
import { Citizenship } from './citizenship.model'
import { Spouse } from './spouse.model'
import { Housing } from './housing.model'
import { Custodian } from '../../shared/models/custodian.model'
import { PersonBase } from './personBase.model'
import { Name } from './name.model'
import { BanMarking } from './banMarking.model'
import { Address } from './address.model'

@ObjectType('NationalRegistryPerson')
export class Person extends PersonBase {
  @Field(() => Name, { nullable: true })
  name?: Name | null

  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => String, { nullable: true })
  religion?: string | null

  @Field(() => [Custodian], { nullable: true })
  custodians?: Array<Custodian> | null

  @Field(() => [PersonBase], { nullable: true })
  birthParents?: Array<PersonBase> | null

  @Field(() => [Person], { nullable: true })
  childCustody?: Array<Person> | null

  @Field(() => Birthplace, { nullable: true })
  birthplace?: Birthplace | null

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship | null

  @Field(() => Housing, { nullable: true })
  housing?: Housing | null

  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus | null

  @Field(() => Spouse, { nullable: true })
  spouse?: Spouse | null

  @Field(() => String, {
    nullable: true,
    description: 'Unique string. Can be used for URL`s.',
  })
  baseId?: string | null

  //DEPRECATED USER PROPERTIES

  @Field(() => String, {
    nullable: true,
    deprecationReason:
      'Moving to the housing object property as a couple of object properties',
  })
  legalResidence?: string | null

  @Field(() => BanMarking, {
    nullable: true,
    deprecationReason: 'Renaming to expectionFromDirectMarketing',
  })
  banMarking?: BanMarking | null

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Moving to name object property',
  })
  firstName?: string | null

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Moving to name object property',
  })
  lastName?: string | null

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Moving to name object property',
  })
  middleName?: string | null

  @Field(() => String, {
    nullable: true,
    deprecationReason:
      'Moving to the Birthplace object property containing more information',
  })
  birthPlace?: string | null

  @Field(() => String, {
    nullable: true,
    deprecationReason:
      'Moving to housing -> domicileId since the familyNr naming is outdated',
  })
  familyNr?: string | null

  @Field(() => Number, {
    nullable: true,
    deprecationReason:
      'Up for removal. Easily calculated with the nationalId property',
  })
  age?: number | null

  @Field(() => Date, {
    nullable: true,
    deprecationReason:
      'Up for removal. Easily calculated with the nationalId property',
  })
  birthday?: Date | null

  @Field(() => Address, {
    nullable: true,
    deprecationReason: 'Moving into the Housing object property',
  })
  address?: Address | null
}
