import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IntellectualPropertyTrademarkPriority {
  @Field({ nullable: true })
  date?: string | null

  @Field({ nullable: true })
  categories?: string | null

  @Field({ nullable: true })
  country?: string | null

  @Field({ nullable: true })
  number?: string | null

  @Field({ nullable: true })
  comment?: string | null
}

@ObjectType()
export class IntellectualPropertyTrademarkAgent {
  @Field({ nullable: true })
  name?: string | null

  @Field({ nullable: true })
  address?: string | null

  @Field({ nullable: true })
  county?: string | null

  @Field({ nullable: true })
  postalCode?: string | null

  @Field({ nullable: true })
  nationalId?: string | null
}

@ObjectType()
export class IntellectualPropertyTrademarkDiaryEntry {
  @Field({ nullable: true })
  type?: string | null

  @Field({ nullable: true })
  text?: string | null

  @Field({ nullable: true })
  date?: Date | null

  @Field({ nullable: true })
  author?: string | null
}

@ObjectType()
export class IntellectualPropertyTrademarkModelMedia {
  @Field({ nullable: true })
  mediaPath?: string | null

  @Field({ nullable: true })
  mediaType?: string | null
}

@ObjectType()
export class IntellectualPropertyTrademarkCategory {
  @Field({ nullable: true })
  categoryNumber?: string | null

  @Field({ nullable: true })
  categoryDescription?: string | null
}

@ObjectType()
export class IntellectualPropertyTrademarkModelOwner {
  @Field({ nullable: true })
  ssn?: string | null

  @Field({ nullable: true })
  name?: string | null

  @Field({ nullable: true })
  address?: string | null

  @Field({ nullable: true })
  postalCode?: string | null

  @Field({ nullable: true })
  county?: string | null

  @Field({ nullable: true })
  country?: string | null

  @Field(() => Boolean, { nullable: true })
  isForeign?: boolean
}

@ObjectType()
export class IntellectualPropertyAllTrademarks {
  @Field({ nullable: true })
  text?: string | null

  @Field({ nullable: true })
  type?: string | null

  @Field({ nullable: true })
  applicationNumber?: string | null

  @Field({ nullable: true })
  registrationNumber?: string | null

  @Field({ nullable: true })
  status?: string | null

  @Field({ nullable: true })
  statusEN?: string | null

  @Field(() => [IntellectualPropertyTrademarkModelOwner], { nullable: true })
  markOwners?: Array<IntellectualPropertyTrademarkModelOwner> | null

  @Field(() => [IntellectualPropertyTrademarkCategory], { nullable: true })
  markCategories?: Array<IntellectualPropertyTrademarkCategory> | null

  @Field(() => [IntellectualPropertyTrademarkDiaryEntry], { nullable: true })
  markDiary?: Array<IntellectualPropertyTrademarkDiaryEntry> | null

  @Field(() => IntellectualPropertyTrademarkAgent, { nullable: true })
  markAgent?: IntellectualPropertyTrademarkAgent | null

  @Field({ nullable: true })
  imagePath?: string | null

  @Field({ nullable: true })
  originalImagePath?: string | null

  @Field({ nullable: true })
  applicationDate?: string | null

  @Field({ nullable: true })
  dateExpires?: string | null

  @Field({ nullable: true })
  dateRegistration?: string | null

  @Field({ nullable: true })
  dateInternationalRegistration?: string | null

  @Field({ nullable: true })
  mpNumber?: string | null

  @Field({ nullable: true })
  vmId?: string | null

  @Field({ nullable: true })
  dateModified?: string | null

  @Field({ nullable: true })
  dateAfterNomination?: string | null

  @Field({ nullable: true })
  isMemberMark?: string | null

  @Field({ nullable: true })
  isColorMark?: boolean

  @Field({ nullable: true })
  registeredForMarketReasons?: boolean

  @Field({ nullable: true })
  useLimitedTo?: string | null

  @Field({ nullable: true })
  dateUnRegistered?: string | null

  @Field({ nullable: true })
  datePublished?: string | null

  @Field({ nullable: true })
  dateRenewed?: string | null

  @Field({ nullable: true })
  imageCategories?: string | null

  @Field(() => [IntellectualPropertyTrademarkPriority], { nullable: true })
  priority?: Array<IntellectualPropertyTrademarkPriority> | null

  @Field({ nullable: true })
  is3DMark?: boolean | null

  @Field({ nullable: true })
  deleted?: boolean | null

  @Field({ nullable: true })
  description?: string | null

  @Field(() => IntellectualPropertyTrademarkModelMedia, { nullable: true })
  media?: IntellectualPropertyTrademarkModelMedia | null

  @Field({ nullable: true })
  certificationMark?: boolean | null

  @Field({ nullable: true })
  canRenew?: boolean | null

  @Field({ nullable: true })
  canRenewWithResumption?: boolean | null
}
