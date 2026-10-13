import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
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

export enum RentalAgreementSortOrder {
  NEW_OLD = 'newOld',
  OLD_NEW = 'oldNew',
  AMOUNT_HIGH_LOW = 'amountHighLow',
  AMOUNT_LOW_HIGH = 'amountLowHigh',
  STATUS_ACTIVE_FIRST = 'statusActiveFirst',
  STATUS_ACTIVE_LAST = 'statusActiveLast',
}

registerEnumType(RentalAgreementSortOrder, {
  name: 'HmsRentalAgreementSortOrder',
})

@ObjectType('HmsRentalAgreement')
export class RentalAgreement {
  @Field(() => ID)
  id!: number

  @Field(() => AgreementStatusType)
  status!: AgreementStatusType

  @Field(() => TemporalType, { nullable: true })
  contractType?: TemporalType

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  signatureDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  receivedDate?: Date

  @Field(() => [ContractParty], { nullable: true })
  landlords?: ContractParty[]

  @Field(() => [ContractParty], { nullable: true })
  tenants?: ContractParty[]

  @Field(() => ContractProperty, { nullable: true })
  contractProperty?: ContractProperty

  @Field(() => GraphQLISODateTime, { nullable: true })
  terminationDate?: Date

  @Field({ nullable: true })
  latestDocumentDownloadUrl?: string

  @Field({ nullable: true })
  canTerminate?: boolean
}
