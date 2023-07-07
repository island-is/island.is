import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum TrademarkSubType {
  TRADEMARK = 'TRADEMARK',
  CERTIFICATION_MARK = 'CERTIFICATION_MARK',
  COLLECTIVE_MARK = 'COLLECTIVE_MARK',
}

registerEnumType(TrademarkSubType, { name: 'TrademarkSubType' })

@ObjectType('IntellectualPropertyTrademarkAgent')
export class Agent {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  county?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  ssn?: string | null
}
@ObjectType('IntellectualPropertyTrademarkMedia')
export class Media {
  @Field(() => String, { nullable: true })
  mediaPath?: string | null

  @Field(() => String, { nullable: true })
  mediaType?: string | null
}

@ObjectType('IntellectualPropertyTrademarkCategory')
export class Category {
  @Field(() => String, { nullable: true })
  categoryNumber?: string | null

  @Field(() => String, { nullable: true })
  categoryDescription?: string | null
}

@ObjectType('IntellectualPropertyTrademarkOwner')
export class Owner {
  @Field(() => String, { nullable: true })
  ssn?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  county?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field({ nullable: true })
  isForeign?: boolean
}
@ObjectType('IntellectualPropertyTrademark')
export class Trademark {
  @Field(() => String, { nullable: true })
  text?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => TrademarkSubType, { nullable: true })
  subType?: TrademarkSubType

  @Field(() => String, { nullable: true })
  applicationNumber?: string | null

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  statusEN?: string | null

  @Field(() => [Owner], { nullable: true })
  markOwners?: Array<Owner> | null

  @Field(() => [Category], { nullable: true })
  markCategories?: Array<Category> | null

  @Field(() => Agent, { nullable: true })
  markAgent?: Agent | null

  @Field(() => String, { nullable: true })
  imagePath?: string | null

  @Field(() => String, { nullable: true })
  originamlImagePath?: string | null

  @Field(() => String, { nullable: true })
  applicationDate?: string | null

  @Field(() => String, { nullable: true })
  dateExpires?: string | null

  @Field(() => String, { nullable: true })
  dateRegistration?: string | null

  @Field(() => String, { nullable: true })
  dateInternationalRegistration?: string | null

  @Field(() => String, { nullable: true })
  mpNumber?: string | null

  @Field(() => String, { nullable: true })
  vmId?: string | null

  @Field(() => String, { nullable: true })
  dateModified?: string | null

  @Field(() => String, { nullable: true })
  date?: string | null

  @Field(() => String, { nullable: true })
  dateSubsequentDesignation?: string | null

  @Field({ nullable: true })
  isColorMark?: boolean

  @Field({ nullable: true })
  acquiredDistinctiveness?: boolean

  @Field(() => String, { nullable: true })
  useLimitedTo?: string | null

  @Field(() => String, { nullable: true })
  dateUnRegistered?: string | null

  @Field(() => String, { nullable: true })
  datePublished?: string | null

  @Field(() => String, { nullable: true })
  maxValidObjectionDate?: string | null

  @Field(() => String, { nullable: true })
  dateRenewed?: string | null

  @Field(() => String, { nullable: true })
  imageCategories?: string | null

  @Field({ nullable: true })
  is3DMark?: boolean

  @Field({ nullable: true })
  deleted?: boolean

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Media, { nullable: true })
  media?: Media | null

  @Field({ nullable: true })
  canRenew?: boolean

  @Field({ nullable: true })
  canRenewWithResumption?: boolean
}
