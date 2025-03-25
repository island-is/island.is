import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GetBloodDonationRestrictionsInput } from '../dto/getBloodDonationRestrictions.input'
import { IBloodDonationRestriction } from '../generated/contentfulTypes'
import { SliceUnion, mapDocument } from '../unions/slice.union'

@ObjectType()
export class BloodDonationRestrictionListItem {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @CacheField(() => [SliceUnion])
  cardText!: Array<typeof SliceUnion>

  @Field(() => String)
  description!: string
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
    cardText: fields.cardText
      ? mapDocument(fields.cardText, sys.id + ':cardText')
      : [],
    description: fields.description ?? '',
  }
}
