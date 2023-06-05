import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Address } from './nationalRegistryAddress.model'
import { Birthplace } from './nationalRegistryBirthplace.model'
import { Residence } from './nationalRegistryResidence.model'
import { Spouse } from './nationalRegistrySpouse.model'
import { Citizenship } from './nationalRegistryCitizenship.model'
import { Name } from './nationalRegistryName.model'
import { Religion } from './nationalRegistryReligion.model'
import { Custodian } from './nationalRegistryCustodian.model'
import { DomicilePopulace } from './nationalRegistryDomicilePopulace.model'

@ObjectType('NationalRegistryV3Person')
export class Person {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => Name, { nullable: true })
  name?: Name | null

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => Boolean, { nullable: true })
  banMarking?: boolean | null

  @Field(() => String)
  familyRegistrationCode?: string | null

  @Field(() => Address, { nullable: true })
  address?: Address | null

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => String, { nullable: true })
  fate?: string | null

  @Field(() => [Person], { nullable: true })
  parents?: Person[]

  @Field(() => [Custodian], { nullable: true })
  custodians?: Custodian[]

  @Field(() => [Person], { nullable: true })
  children?: Person[]

  @Field(() => Person, { nullable: true })
  otherParent?: Person | null

  @Field(() => DomicilePopulace, { nullable: true })
  legalDomicilePopulace?: DomicilePopulace

  @Field(() => [Residence], { nullable: true })
  residenceHistory?: Residence[]

  @Field(() => Spouse, { nullable: true })
  spouse?: Spouse | null

  @Field(() => Birthplace, { nullable: true })
  birthplace?: Birthplace | null

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship | null

  @Field(() => Religion, { nullable: true })
  religion?: Religion | null
}
