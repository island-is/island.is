import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericTag } from '../generated/contentfulTypes'
import { GenericTagGroup, mapGenericTagGroup } from './genericTagGroup.model'

@ObjectType()
export class GenericTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @CacheField(() => GenericTagGroup, { nullable: true })
  genericTagGroup!: GenericTagGroup | null
}

export const mapGenericTag = ({ sys, fields }: IGenericTag): GenericTag => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  genericTagGroup: fields.genericTagGroup
    ? mapGenericTagGroup(fields.genericTagGroup)
    : null,
})
