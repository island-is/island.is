import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { GetBloodDonationRestrictionsInput } from '../dto/getBloodDonationRestrictions.input'
import { IBloodDonationRestriction } from '../generated/contentfulTypes'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

@ObjectType()
export class BloodDonationRestrictionListItem {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Boolean)
  hasCardText!: boolean

  @CacheField(() => [SliceUnion])
  cardText!: Array<typeof SliceUnion>

  @Field(() => String)
  description!: string

  @Field(() => Boolean)
  hasDetailedText!: boolean
}

@ObjectType()
export class BloodDonationRestrictionList {
  @Field(() => Int)
  total!: number

  @CacheField(() => [BloodDonationRestrictionListItem])
  items!: BloodDonationRestrictionListItem[]

  @CacheField(() => GetBloodDonationRestrictionsInput)
  input!: GetBloodDonationRestrictionsInput
}

export const mapBloodDonationRestrictionListItem = ({
  sys,
  fields,
}: IBloodDonationRestriction): BloodDonationRestrictionListItem => {
  return {
    id: sys.id,
    title: fields.title ?? '',
    hasCardText: fields.cardText
      ? documentToPlainTextString(fields.cardText).trim().length > 0
      : false,
    cardText: fields.cardText
      ? mapDocument(fields.cardText, sys.id + ':cardText')
      : [],
    description: fields.description ?? '',
    hasDetailedText: fields.detailedText
      ? documentToPlainTextString(fields.detailedText).trim().length > 0
      : false,
  }
}

@ObjectType()
export class BloodDonationRestrictionDetails {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => Boolean)
  hasCardText!: boolean

  @CacheField(() => [SliceUnion])
  cardText!: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  detailedText!: Array<typeof SliceUnion>

  @Field(() => Boolean)
  hasDetailedText!: boolean
}

export const mapBloodDonationRestrictionDetails = ({
  sys,
  fields,
}: IBloodDonationRestriction): BloodDonationRestrictionDetails => {
  return {
    id: sys.id,
    title: fields.title ?? '',
    hasCardText: fields.cardText
      ? documentToPlainTextString(fields.cardText).trim().length > 0
      : false,
    cardText: fields.cardText
      ? mapDocument(fields.cardText, sys.id + ':cardText')
      : [],
    description: fields.description ?? '',
    hasDetailedText: fields.detailedText
      ? documentToPlainTextString(fields.detailedText).trim().length > 0
      : false,
    detailedText: fields.detailedText
      ? mapDocument(fields.detailedText, sys.id + ':detailedText')
      : [],
  }
}
