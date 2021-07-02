import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IStep } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class Step {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  slug?: string

  @Field(() => [SliceUnion], { nullable: true })
  subtitle?: Array<typeof SliceUnion>

  @Field(() => [SliceUnion], { nullable: true })
  text?: Array<typeof SliceUnion>

  @Field()
  isAnswer?: boolean

  @Field({ nullable: true })
  options?: string
}

export const mapStep = ({ sys, fields }: IStep): SystemMetadata<Step> => ({
  typename: 'AccordionSlice',
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  subtitle: fields.subtitle
    ? mapDocument(fields.subtitle, sys.id + ':subtitle')
    : [],
  text: fields.text ? mapDocument(fields.text, sys.id + ':text') : [],
  isAnswer: fields.isAnswer ?? false,
  options: fields.options ? JSON.stringify(fields.options) : '[]',
})
