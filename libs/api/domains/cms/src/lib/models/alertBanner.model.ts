import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import { IAlertBanner } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class AlertBanner {
  @Field(() => ID)
  id!: string

  @Field()
  showAlertBanner!: boolean

  @Field()
  bannerVariant!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  linkTitle?: string

  @Field(() => ReferenceLink, { nullable: true })
  link?: ReferenceLink | null

  @Field()
  isDismissable!: boolean

  @Field(() => Int)
  dismissedForDays!: number
}

export const mapAlertBanner = ({ fields, sys }: IAlertBanner): AlertBanner => ({
  id: sys.id,
  showAlertBanner: fields.showAlertBanner ?? false,
  bannerVariant: fields.bannerVariant ?? 'default',
  title: fields.title ?? '',
  description: fields.description ?? '',
  linkTitle: fields.linkTitle ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
  isDismissable: fields.isDismissable ?? true,
  dismissedForDays: fields.dismissedForDays ?? 7,
})
