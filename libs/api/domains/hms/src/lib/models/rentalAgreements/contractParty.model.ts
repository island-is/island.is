import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model'
import { PartyType } from './rentalAgreement.model'

@ObjectType('HmsContractParty')
export class ContractParty {
  @Field(() => ID)
  id!: number

  @Field(() => PartyType)
  type!: PartyType

  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => Address, { nullable: true })
  address?: Address

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string
}
