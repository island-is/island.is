import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IStep } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class Step {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  slug?: string

  @Field({ nullable: true })
  stepType?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  subtitle?: Array<typeof SliceUnion>

  @Field({ nullable: true })
  config?: string
}

export const mapStep = ({ sys, fields }: IStep): SystemMetadata<Step> => ({
  typename: 'AccordionSlice',
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  stepType: fields.stepType ?? '',
  subtitle: fields.subtitle
    ? mapDocument(fields.subtitle, sys.id + ':subtitle')
    : [],
  config: fields.config ? JSON.stringify(fields.config) : '',
})
