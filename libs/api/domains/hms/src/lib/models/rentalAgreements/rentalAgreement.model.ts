import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ContractParty } from './contractParty.model'
import { ContractProperty } from './contractProperty.model'
import { AgreementStatusType, TemporalType } from '../../enums'
import { ContractDocument } from './contractDocument.model'

@ObjectType('HmsRentalAgreement')
export class RentalAgreement {
  @Field(() => ID)
  id!: number

  @Field(() => AgreementStatusType)
  status!: AgreementStatusType

  @Field(() => TemporalType, { nullable: true })
  contractType?: TemporalType

  @Field({ nullable: true, description: 'ISO8601' })
  dateFrom?: string

  @Field({ nullable: true, description: 'ISO8601' })
  dateTo?: string

  @Field({ nullable: true, description: 'ISO8601' })
  terminationDate?: string

  @Field(() => [ContractParty], { nullable: true })
  landlords?: ContractParty[]

  @Field(() => [ContractParty], { nullable: true })
  tenants?: ContractParty[]

  @Field(() => ContractProperty, { nullable: true })
  property?: ContractProperty

  @Field(() => [ContractDocument], { nullable: true })
  documents?: ContractDocument[]
}
