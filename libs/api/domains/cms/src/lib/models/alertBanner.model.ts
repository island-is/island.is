import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

import { IAlertBanner } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'

@ObjectType()
export class AlertBanner {
  @Field(() => ID)
  id: string

  @Field()
  showAlertBanner: boolean

  @Field()
  bannerVariant: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Link, { nullable: true })
  link?: Link

  @Field()
  isDismissable: boolean

  @Field(() => Int)
  dismissedForDays: number
}

export const mapAlertBanner = ({ fields, sys }: IAlertBanner): AlertBanner => ({
  id: sys.id,
  showAlertBanner: fields.showAlertBanner ?? false,
  bannerVariant: fields.bannerVariant ?? 'default',
  title: fields.title ?? '',
  description: fields.description ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  isDismissable: fields.isDismissable ?? true,
  dismissedForDays: fields.dismissedForDays ?? 7,
})
