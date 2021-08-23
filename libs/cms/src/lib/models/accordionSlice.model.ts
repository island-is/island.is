import { Field, ID, ObjectType } from '@nestjs/graphql'

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

  @Field(() => [OneColumnText], { nullable: true })
  accordionItems?: Array<OneColumnText>
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
})
