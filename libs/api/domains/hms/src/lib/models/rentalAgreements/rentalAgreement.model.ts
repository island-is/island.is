import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ContractParty } from './contractParty.model'
import { ContractProperty } from './contractProperty.model'

export enum AgreementStatusType {
  VALID = 'valid',
  INVALID = 'invalid',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TERMINATED = 'terminated',
  CANCELLATION_REQUESTED = 'cancellationRequested',
  PENDING_CANCELLATION = 'pendingCancellation',
  PENDING_TERMINATION = 'pendingTermination',
  UNKNOWN = 'unknown',
}

registerEnumType(AgreementStatusType, {
  name: 'HmsRentalAgreementStatusType',
})

export enum PartyType {
  OWNER = 'owner',
  TENANT = 'tenant',
  AGENCY = 'agency',
  AGENT_FOR_OWNER = 'agentForOwner',
  AGENT_FOR_TENANT = 'agentForTenant',
  OWNER_TAKEOVER = 'ownerTakeover',
  UNKNOWN = 'unknown',
}

registerEnumType(PartyType, {
  name: 'HmsRentalAgreementPartyType',
})

export enum TemporalType {
  TEMPORARY = 'temporary',
  INDEFINITE = 'indefinite',
  UNKNOWN = 'unknown',
}

registerEnumType(TemporalType, {
  name: 'HmsRentalAgreementTemporalType',
})

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
  signatureDate?: string

  @Field({ nullable: true, description: 'ISO8601' })
  receivedDate?: string

  @Field(() => [ContractParty], { nullable: true })
  landlords?: ContractParty[]

  @Field(() => [ContractParty], { nullable: true })
  tenants?: ContractParty[]

  @Field(() => ContractProperty, { nullable: true })
  contractProperty?: ContractProperty
}
