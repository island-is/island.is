import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IAccordionSlice } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'
import { mapOneColumnText, OneColumnText } from './oneColumnText.model'

@ObjectType()
export class AccordionSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  type!: string

  @CacheField(() => [OneColumnText], { nullable: true })
  accordionItems?: Array<OneColumnText>

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean

  @Field(() => Boolean, { nullable: true })
  showTitle?: boolean

  @Field({ nullable: true })
  titleHeadingLevel?: string
}

export const mapAccordionSlice = ({
  sys,
  fields,
}: IAccordionSlice): SystemMetadata<AccordionSlice> => ({
  typename: 'AccordionSlice',
  id: sys.id,
  title: fields.title ?? '',
  type: fields.type ?? '',
  accordionItems: (fields.accordionItems ?? []).map(mapOneColumnText),
  hasBorderAbove: fields.hasBorderAbove ?? true,
  showTitle: fields.showTitle ?? true,
  titleHeadingLevel: fields.titleHeadingLevel ?? 'h2',
})
